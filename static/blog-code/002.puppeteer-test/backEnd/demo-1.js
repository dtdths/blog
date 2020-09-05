const puppeteer = require('puppeteer');

(async (pageUrl, cookie) => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com');
  page.close();
  // browser.close();
})()