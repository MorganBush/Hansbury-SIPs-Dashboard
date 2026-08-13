const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  await page.goto('https://hansbury-sip-pulse.base44.app/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Scroll down to trigger the leaderboard to load/render
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await new Promise(resolve => setTimeout(resolve, 2000)); // give data time to fetch and render

  const element = await page.waitForSelector('#sips-leaderboard-widget', { visible: true, timeout: 30000 });
  await element.scrollIntoView();
  await element.screenshot({ path: 'leaderboard.png' });

  await browser.close();
})();
