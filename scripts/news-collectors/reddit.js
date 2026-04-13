/**
 * Reddit AI News Collector
 * Reddit r/artificialinteligence에서 AI 뉴스 수집
 */

const https = require('https');

// Reddit JSON API (인증 불필요, 읽기 전용)
async function fetchRedditAI(subreddit = 'artificialinteligence', limit = 5) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.reddit.com',
      path: `/r/${subreddit}/hot.json?limit=${limit}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DailyAINewsBot/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const posts = json.data?.children || [];
          
          const news = posts
            .filter(post => !post.data.stickied) // 고정글 제외
            .map(post => ({
              id: `reddit-${post.data.id}`,
              title: post.data.title,
              url: post.data.url,
              source: 'Reddit r/artificialinteligence',
              summary: post.data.selftext?.substring(0, 200) + '...' || '',
              score: post.data.score,
              comments: post.data.num_comments,
              author: post.data.author
            }));
          
          resolve(news);
        } catch (e) {
          reject(new Error('JSON parsing failed: ' + e.message));
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

module.exports = { fetchRedditAI };
