#!/usr/bin/env node
/**
 * Daily AI News Collector
 * Hacker News + arXiv + GeekNews RSS를 사용하여 AI 뉴스 수집
 */

const fs = require('fs');
const path = require('path');

// .env 파일 직접 파싱
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        process.env[match[1]] = match[2];
      }
    });
  }
}
loadEnv();

// 뉴스 수집 모듈 로드
const { collectHackerNewsAI } = require('./news-collectors/hackernews');
const { collectArxivAI } = require('./news-collectors/arxiv');
const { fetchGeekNews } = require('./news-collectors/geeknews');
const { fetchRedditAI } = require('./news-collectors/reddit');

// 설정
const CONFIG = {
  category: 'Daily AI',
  maxNews: 8,
  stateFile: path.join(__dirname, '../.claw/news-state.json'),
  reportFile: path.join(__dirname, '../.claw/daily-report.md')
};

// 상태 파일 관리
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

// 오늘 날짜
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// 뉴스 수집
async function collectNews() {
  console.log('🔄 뉴스 수집 중...\n');
  
  const allNews = [];
  
  // 1. Hacker News
  console.log('1. Hacker News 검색 중...');
  try {
    const hnNews = await collectHackerNewsAI();
    console.log(`   ✓ ${hnNews.length}건 수집`);
    allNews.push(...hnNews.map(n => ({ ...n, category: 'Community' })));
  } catch (e) {
    console.error('   ✗ Hacker News 실패:', e.message);
  }
  
  // 2. arXiv
  console.log('2. arXiv 논문 검색 중...');
  try {
    const arxivPapers = await collectArxivAI();
    console.log(`   ✓ ${arxivPapers.length}건 수집`);
    allNews.push(...arxivPapers.map(n => ({ ...n, category: 'Research' })));
  } catch (e) {
    console.error('   ✗ arXiv 실패:', e.message);
  }
  
  // 3. GeekNews
  console.log('3. GeekNews RSS 검색 중...');
  try {
    const geekNews = await fetchGeekNews();
    console.log(`   ✓ ${geekNews.length}건 수집`);
    allNews.push(...geekNews.map(n => ({ ...n, category: 'Korean' })));
  } catch (e) {
    console.error('   ✗ GeekNews 실패:', e.message);
  }

  // 4. Reddit
  console.log('4. Reddit r/artificialinteligence 검색 중...');
  try {
    const redditNews = await fetchRedditAI();
    console.log(`   ✓ ${redditNews.length}건 수집`);
    allNews.push(...redditNews.map(n => ({ ...n, category: 'Community' })));
  } catch (e) {
    console.error('   ✗ Reddit 실패:', e.message);
  }
  
  // 중복 제거 (URL 기준)
  const seenUrls = new Set();
  const uniqueNews = [];
  
  for (const news of allNews) {
    if (!seenUrls.has(news.url) && uniqueNews.length < CONFIG.maxNews) {
      seenUrls.add(news.url);
      uniqueNews.push(news);
    }
  }
  
  return uniqueNews;
}

// 텔레그램 보고 메시지 생성
function generateReport(news) {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  
  let report = `📰 AI 뉴스 (${today})\n\n`;
  report += `오늘 수집된 소식 (${news.length}건):\n\n`;
  
  // 카테고리별 그룹화
  const byCategory = {
    'Community': [],
    'Research': [],
    'Korean': []
  };
  
  news.forEach(item => {
    const cat = byCategory[item.category] ? item.category : 'Other';
    byCategory[cat].push(item);
  });
  
  // 커뮤니티 뉴스
  if (byCategory['Community'].length > 0) {
    report += `【 커뮤니티 】\n`;
    byCategory['Community'].forEach((item, index) => {
      report += `${index + 1}. ${item.title}\n`;
      report += `   💬 ${item.comments || 0}댓글 | 👍 ${item.points || 0}\n`;
      if (item.summary) {
        const shortSummary = item.summary.length > 60 
          ? item.summary.substring(0, 60) + '...' 
          : item.summary;
        report += `   ${shortSummary}\n`;
      }
      report += `\n`;
    });
  }
  
  // 연구 논문
  if (byCategory['Research'].length > 0) {
    report += `【 연구 논문 】\n`;
    byCategory['Research'].forEach((item, index) => {
      report += `${index + 1}. ${item.title}\n`;
      if (item.authors && item.authors.length > 0) {
        report += `   ✍️ ${item.authors.slice(0, 2).join(', ')}${item.authors.length > 2 ? ' 외' : ''}\n`;
      }
      report += `\n`;
    });
  }
  
  // 국내 뉴스
  if (byCategory['Korean'].length > 0) {
    report += `【 국내 소식 】\n`;
    byCategory['Korean'].forEach((item, index) => {
      report += `${index + 1}. ${item.title}\n`;
      if (item.summary) {
        const shortSummary = item.summary.length > 60 
          ? item.summary.substring(0, 60) + '...' 
          : item.summary;
        report += `   ${shortSummary}\n`;
      }
      report += `\n`;
    });
  }
  
  report += `💬 어떤 내용을 블로그에 올릴까요?\n`;
  report += `(번호 입력, 예: 1, 3, 5 또는 "전부" / "걸뛰기")`;
  
  return report;
}

// 메인 함수
async function main() {
  const today = getToday();
  const state = loadState();
  
  // 이미 오늘 처리했는지 확인
  if (state.lastDate === today && !state.pending) {
    console.log('오늘 이미 처리 완료');
    return;
  }
  
  // 뉴스 수집
  const news = await collectNews();
  
  if (news.length === 0) {
    console.log('수집된 뉴스가 없습니다');
    return;
  }
  
  // 보고서 생성
  const report = generateReport(news);
  
  // 상태 저장
  state.lastDate = today;
  state.pending = true;
  state.collectedNews = news;
  saveState(state);
  
  // 보고서 파일 저장
  fs.mkdirSync(path.dirname(CONFIG.reportFile), { recursive: true });
  fs.writeFileSync(CONFIG.reportFile, report);
  
  // 콘솔 출력
  console.log('\n' + report);
  console.log('\n---STATE_PENDING---');
}

main().catch(console.error);
