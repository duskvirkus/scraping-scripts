# gucci.com scraping

Last updated on Feb 20th 2021.

**Required tools:**

- chromium (chrome or another chromium based browser will probably also work)
- wget

## How to Use

1. Open gucci.com and navigate to desired page. Scroll down an hit `View All` as many times as required to make sure you get all the items on the page.

2. Open chromium devtools and paste script into the console using `shift` + `insert`. Then press enter to run.

3. Copy the resulting links into a `urls.txt` file on you computer.

4. Run `wget --random-wait -i /path/to/urls.txt` from folder where you want images downloaded.