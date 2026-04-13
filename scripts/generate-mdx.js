#!/usr/bin/env node
/**
 * MDX Generator
 * 선택된 뉴스를 MDX 포스트로 변환
 */

const fs = require('fs');
const path = require('path');

// 설정
const CONFIG = {
  postsDir: path.join(__dirname, '../apps/blog/content/posts/daily-ai'),
  stateFile: path.join(__dirname, '../.claw/news-state.json')
};

// 상태 로드
function loadState() {
  return JSON.parse(fs.readFileSync(CONFIG.stateFile, 'utf8'));
}

// 슬러그 생성
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// MDX 생성
function generateMDX(newsItem, date) {
  const slug = createSlug(newsItem.title);
  const title = newsItem.title;
  
  let mdx = `---
`;
  mdx += `title: "${title}"
`;
  mdx += `date: "${date}"
`;
  mdx += `description: "${newsItem.summary || title}"
`;
  mdx += `tags: ["Daily AI"`;
  
  // 태그 추가
  if (title.toLowerCase().includes('claude')) {
    mdx += `, "Claude"`;
  }
  if (title.toLowerCase().includes('openai') || title.toLowerCase().includes('gpt')) {
    mdx += `, "OpenAI"`;
  }
  mdx += `]
`;
  mdx += `category: "Daily AI"
`;
  mdx += `source: "${newsItem.source || ''}"
`;
  mdx += `---

`;
  mdx += `# ${title}

`;
  mdx += `${newsItem.summary || '상세 내용 준비 중'}

`;
  
  if (newsItem.url) {
    mdx += `## 참고

`;
    mdx += `- [${newsItem.source || '원문 보기'}](${newsItem.url})
`;
    mdx += `- 출처: ${newsItem.source || '미상'}
`;
    mdx += `- 발행일: ${date}
`;
  }
  
  return { mdx, slug };
}

// 메인 함수
function main() {
  const state = loadState();
  
  if (!state.selectedNews || state.selectedNews.length === 0) {
    console.error('선택된 뉴스가 없습니다');
    process.exit(1);
  }
  
  const date = state.lastDate;
  const generatedFiles = [];
  
  // posts 디렉토리 생성
  fs.mkdirSync(CONFIG.postsDir, { recursive: true });
  
  // 각 뉴스별 MDX 생성
  for (const news of state.selectedNews) {
    const { mdx, slug } = generateMDX(news, date);
    const filename = `${date}-${slug}.mdx`;
    const filepath = path.join(CONFIG.postsDir, filename);
    
    fs.writeFileSync(filepath, mdx);
    generatedFiles.push(filename);
    console.log(`생성됨: ${filename}`);
  }
  
  // 결과 저장
  state.generatedFiles = generatedFiles;
  fs.writeFileSync(CONFIG.stateFile, JSON.stringify(state, null, 2));
  
  console.log(`\n총 ${generatedFiles.length}개 파일 생성 완료`);
}

main();
