# tumblr.com scraping

Last updated on Feb 20th 2021.

**Required tools:**

- node.js
- chromium (will install automatically if not already installed)
- ability to compile a npm c++ package (will happen automatically on most computers)

## How to Use

1. (First time only.) Run `npm i` in `tumblr.com` directory.

2. Run `node tumblr-scrape.js <tumblr-blog-url>`. Your images will show up in a sub directory of images in this project.

## Pages option

You can optionally pass a pages argument to the script after the url. This can either take the form of `pages=<#-pages>` or `pages=true`. When set to `true` it will continue until it detects that there are no more images on the page it goes to.

## Limitations

- Don't use your mouse or keyboard while running the script because these are required for downloading gifs.
- It may stop prematurely if blog is full of lots of text posts because it'll stop if It can't find any images on a page if using the auto calculate pages feature.

## Example

`node tumblr-scrape.js https://staff.tumblr.com/ pages=10`
