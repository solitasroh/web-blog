#!/usr/bin/env node
/**
 * Daily AI News Collector
 * 공식 소스 + 커뮤니티 읽을거리 + 논문 1건 구조
 */

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) process.env[match[1]] = match[2];
    });
  }
}
loadEnv();

const { collectHackerNewsAI } = require('./news-collectors/hackernews');
const { collectArxivAI } = require('./news-collectors/arxiv');
const { fetchGeekNews } = require('./news-collectors/geeknews');
const { fetchRedditAI } = require('./news-collectors/reddit');
const { fetchOpenAIBlog } = require('./news-collectors/openai-blog');
const { fetchGoogleAIBlog } = require('./news-collectors/google-ai-blog');
const { fetchAnthropicBlog } = require('./news-collectors/anthropic-blog');
const { fetchLobstersAI } = require('./news-collectors/lobsters');

const CONFIG = {
  stateFile: path.join(__dirname, '../.claw/news-state.json'),
  reportFile: path.join(__dirname, '../.claw/daily-report.md'),
  slots: {
    official: 3,
    community: 4,
    research: 1
  }
};

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG.stateFile, 'utf8'));
  } catch {
    return { lastDate: null, pending: false, selectedNews: [] };
  }
}

function saveState(state) {
  fs.mkdirSync(path.dirname(CONFIG.stateFile), { recursive: true });
  fs.writeFileSync(CONFIG.stateFile, JSON.stringify(state, null, 2));
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function scoreItem(item) {
  let score = 0;

  if (item.bucket === 'official') score += 50;
  if (item.bucket === 'community') score += 30;
  if (item.bucket === 'research') score += 20;

  if (item.source === 'Anthropic Blog' || item.source === 'OpenAI Blog' || item.source === 'Google AI Blog') score += 15;
  if (item.source === 'GeekNews') score += 12;
  if (item.source === 'Hacker News') score += 10;
  if (item.source === 'Lobsters AI') score += 8;
  if (item.source === 'Reddit') score -= 3;

  if (item.points) score += Math.min(item.points, 40) / 4;
  if (item.comments) score += Math.min(item.comments, 30) / 6;

  const text = `${item.title || ''} ${item.summary || ''}`.toLowerCase();
  if (text.includes('claude') || text.includes('openai') || text.includes('gpt') || text.includes('gemini')) score += 6;
  if (text.includes('release') || text.includes('launch') || text.includes('출시') || text.includes('공개')) score += 4;
  if (text.includes('show hn') || text.includes('show gn')) score += 3;
  if ((item.summary || '').length < 20) score -= 2;

  return score;
}

function dedupeByUrl(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (!item.url || seen.has(item.url)) continue;
    seen.add(item.url);
    out.push(item);
  }
  return out;
}

