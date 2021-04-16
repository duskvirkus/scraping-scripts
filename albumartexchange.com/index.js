const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

  const saveFolder = './images';

  if (!fs.existsSync('./userDataDir')) {
    console.log('starting browser please login to albumartexchange and then stop script and restart it')
    browser = await puppeteer.launch({
      headless: false,
      userDataDir: './userDataDir'
    });

    page = await browser.newPage();
    await page.goto('https://www.albumartexchange.com/forums/ucp.php?mode=login&redirect=/?login');
  } else {
    browser = await puppeteer.launch({
      headless: false,
      userDataDir: './userDataDir'
    });

    page = await browser.newPage();
    
    for (let pageCount = 1; pageCount < 100; pageCount++) {
      await page.goto(`https://www.albumartexchange.com/covers?page=${pageCount}`);

      const imageUrls = await page.evaluate(_ => {
        const minImageSize = 1024;
        const getAllChildren = function(allChildren, node) {
          for (let i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            getAllChildren(allChildren, child);
            allChildren.push(child);
          }
        }
      
        const elements = document.querySelectorAll('.cover');

        const children = [];
        for (let i = 0; i < elements.length; ++i) {
          let allChildren = [];
          getAllChildren(allChildren, elements[i]);
          children.push(allChildren);
        }
      
        let validIndexes = [];
        for (let i = 0; i < children.length; ++i) {
          for (let child of children[i]) {
            if (child.classList && child.classList.contains('dimensions')) {
              const dimensionText = child.innerText;
              const matches = dimensionText.match(/\d+/g);
              if (matches.length === 2) {
                const a = parseInt(matches[0]);
                const b = parseInt(matches[1]);
                if (!isNaN(a) && !isNaN(b) && a >= minImageSize && b >= minImageSize) {
                  validIndexes.push(i);
                }
              }
            }
          }
        }
      
        let imageUrls = [];
        for (let i = 0; i < validIndexes.length; ++i) {
          for (let child of children[validIndexes[i]]) {
            if (child.classList && child.classList.contains('img-box')) {
              const outerHtml = child.outerHTML;
              const matches = outerHtml.match(/background-image: url\((.+)\)/);
              imageUrls.push(matches[1]);
            }
          }
        }
        return imageUrls;
      });

      console.log(imageUrls);

      for (let i = 0; i < imageUrls.length; ++i) {
        const loc = imageUrls[i].replace('_tn', 'gallery');
        const source = await page.goto(`https://www.albumartexchange.com${loc}`);

        const urlParts0 = loc.split('/');
        const imgName = urlParts0[urlParts0.length - 1];

        const urlParts1 = loc.split('.');
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
        } else {
          console.log(`⚠️ Warning: Unsupported image type '${imgType}'. Skipping '${loc}'`);
        }
      }
    }
  }

})();
