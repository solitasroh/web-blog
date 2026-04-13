/**
 * GeekNews RSS Collector
 * GeekNews Atom 피드 파싱
 */

const https = require('https');

// Atom XML 파서
function parseAtom(xml) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entryContent = match[1];

    const titleMatch = entryContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = entryContent.match(/<link[^>]*rel='alternate'[^>]*href='([^']+)'/);
    const idMatch = entryContent.match(/<id>([^<]+)<\/id>/);
    const publishedMatch = entryContent.match(/<published>([^<]+)<\/published>/);
    const contentMatch = entryContent.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/);
    const authorMatch = entryContent.match(/<author>[\s\S]*?<name>([^<]+)<\/name>/);

    if (titleMatch) {
      entries.push({
        title: titleMatch[1].trim(),
        url: linkMatch ? linkMatch[1].trim() : (idMatch ? idMatch[1].trim() : ''),
        summary: contentMatch ? contentMatch[1].replace(/<[^>]*>/g, '').trim().substring(0, 200) + '...' : '',
        published: publishedMatch ? publishedMatch[1].trim() : '',
        author: authorMatch ? authorMatch[1].trim() : 'GeekNews'
      });
    }
  }

  return entries;
}

// GeekNews RSS 피드 가져오기 (최근 7일)
async function fetchGeekNews() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'feeds.feedburner.com',
      path: '/geeknews-feed',
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

          // AI 관련 키워드 필터링 (확대)
          const aiKeywords = [
            'AI', '인공지능', 'ChatGPT', 'Claude', 'GPT', '머신러닝', '딥러닝', 'LLM',
            'OpenAI', 'Anthropic', 'Gemini', 'Mistral', 'Llama', 'Copilot', 'Cursor',
            'stable diffusion', 'midjourney', 'dall-e', 'sora', 'transformer',
            '파인튜닝', '프롬프트', '벡터DB', '임베딩', 'RAG', 'LangChain',
            'tensorflow', 'pytorch', 'huggingface', '논문', '연구'
          ];

          // 최근 7일 필터
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          const aiNews = entries
            .filter(item => {
              // 날짜 필터
              if (item.published) {
                const pubDate = new Date(item.published);
                if (pubDate < sevenDaysAgo) return false;
              }
              // AI 키워드 필터
              const content = (item.title + ' ' + item.summary).toLowerCase();
              return aiKeywords.some(keyword => content.includes(keyword.toLowerCase()));
            })
            .slice(0, 5)
            .map((item, index) => ({
              id: `geek-${index}-${Date.now()}`,
              title: item.title,
              url: item.url,
              source: 'GeekNews',
              summary: item.summary,
              published: item.published,
              author: item.author
            }));

          resolve(aiNews);
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

module.exports = { fetchGeekNews };
