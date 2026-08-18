const puppeteer = require('puppeteer');

async function trySelector(page, selector, timeout) {
  try {
    await page.waitForSelector(selector, { visible: true, timeout });
    return true;
  } catch {
    return false;
  }
}

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  await page.goto('https://hansbury-sip-pulse.base44.app/', {
    waitUntil: 'domcontentloaded',
    timeout: 90000
  });

  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await new Promise(resolve => setTimeout(resolve, 2000));

  let found = await trySelector(page, '#sips-leaderboard-widget', 45000);

  if (!found) {
    // App may still be cold-starting — reload and give it a second shot
    console.log('First attempt timed out, retrying after reload...');
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise(resolve => setTimeout(resolve, 2000));
    found = await trySelector(page, '#sips-leaderboard-widget', 45000);
  }

  if (!found) {
    throw new Error('Leaderboard widget did not appear after retry.');
  }

  const element = await page.$('#sips-leaderboard-widget');
  await element.scrollIntoView();
  await element.screenshot({ path: 'leaderboard.png' });

  await browser.close();
})();
