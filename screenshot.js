const puppeteer = require('puppeteer');

(async () => {
  const period = process.env.SCREENSHOT_PERIOD || 'today';
  const url = `https://hansbury-sip-pulse.base44.app/?period=${period}`;

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });

  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await new Promise(resolve => setTimeout(resolve, 2000));

  async function trySelector(timeout) {
    try {
      await page.waitForSelector('#sips-leaderboard-widget', { visible: true, timeout });
      return true;
    } catch {
      return false;
    }
  }

  let found = await trySelector(45000);
  if (!found) {
    console.log('First attempt timed out, retrying after reload...');
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise(resolve => setTimeout(resolve, 2000));
    found = await trySelector(45000);
  }

  if (!found) {
    throw new Error('Leaderboard widget did not appear after retry.');
  }

  const element = await page.$('#sips-leaderboard-widget');
  await element.scrollIntoView();
  await element.screenshot({ path: 'leaderboard.png' });

  await browser.close();
})();
