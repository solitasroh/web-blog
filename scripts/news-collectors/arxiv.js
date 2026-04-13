/**
 * arXiv AI Papers Collector
 * arXiv API를 사용하여 AI/ML 관련 논문 수집 (간단한 XML 파서)
 */

const https = require('https');

// 간단한 Atom XML 파서
function parseAtom(xml) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entryContent = match[1];

    const titleMatch = entryContent.match(/<title>([\s\S]*?)<\/title>/);
    const idMatch = entryContent.match(/<id>(.*?)<\/id>/);
    const summaryMatch = entryContent.match(/<summary>([\s\S]*?)<\/summary>/);
    const publishedMatch = entryContent.match(/<published>(.*?)<\/published>/);

    // 저자 추출
    const authors = [];
    const authorRegex = /<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g;
    let authorMatch;
    while ((authorMatch = authorRegex.exec(entryContent)) !== null) {
      authors.push(authorMatch[1]);
    }

    // 카테고리 추출
    const categories = [];
    const catRegex = /<category\s+term="([^"]+)"/g;
    let catMatch;
    while ((catMatch = catRegex.exec(entryContent)) !== null) {
      categories.push(catMatch[1]);
    }

    if (titleMatch) {
      entries.push({
        title: titleMatch[1].replace(/\n/g, ' ').trim(),
        url: idMatch ? idMatch[1].trim() : '',
        summary: summaryMatch ? summaryMatch[1].substring(0, 300).replace(/\n/g, ' ').trim() + '...' : '',
        authors: authors,
        published: publishedMatch ? publishedMatch[1].trim() : '',
        categories: categories
      });
    }
  }

  return entries;
}

// arXiv에서 AI/ML 논문 검색
async function searchArxiv(category = 'cs.AI', maxResults = 5) {
  return new Promise((resolve, reject) => {
    // 오늘 날짜 기준 최근 7일
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dateStr = sevenDaysAgo.toISOString().split('T')[0].replace(/-/g, '');
    const todayStr = today.toISOString().split('T')[0].replace(/-/g, '');

    const path = `/api/query?search_query=cat:${category}+AND+submittedDate:[${dateStr}0000+TO+${todayStr}2359]&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;

    const options = {
      hostname: 'export.arxiv.org',
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/atom+xml'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const papers = parseAtom(data);
          resolve(papers);
        } catch (e) {
          reject(new Error('XML parsing failed: ' + e.message));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

// AI/ML 관련 논문 수집
async function collectArxivAI() {
  const categories = ['cs.AI', 'cs.LG', 'cs.CL'];
  const allPapers = [];
  const seenUrls = new Set();

  for (const category of categories) {
    try {
      const papers = await searchArxiv(category, 3);

      for (const paper of papers) {
        if (!seenUrls.has(paper.url)) {
          seenUrls.add(paper.url);
          allPapers.push({
            id: `arxiv-${paper.url.split('/').pop() || Date.now()}`,
            title: paper.title,
            url: paper.url,
            source: 'arXiv',
            summary: paper.summary,
            authors: paper.authors,
            published: paper.published,
            categories: paper.categories
          });
        }
      }
    } catch (e) {
      console.error(`arXiv search failed for "${category}":`, e.message);
    }
  }

  return allPapers.slice(0, 5);
}

module.exports = { collectArxivAI };
