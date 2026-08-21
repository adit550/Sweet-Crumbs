const https = require('https');

function getImageUrl(filename) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`;
  
  https.get(url, { headers: { 'User-Agent': 'BakeryBot/1.0 (contact: admin@bakery.com)' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const pages = json.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId === '-1') {
          console.log(`File ${filename} not found.`);
        } else {
          console.log(`URL for ${filename}:`, pages[pageId].imageinfo[0].url);
        }
      } catch (e) {
        console.error(e);
      }
    });
  });
}

getImageUrl('Blueberry_cheesecake.jpg');
getImageUrl('Blueberry_cheesecake_slice.jpg');
getImageUrl('Lemon_cheesecake_special_with_raspberries.jpg');
getImageUrl('Lemoncheesecake-Slice.jpg');