async function collectNews() {
  console.log('뉴스 수집 중...\n');

  const official = [];
  const community = [];
  const research = [];

  console.log('1. OpenAI Blog 검색 중...');
  try {
    const items = await fetchOpenAIBlog();
    console.log(`   수집 ${items.length}건`);
    official.push(...items.map(n => ({ ...n, bucket: 'official', category: 'Official' })));
  } catch (e) {
    console.error('   OpenAI Blog 실패:', e.message);
  }

  console.log('2. Google AI Blog 검색 중...');
  try {
    const items = await fetchGoogleAIBlog();
    console.log(`   수집 ${items.length}건`);
    official.push(...items.map(n => ({ ...n, bucket: 'official', category: 'Official' })));
  } catch (e) {
    console.error('   Google AI Blog 실패:', e.message);
  }

  console.log('3. Anthropic Blog 검색 중...');
  try {
    const items = await fetchAnthropicBlog();
    console.log(`   수집 ${items.length}건`);
    official.push(...items.map(n => ({ ...n, bucket: 'official', category: 'Official' })));
  } catch (e) {
    console.error('   Anthropic Blog 실패:', e.message);
  }

  console.log('4. GeekNews 검색 중...');
  try {
    const items = await fetchGeekNews();
    console.log(`   수집 ${items.length}건`);
    community.push(...items.map(n => ({ ...n, bucket: 'community', category: 'Community' })));
  } catch (e) {
    console.error('   GeekNews 실패:', e.message);
  }

  console.log('5. Hacker News 검색 중...');
  try {
    const items = await collectHackerNewsAI();
    console.log(`   수집 ${items.length}건`);
    community.push(...items.map(n => ({ ...n, bucket: 'community', category: 'Community' })));
  } catch (e) {
    console.error('   Hacker News 실패:', e.message);
  }

  console.log('6. Lobsters AI 검색 중...');
  try {
    const items = await fetchLobstersAI();
    console.log(`   수집 ${items.length}건`);
    community.push(...items.map(n => ({ ...n, bucket: 'community', category: 'Community' })));
  } catch (e) {
    console.error('   Lobsters AI 실패:', e.message);
  }

  console.log('7. Reddit 검색 중...');
  try {
    const items = await fetchRedditAI();
    console.log(`   수집 ${items.length}건`);
    community.push(...items.map(n => ({ ...n, bucket: 'community', category: 'Community' })));
  } catch (e) {
    console.error('   Reddit 실패:', e.message);
  }

  console.log('8. arXiv 논문 검색 중...');
  try {
    const items = await collectArxivAI();
    console.log(`   수집 ${items.length}건`);
    research.push(...items.map(n => ({ ...n, bucket: 'research', category: 'Research' })));
  } catch (e) {
    console.error('   arXiv 실패:', e.message);
  }

  const officialSelected = dedupeByUrl(official)
    .map(item => ({ ...item, score: scoreItem(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, CONFIG.slots.official);

  const communitySelected = dedupeByUrl(community)
    .map(item => ({ ...item, score: scoreItem(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, CONFIG.slots.community);

  const researchSelected = dedupeByUrl(research)
    .map(item => ({ ...item, score: scoreItem(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, CONFIG.slots.research);

  return [...officialSelected, ...communitySelected, ...researchSelected];
}

function generateReport(news) {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const official = news.filter(n => n.category === 'Official');
  const community = news.filter(n => n.category === 'Community');
  const research = news.filter(n => n.category === 'Research');

  let report = `AI 뉴스 (${today})\n\n`;
  report += `오늘 추천 소식 (${news.length}건)\n\n`;

  if (official.length) {
    report += `【 공식 발표 】\n`;
    official.forEach((item, idx) => {
      report += `${idx + 1}. ${item.title}\n`;
      if (item.summary) {
        const s = item.summary.length > 80 ? item.summary.substring(0, 80) + '...' : item.summary;
        report += `   ${s}\n`;
      }
      report += `\n`;
    });
  }

  if (community.length) {
    report += `【 커뮤니티 읽을거리 】\n`;
    community.forEach((item, idx) => {
      report += `${idx + 1}. ${item.title}\n`;
      const meta = [];
      if (item.source) meta.push(item.source);
      if (item.points) meta.push(`포인트 ${item.points}`);
      if (item.comments) meta.push(`댓글 ${item.comments}`);
      if (meta.length) report += `   ${meta.join(' | ')}\n`;
      if (item.summary) {
        const s = item.summary.length > 80 ? item.summary.substring(0, 80) + '...' : item.summary;
        report += `   ${s}\n`;
      }
      report += `\n`;
    });
  }

  if (research.length) {
    report += `【 오늘의 논문 】\n`;
    research.forEach((item, idx) => {
      report += `${idx + 1}. ${item.title}\n`;
      if (item.authors && item.authors.length > 0) {
        report += `   ${item.authors.slice(0, 2).join(', ')}${item.authors.length > 2 ? ' 외' : ''}\n`;
      }
      report += `\n`;
    });
  }

  report += `어떤 내용을 블로그에 올릴까요?\n`;
  report += `(번호 입력, 예: 1, 3 또는 "전부" / "건너뛰기")`;
  return report;
}

async function main() {
  const today = getToday();
  const state = loadState();

  if (state.lastDate === today && !state.pending) {
    console.log('오늘 이미 처리 완료');
    return;
  }

  const news = await collectNews();
  if (news.length === 0) {
    console.log('수집된 뉴스가 없습니다');
    return;
  }

  const report = generateReport(news);
  state.lastDate = today;
  state.pending = true;
  state.collectedNews = news;
  saveState(state);

  fs.mkdirSync(path.dirname(CONFIG.reportFile), { recursive: true });
  fs.writeFileSync(CONFIG.reportFile, report);

  console.log('\n' + report);
  console.log('\n---STATE_PENDING---');
}

main().catch(console.error);
