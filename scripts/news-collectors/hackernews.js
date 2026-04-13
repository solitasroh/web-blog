/**
 * Hacker News AI News Collector
 * Hacker News API를 사용하여 AI 관련 소식 수집
 */

const https = require('https');

const ALGOLIA_API = 'hn.algolia.com';

// Hacker News에서 AI 관련 검색
async function searchHackerNews(query = 'AI artificial intelligence', hitsPerPage = 10) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query);
    const path = `/api/v1/search?query=${encodedQuery}&tags=story&hitsPerPage=${hitsPerPage}`;
    
    const options = {
      hostname: ALGOLIA_API,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.hits || []);
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

// AI 관련 키워드로 검색
async function collectHackerNewsAI() {
  const queries = [
    'AI artificial intelligence',
    'machine learning',
    'Claude Anthropic',
    'OpenAI GPT',
    'Google Gemini'
  ];
  
  const allNews = [];
  const seenIds = new Set();
  
  for (const query of queries) {
    try {
      const hits = await searchHackerNews(query, 5);
      
      for (const hit of hits) {
        // 7일 이내의 글만 (일주일)
        const createdAt = new Date(hit.created_at);
        const hoursAgo = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
        
        if (hoursAgo <= 168 && !seenIds.has(hit.objectID)) {
          seenIds.add(hit.objectID);
          allNews.push({
            id: `hn-${hit.objectID}`,
            title: hit.title,
            url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
            source: 'Hacker News',
            points: hit.points,
            comments: hit.num_comments,
            createdAt: hit.created_at,
            summary: hit.story_text ? hit.story_text.substring(0, 200) + '...' : '',
            author: hit.author
          });
        }
      }
    } catch (e) {
      console.error(`Hacker News search failed for "${query}":`, e.message);
    }
  }
  
  // 점수 순으로 정렬
  return allNews.sort((a, b) => b.points - a.points).slice(0, 5);
}

module.exports = { collectHackerNewsAI };
