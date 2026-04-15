/**
 * Anthropic Blog RSS Collector
 * Anthropic 블로그 RSS 피드 파싱
 */

const https = require('https');

// RSS XML 파서
function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
    const descMatch = itemContent.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);
    const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);

    if (titleMatch) {
      items.push({
        title: titleMatch[1].trim(),
        url: linkMatch ? linkMatch[1].trim() : '',
        summary: descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim().substring(0, 200) + '...' : '',
        published: pubDateMatch ? pubDateMatch[1].trim() : ''
      });
    }
  }

  return items;
}

// Anthropic Blog RSS 피드 가져오기 (최근 7일)
async function fetchAnthropicBlog() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.anthropic.com',
      path: '/rss.xml',
      method: 'GET',
      headers: {
        'Accept': 'application/rss+xml, application/xml',
        'User-Agent': 'DailyAINewsBot/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const items = parseRSS(data);

          // 최근 7일 필터
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          const recentNews = items
            .filter(item => {
              if (item.published) {
                const pubDate = new Date(item.published);
                if (pubDate < sevenDaysAgo) return false;
              }
              return true;
            })
            .slice(0, 3)
            .map((item, index) => ({
              id: `anthropic-${index}-${Date.now()}`,
              title: item.title,
              url: item.url,
              source: 'Anthropic Blog',
              summary: item.summary,
              published: item.published,
              category: 'Research'
            }));

          resolve(recentNews);
        } catch (e) {
          reject(new Error('RSS parsing failed: ' + e.message));
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

module.exports = { fetchAnthropicBlog };
