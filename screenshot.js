const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  await page.goto('https://hansbury-sip-pulse.base44.app/', { waitUntil: 'networkidle0' });

  // Scroll down to trigger the leaderboard to load/render
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await new Promise(resolve => setTimeout(resolve, 1000)); // give it a second to settle

  const element = await page.waitForSelector('#sips-leaderboard-widget', { visible: true, timeout: 10000 });
  await element.scrollIntoView();
  await element.screenshot({ path: 'leaderboard.png' });

  await browser.close();
})();
