# metmuseum.org open access scraping

Last updated on Feb 20th 2021.

**Required tools:**

- chromium (chrome or another chromium based browser will probably also work)
- wget

## How to Use

1. Open [https://www.metmuseum.org/art/collection/search#!?searchField=All&showOnly=openAccess&sortBy=relevance&offset=0&pageSize=0](https://www.metmuseum.org/art/collection/search#!?searchField=All&showOnly=openAccess&sortBy=relevance&offset=0&pageSize=0) and choose desired options.

2. Open chromium devtools and paste script into the console using `shift` + `insert`. Then press enter to run.

3. Copy the resulting links into a `urls.txt` file on you computer.

4. Repeat steps 2 and 3 for each page of results.

5. Run `wget --random-wait -i /path/to/urls.txt` from folder where you want images downloaded.