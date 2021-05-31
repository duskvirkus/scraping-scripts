# adidas.com scraping

Last updated on April 16th 2021.

**Required tools:**

- node.js
- chromium (will install automatically if not already installed)
- ability to compile a npm c++ package (will happen automatically on most computers)

## How to Use

1. (First time only.) Run `npm i` in `adidas.com` directory.

2. Change index.js to have your desired `mainUrl`.

3. Run `npm start`. This may take awhile so go get some tea. When it finishes the browser window will close and images will be in the images directory.

## Notes

Seeing `error occurred` in the console probably just means it tried to download an image that has already been downloaded.
