/**
 * DCinside IT/과학 갤러리 크롤러
 */

const https = require('https');

// HTML에서 게시글 파싱
function parseDCinside(html) {
  const posts = [];
  // 간단한 파싱 - 실제로는 더 복잡할 수 있음
  const titleRegex = /<a[^>]*class="us-post"[^>]*>(.*?)<\/a>/g;
  let match;
  
  while ((match = titleRegex.exec(html)) !== null) {
    const title = match[1].replace(/<[^>]*>/g, '').trim();
    if (title && posts.length < 5) {
      posts.push({
        title: title,
        url: 'https://gall.dcinside.com/board/lists/?id=dcbest',
        summary: 'DCinside IT/과학 갤러리 인기글',
        published: new Date().toISOString()
      });
    }
  }
  
  return posts;
}

// DCinside 크롤링
async function fetchDCinside() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'gall.dcinside.com',
      path: '/board/lists/?id=dcbest',
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // AI 키워드 필터링
          const aiKeywords = ['AI', '인공지능', 'ChatGPT', 'Claude', 'GPT', 'LLM', 'OpenAI', 'Anthropic'];
          
          const posts = parseDCinside(data)
            .filter(item => {
              const content = item.title.toLowerCase();
              return aiKeywords.some(keyword => content.includes(keyword.toLowerCase()));
            })
            .slice(0, 3)
            .map((item, index) => ({
              id: `dcinside-${index}-${Date.now()}`,
              title: item.title,
              url: item.url,
              source: 'DCinside IT/과학',
              summary: item.summary,
              published: item.published,
              category: 'Korean'
            }));

          resolve(posts);
        } catch (e) {
          reject(new Error('Parsing failed: ' + e.message));
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

module.exports = { fetchDCinside };
