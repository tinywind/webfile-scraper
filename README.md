# Webfile Scraper

Webfile Scraper is a Node.js command-line tool that follows matching page links
and downloads matching linked files to a chosen directory. It also includes a
configurable scheduler.

Release `0.1.2` uses Node.js `26.13.0`. The application uses only Node.js built-in modules; no npm packages need to be installed.

## Usage

```bash
node scrap.js <webpage URL> <scrapingUrl RegExp pattern> <file RegExp pattern> <local download location:optional, defaults to current folder> <depth:optional, defaults to 1>
```

### Parameters

- `<webpage URL>`: The URL of the webpage to scrape.
- `<scrapingUrl RegExp pattern>`: The regular expression pattern to match URLs to scrape.
- `<file RegExp pattern>`: The regular expression pattern to match file links.
- `<local download location>`: Optional. The local directory to download the files. Defaults to the current directory if not specified.
- `<depth>`: Optional. The depth of the scraping. Defaults to 1 if not specified.

### Example

Supply the page URL, crawl pattern, and file pattern. Set the destination and depth as needed:

```bash
node scrap.js https://example.com/files/ '^https://example\.com/' '\.zip$' ./downloads 1
```

## Scheduler usage

A scheduler script (`scheduler.js`) is included to periodically run the scraper based on a configuration file.

### Configuration file

The configuration file can be in JSON or JavaScript format and should include the following properties:

- `webpageUrls`: An array of objects with `url` and `scrapingUrlPattern` properties.
  - `url`: The URL of the webpage to scrape.
  - `scrapingUrlPattern`: The regular expression pattern to match URLs to scrape.
  - `filePattern`: The regular expression pattern to match file links.
  - `depth`: The depth of the scraping.
- `downloadLocation`: The directory to download the files.
- `interval`: The interval in seconds between each run.
- `runCount`: The number of times to run the script (0 for infinite).
- `dbPath`: The path to the `scrap.db` file to keep track of downloaded URLs.

#### Example `config.json`

```json
{
  "webpageUrls": [
    {
      "url": "https://example.com",
      "scrapingUrlPattern": "^https://example\\.com/",
      "filePattern": ".*\\.torrent$",
      "depth": 2
    },
    {
      "url": "https://another.com",
      "scrapingUrlPattern": "https://.*\\.another\\.com/[0-9]+",
      "filePattern": ".*\\.zip$",
      "depth": 2
    }
  ],
  "downloadLocation": "./downloads",
  "interval": 3600,
  "runCount": 0,
  "dbPath": "./scrap.db"
}
```

### Run the scheduler

```bash
node scheduler.js <config file>
```

Example:

```bash
node scheduler.js ./config.json
```

## Docker usage

Run the scheduler in Docker using a mounted configuration and download directory.

### Docker Hub image

The Docker image is available on Docker Hub: [tinywind0/webfile-scraper](https://hub.docker.com/r/tinywind0/webfile-scraper)

#### Pull the Docker image

```bash
docker pull tinywind0/webfile-scraper:0.1.2
```

#### Run the Docker container

Set `downloadLocation` to `/downloads` and `dbPath` to `/downloads/scrap.db` in the mounted configuration. Both downloaded files and scheduler state then persist in the host directory.

```bash
mkdir -p downloads
docker run --rm -v "$(pwd)/config.json:/config.json:ro" -v "$(pwd)/downloads:/downloads" tinywind0/webfile-scraper:0.1.2
```

### Dockerfile

A `Dockerfile` is provided to build the Docker image. See the [Dockerfile](./Dockerfile) for details.

### Docker Compose (optional)

A `docker-compose.yml` file can be used for easier management. See the [docker-compose.yml](./docker-compose.yml) for details.

### Build the Docker image

```bash
docker build --pull -t webfile-scraper:0.1.2 .
```

### Run with Docker Compose

```bash
docker compose up --build
```

## Tests

Run the CLI, scheduler, persistence, retry, and download-path regression tests:

```bash
node --test
```

To test the files packaged in the Docker image, mount only the test directory. The tests use a loopback HTTP server and temporary files under `.tmp/`; they need no external network access.

```bash
docker run --rm --network none -v "$(pwd)/test:/usr/src/app/test:ro" webfile-scraper:0.1.2 node --test
```

## License

This project is licensed under the MIT License.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
