const puppeteer = require('puppeteer');

const sleep = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms * 1000)
    })
}

(async () => {
  const address = process.argv[2];
  const timeOnPage = parseInt(process.argv[3]);

  const browsers = []
  for (let i = 0; i < 5; i++) {
      const browser = await puppeteer.launch();
      for (let j = 0; j < 3; j++) {
        console.log('Launching page: ', i, j)
        const page = await browser.newPage();
        await page.setViewport({ width: 75, height: 150 })
        await page.goto(address);
        await sleep(Math.random() + 0.5)
      }
      browsers.push(browser)
  }
  await sleep(timeOnPage)
  for (let browser of browsers) {
    browser.close();
  }
})();
