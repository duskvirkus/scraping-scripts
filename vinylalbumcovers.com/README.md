# gucci.com scraping

Last updated on April 16th 2021.

**Required tools:**

- chromium (chrome or another chromium based browser will probably also work)
- wget

## How to Use

1. Open vinylalbumcovers.com and navigate to desired page.

2. Open chromium devtools and paste script into the console using `shift` + `insert`. Then press enter to run.

3. The script will download `urls.txt`.

4. Run `wget --random-wait -i /path/to/urls.txt` from folder where you want images downloaded.