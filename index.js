const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');

const static = require('./config.json');
const fs = require('fs');

(() => {
  setInterval(async () => {
    console.log("[+] started fetching");
    let website = await fetch(static.url, { method: 'GET' });
    website = await website.text();
    
    let $ = cheerio.load(website),
    bio = $('.about-me-header').text().replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g,'').slice(1).slice(0, -1),
    config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
    
    if (config.lastMessage !== bio) {
      console.log(`[!] change! old: ${config.lastMessage} - new: ${bio}`);
      config.lastMessage = bio;
    };
    
    config.lastMessageCheck = new Date().valueOf();
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
    console.log("[+] done fetching");
  }, 1000 * static.intervalSeconds);
})();