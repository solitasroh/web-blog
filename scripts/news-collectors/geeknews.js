/**
 * GeekNews RSS Collector
 * GeekNews RSS 피드 파싱 (간단한 XML 파서 사용)
 */

const https = require('https');

// 간단한 XML 파서
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

// GeekNews RSS 피드 가져오기
async function fetchGeekNews() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'news.hada.io',
      path: '/rss',
      method: 'GET',
      headers: {
        'Accept': 'application/rss+xml, application/xml'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const items = parseRSS(data);
          
          // AI 관련 키워드 필터링 (확대)
          const aiKeywords = ['AI', '인공지능', 'ChatGPT', 'Claude', 'GPT', '머신러닝', '딥러닝', 'LLM', 'OpenAI', 'Anthropic', 'Gemini', 'Mistral', 'Llama', 'Copilot', 'Cursor', 'stable diffusion', 'midjourney', 'dall-e', 'sora', 'transformer', '파인튜닝', '프롬프트', '벡터DB', '임베딩', 'RAG', 'LangChain', 'tensorflow', 'pytorch', 'huggingface', '논문', '연구'];
          
          const aiNews = items
            .filter(item => {
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
              published: item.published
            }));
          
          resolve(aiNews);
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

module.exports = { fetchGeekNews };
