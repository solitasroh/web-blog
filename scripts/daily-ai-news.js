#!/usr/bin/env node
/**
 * Daily AI News Collector
 * Brave Search API를 사용하여 AI 뉴스 수집
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

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

// 설정
const CONFIG = {
  braveApiKey: process.env.BRAVE_API_KEY,
  category: 'Daily AI',
  topics: ['Claude', 'Claude Code', 'OpenAI', 'GPT', 'Anthropic', 'AI'],
  maxNews: 5,
  stateFile: path.join(__dirname, '../.claw/news-state.json'),
  reportFile: path.join(__dirname, '../.claw/daily-report.md')
};

// Brave Search API 호출
async function searchBrave(query, count = 5) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodedQuery}&count=${count}&freshness=pd`;
    
    const options = {
      headers: {
        'X-Subscription-Token': CONFIG.braveApiKey,
        'Accept': 'application/json'
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    }).on('error', reject);
  });
}

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
  const today = getToday();
  const allNews = [];
  
  // 검색할 키워드들
  const queries = [
    'Claude Anthropic release',
    'Claude Code update',
    'OpenAI GPT news'
  ];
  
  for (const query of queries) {
    try {
      const result = await searchBrave(query, 3);
      if (result.web && result.web.results) {
        for (const item of result.web.results) {
          allNews.push({
            id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: item.title,
            source: item.profile?.name || new URL(item.url).hostname,
            url: item.url,
            date: today,
            summary: item.description || '',
            verified: item.profile?.name ? true : false
          });
        }
      }
    } catch (e) {
      console.error(`Search failed for "${query}":`, e.message);
    }
  }
  
  // 중복 제거 및 최대 개수 제한
  const uniqueNews = [];
  const seenUrls = new Set();
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
  
  news.forEach((item, index) => {
    report += `${index + 1}. ${item.title}\n`;
    report += `   출처: ${item.source}\n`;
    if (item.summary) {
      const shortSummary = item.summary.length > 80 
        ? item.summary.substring(0, 80) + '...' 
        : item.summary;
      report += `   내용: ${shortSummary}\n`;
    }
    report += `   검증: ${item.verified ? '✅' : '⚠️'}\n`;
    report += `\n`;
  });
  
  report += `💬 어떤 내용을 블로그에 올릴까요?\n`;
  report += `(번호 입력, 예: 1, 3 또는 "전부" / "걸뛰기")`;
  
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
  
  // API 키 확인
  if (!CONFIG.braveApiKey) {
    console.error('BRAVE_API_KEY not found in .env');
    process.exit(1);
  }
  
  // 뉴스 수집
  console.log('뉴스 수집 중...');
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
  console.log(report);
  console.log('\n---STATE_PENDING---');
}

main().catch(console.error);
