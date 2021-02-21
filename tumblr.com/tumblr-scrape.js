// tumblr.com scraping script

const puppeteer = require('puppeteer');
const fs = require('fs');
const robot = require('robotjs');
const { resolve } = require('path');

let urlArg;
let pagesFlag = false;
let pagesNum = -1;

let saveFolder;
let browserWidth;
let browserHeight;

let browser;
let page;

(async () => {
  console.log('Starting!');
  handleArguments();
  makeDirectories();
  await setup();
  await scrapePages();
  console.log('Done 🎉🎉🎉');
})();

function handleArguments() {
  if (process.argv.length <= 2 || process.argv > 4) {
    console.log('Invalid number of arguments! Please look at README.md for more info on usage.');
    process.exit(1);
  } else {

    urlArg = process.argv[2];
    const urlRegEx = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');
    if (!(urlRegEx.test(urlArg))) {
      console.log(`Invalid url argument! url="${urlArg}" Please see README.md for more information on usage.`)
      process.exit(2);
    }

    // handle pages flag
    if (process.argv.length === 4) {
      const regex = /pages=((\d+)|(true))/;

      if (!(regex.test(process.argv[3]))) {
        console.log(`Invalid pages argument! argument="${process.argv[3]}" Please see README.md for more information on usage.`);
        process.exit(3);
      }

      const matches = regex.exec(process.argv[3]);

      pagesFlag = true;

      if (matches[1] > 0) {
        pagesNum = matches[1];
      }

      // console.log(pagesFlag, pagesNum);
    }
  }
}

function makeDirectories() {
  // make directories
  if (!fs.existsSync('./images')){
    fs.mkdirSync('./images');
  }

  saveFolder = './images/' + urlArg.split('/')[2];
  if (!fs.existsSync(saveFolder)) {
    fs.mkdirSync(saveFolder);
  }
}

function setup() {
  return new Promise(async(resolve) => {
    robot.setMouseDelay(2);
    const screenSize = robot.getScreenSize();
    browserWidth = 1280 > screenSize.width ? screenSize.width : 1280;
    browserHeight = 720 > screenSize.height ? screenSize.height : 720;
  
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--window-position=0,0',
        `--window-size=${browserWidth},${browserHeight}`
      ],
    });
    page = await browser.newPage();
    await page.setViewport({
      width: browserWidth,
      height: browserHeight,
    });

    resolve();
  });
}

function scrapePages() {
  return new Promise(async(resolve) => {
    let currentPageNum = 1;
    do {
  
      const url = urlArg + slashNeeded(urlArg) + 'page/' + currentPageNum;
      await page.goto(url);
  
      let imgURLs = await getImageURLs(page);
      imgURLs = imgURLs.filter(e => e != null);
      if (imgURLs.length <= 1) {
        pagesFlag = false;
      } else {
        await downloadImages(imgURLs, page);
      }
  
      currentPageNum++;
      if (currentPageNum > pagesNum && pagesNum != -1) {
        pagesFlag = false;
      }
    } while(pagesFlag);
  
    await page.close();
    await browser.close();
  });
}

async function getImageURLs(page) {
  return await page.evaluate((selector) => {
    const imgElements = document.querySelectorAll(selector);
    let imgUrls = [];
    for (let i = 0; i < imgElements.length; ++i) {
      imgUrls.push(imgElements[i].getAttribute('src'));
    }
    return imgUrls;
  }, 'img');
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
        fs.writeFileSync(
          saveFolder + '/' + imgName,
          await source.buffer(),
          err => {
            if (err) {
              console.error(err);
            }
          }
        );
      }
    } else if (imgType === 'gifv') {
      const gifName = imgName.split('.')[0];
      await gifDownload(gifName);
    } else {
      console.log(`⚠️ Warning: Unsupported image type '${imgType}'. Skipping '${urls[i]}'`);
    }
  }
}

function slashNeeded(a) {
  if (a.charAt(a.length - 1) !== '/') {
    return '/';
  }
  return '';
}

async function gifDownload(gifName) {
  return new Promise(async(resolve) => {
    gifName = gifName.replace(/_/g, '-'); // who knows why but underscores don't work
    if (fs.existsSync(saveFolder + '/' + gifName + '.gif')) {
      resolve();
    } else {
      robot.moveMouse(browserWidth / 2, browserHeight / 2);
      robot.mouseClick('right');

      robot.keyTap('down');
      robot.keyTap('down');
      robot.keyTap('down');
      robot.keyTap('enter');
      robot.typeString('-----' + gifName);
      robot.keyTap('enter');
      robot.keyTap('enter');

      let downloadPath = '/home/violet/Downloads/';

      let gifDownloaded = false;
      while(!gifDownloaded) {
        for (let i = 0; i < 6; ++i) {
          let add = '';
          for (let j = 0; j < i; ++j) {
            add += '-';
          }
          const checkPath = downloadPath + add + gifName + '.gif';
          // console.log(checkPath);
          if (fs.existsSync(checkPath)) {
            downloadPath = checkPath;
            gifDownloaded = true;
            break;
          }
        }

        // console.log('Waiting for image to download...');
        await sleep(500);
      }

      fs.copyFileSync(downloadPath, saveFolder + '/' + gifName + '.gif');
      fs.unlinkSync(downloadPath);

      resolve();
    }
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
