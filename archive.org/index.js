const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

  const saveFolder = './images';
  const mainUrl = 'https://archive.org/details/album_covers';

  browser = await puppeteer.launch({
    headless: false,
  });

  page = await browser.newPage();

  await page.goto(mainUrl);

  await autoScroll(page);

  let urls = await page.evaluate(_ => {
    const elements = document.getElementsByTagName('a');
    let a = [];
    for (let i = 0; i < elements.length; ++i) {
      a.push(elements[i].href);
    }
    return a;
  });

  const regex = new RegExp(mainUrl, 'g');
  urls = urls.filter(url => !regex.test(url));
  urls = urls.filter(url => !/mailto:/g.test(url));
  urls = urls.filter(url => /^https:\/\/archive.org\/details/.test(url));

  console.log(urls);

  for (let i = 0; i < urls.length; ++i) {
    let url = urls[i];
    url = url.replace('details', 'compress');
    url += '/formats=PNG,JPEG';
    console.log(url);
    try {
      await page.goto(url);
    } catch (e) {
      console.log('error');
    }

  }

})();

async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 1000);
      });
  });
}
