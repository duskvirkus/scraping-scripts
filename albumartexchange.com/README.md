# albumartexchange.com scraping

⚠️ Probably not worth running. Requires you to have an account and you get a captcha requirement put on your account pretty quickly (after ~100 images) if you run this script. Didn't bother trying to find a way around it.

Last updated on April 16th 2021.

**Required tools:**

- node.js
- chromium (will install automatically if not already installed)
- ability to compile a npm c++ package (will happen automatically on most computers)

## How to Use

1. (First time only.) Run `npm i` in `albumartexchange.com` directory. Create an `images` directory in `albumartexchange.com`.

2. Run `npm start` and login then close the browser.

3. Run `npm start` images will show up in images folder.
