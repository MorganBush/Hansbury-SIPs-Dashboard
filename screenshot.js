const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  await page.goto('https://hansbury-sip-pulse.base44.app', { waitUntil: 'networkidle0' });

  const element = await page.waitForSelector('#sips-leaderboard-widget');
  await element.screenshot({ path: 'leaderboard.png' });

  await browser.close();
})();
