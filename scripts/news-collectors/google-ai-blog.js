const https = require('https');

function parseAtom(xml) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entryContent = match[1];
    const titleMatch = entryContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = entryContent.match(/<link[^>]*href="([^"]+)"[^>]*>/) || entryContent.match(/<link[^>]*href='([^']+)'[^>]*>/);
    const idMatch = entryContent.match(/<id>([^<]+)<\/id>/);
    const publishedMatch = entryContent.match(/<published>([^<]+)<\/published>/);
    const summaryMatch = entryContent.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/);

    if (titleMatch) {
      entries.push({
        title: titleMatch[1].trim(),
        url: linkMatch ? linkMatch[1].trim() : (idMatch ? idMatch[1].trim() : ''),
        summary: summaryMatch ? summaryMatch[1].replace(/<[^>]*>/g, '').trim().substring(0, 200) + '...' : '',
        published: publishedMatch ? publishedMatch[1].trim() : ''
      });
    }
  }

  return entries;
}

async function fetchGoogleAIBlog() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'blog.google',
      path: '/innovation-and-ai/technology/ai/rss/',
      method: 'GET',
      headers: {
        'Accept': 'application/atom+xml, application/xml',
        'User-Agent': 'DailyAINewsBot/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const entries = parseAtom(data);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14);

          const recentNews = entries
            .filter(item => {
              if (item.published) {
                const pubDate = new Date(item.published);
                if (pubDate < sevenDaysAgo) return false;
              }
              return true;
            })
            .slice(0, 5)
            .map((item, index) => ({
              id: `google-ai-${index}-${Date.now()}`,
              title: item.title,
              url: item.url,
              source: 'Google AI Blog',
              summary: item.summary,
              published: item.published,
              category: 'Official'
            }));

          resolve(recentNews);
        } catch (e) {
          reject(new Error('Atom parsing failed: ' + e.message));
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

module.exports = { fetchGoogleAIBlog };
