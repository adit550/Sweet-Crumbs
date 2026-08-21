const https = require('https');

function searchUnsplash(query) {
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' site:unsplash.com')}`;
  console.log(`Searching for: ${query}...`);
  
  https.get(searchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    }
  }, (res) => {
    let html = '';
    res.on('data', (chunk) => html += chunk);
    res.on('end', () => {
      const regex = /unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/g;
      let match;
      const ids = [];
      while ((match = regex.exec(html)) !== null) {
        ids.push(match[1]);
      }
      const uniqueIds = [...new Set(ids)];
      console.log(`Results for "${query}":`, uniqueIds.slice(0, 3));
    });
  }).on('error', (err) => console.error(err));
}

searchUnsplash('blueberry cheesecake');
setTimeout(() => searchUnsplash('lemon cheesecake'), 2000);
