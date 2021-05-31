const puppeteer = require('puppeteer');
const fs = require('fs');

const saveFolder = './images';

(async () => {

  const mainUrl = 'https://www.converse.com/shop/pride-collection';

  browser = await puppeteer.launch({
    headless: false,
  });

  page = await browser.newPage();

  await page.goto(mainUrl);

  await page.evaluate(scrollToBottom);

  let urls = await page.evaluate(_ => {
    const elements = document.getElementsByTagName('a');
    let a = [];
    for (let i = 0; i < elements.length; ++i) {
      a.push(elements[i].href);
    }
    return a;
  });

  urls = urls.filter(url => !/mailto:/g.test(url));
  urls = urls.filter(url => /https?:\/\/(www\.)?converse.com\/shop\/p\//.test(url))
  urls = [...new Set(urls)]

  // console.log(urls);
  
  for (let i = 0; i < urls.length; ++i) {
    let url = urls[i];
    await page.goto(url);

    await page.evaluate(scrollToBottom);

    let imgUrls = await page.evaluate(() => {
      const elements = document.getElementsByTagName('img');
      let a = [];
      for (let i = 0; i < elements.length; ++i) {
        a.push(elements[i].src);
      }
      return a;
    });
    imgUrls.push(...await page.evaluate(() => {
      const elements = document.getElementsByTagName('source')
      let a = [];
      for (let i = 0; i < elements.length; ++i) {
        a.push(elements[i].srcset);
      }
      return a;
    }));

    imgUrls = imgUrls.filter(url => /.+/.test(url));
    imgUrls = imgUrls.filter(url => /^https?:\/\/(www\.)?converse.com\/.+\/images\/.{4}\/.+\?/.test(url));
    for (let i = 0; i < imgUrls.length; ++i) {
      const regex = new RegExp(/^(https?:\/\/(www\.)?converse.com\/.+\/images\/.{4}\/.+)\?/)
      const cap = imgUrls[i].match(regex);
      imgUrls[i] = cap[1];
    }
    
    imgUrls = [...new Set(imgUrls)];

    // console.log(imgUrls);

    if (!fs.existsSync(saveFolder)){
      fs.mkdirSync(saveFolder);
    }

    await downloadImages(imgUrls, page);
  }

  await browser.close();

})();

async function scrollToBottom() {
  await new Promise(resolve => {
    const distance = 100; // should be less than or equal to window.innerHeight
    const delay = 100;
    const timer = setInterval(() => {
      document.scrollingElement.scrollBy(0, distance);
      if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, delay);
  });
}

async function downloadImages(urls, page) {
  // console.log(urls);
  for (let i = 0; i < urls.length; ++i) {
    // console.log(urls[i]);
    const source = await page.goto(urls[i]);

    const urlParts0 = urls[i].split('/');
    const imgName = urlParts0[urlParts0.length - 1];

    const urlParts1 = urls[i].split('.');
    const imgType = urlParts1[urlParts1.length - 1];

    if (imgType === 'jpg' || imgType ===  'png') {
      if (!fs.existsSync(saveFolder + '/' + imgName)) {
        try {
          fs.writeFileSync(
            saveFolder + '/' + imgName,
            await source.buffer()
          );
        } catch(err) {
          console.log(err);
          console.log('Error occurred. Most likely duplicate image.')
        }
      }
    } else {
      console.log(`⚠️ Warning: Unsupported image type '${imgType}'. Skipping '${urls[i]}'`);
    }
  }
}
