/**
 * Auto News Selector
 * 객관적 기준으로 뉴스 자동 선별
 */

// 선별 기준 설정
const CRITERIA = {
  hackernews: {
    minPoints: 30,
    minComments: 15
  },
  reddit: {
    minScore: 100,
    minComments: 20
  },
  arxiv: {
    maxPapers: 5
  },
  geeknews: {
    maxNews: 3
  }
};

// Hacker News 필터
function filterHackerNews(news) {
  return news.filter(item => 
    (item.points >= CRITERIA.hackernews.minPoints) ||
    (item.comments >= CRITERIA.hackernews.minComments)
  );
}

// Reddit 필터
function filterReddit(news) {
  return news.filter(item =>
    (item.score >= CRITERIA.reddit.minScore) ||
    (item.comments >= CRITERIA.reddit.minComments)
  );
}

// arXiv 필터 (최신 N건)
function filterArxiv(news) {
  return news.slice(0, CRITERIA.arxiv.maxPapers);
}

// GeekNews 필터 (최신 N건)
function filterGeekNews(news) {
  return news.slice(0, CRITERIA.geeknews.maxNews);
}

// 중복 제거 (URL 기준)
function removeDuplicates(newsList) {
  const seenUrls = new Set();
  return newsList.filter(item => {
    if (seenUrls.has(item.url)) return false;
    seenUrls.add(item.url);
    return true;
  });
}

// 최종 선별
function autoSelectNews(allNews) {
  const selected = [];
  
  // 카테고리별 분류
  const byCategory = {
    'Community': allNews.filter(n => n.category === 'Community'),
    'Research': allNews.filter(n => n.category === 'Research'),
    'Korean': allNews.filter(n => n.category === 'Korean')
  };
  
  // Community: Hacker News + Reddit 필터링
  const communityNews = [
    ...filterHackerNews(byCategory['Community'].filter(n => n.source === 'Hacker News')),
    ...filterReddit(byCategory['Community'].filter(n => n.source.includes('Reddit')))
  ];
  selected.push(...communityNews.slice(0, 3));
  
  // Research: arXiv 최신 3건
  const researchNews = filterArxiv(byCategory['Research']);
  selected.push(...researchNews.slice(0, 3));
  
  // Korean: GeekNews 최신 2건
  const koreanNews = filterGeekNews(byCategory['Korean']);
  selected.push(...koreanNews.slice(0, 2));
  
  // 중복 제거 및 최종 정렬
  const uniqueSelected = removeDuplicates(selected);
  
  // 점수/중요도 순 정렬
  return uniqueSelected.sort((a, b) => {
    const scoreA = (a.points || a.score || 0) + (a.comments || 0) * 2;
    const scoreB = (b.points || b.score || 0) + (b.comments || 0) * 2;
    return scoreB - scoreA;
  }).slice(0, 7);
}

module.exports = { autoSelectNews, CRITERIA };
