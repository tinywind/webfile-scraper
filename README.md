# Node.js Webpage Scraper

This Node.js script scrapes a webpage for `<a>` tags with links matching a specified pattern and downloads the linked files to a specified directory.

## Usage

To run the script, use the following command:

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

To download all torrent files from a specific webpage to the current directory:

```bash
node scrap.js https://torrent.com/ torrent
```

```bash
node scrap.js https://torrent.com/ '.*\.torrent$'
```

To specify a local download location:

```bash
node scrap.js https://torrent.com/ '.*\.torrent$' ./downloads
```

## Scheduler Usage

A scheduler script (`scheduler.js`) is included to periodically run the scraper based on a configuration file.

### Configuration File

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
      "scrapingUrlPattern": "YOUR_FIRST_SCRAPE_URL",
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

### Running the Scheduler

To run the scheduler with the configuration file:

```bash
node scheduler.js <config file>
```

Example:

```bash
node scheduler.js ./config.json
```

## Docker Usage

You can use Docker to run the scheduler in a container. This can simplify the environment setup and ensure consistency.

### Docker Hub Image

The Docker image is available on Docker Hub: [tinywind0/webfile-scraper](https://hub.docker.com/r/tinywind0/webfile-scraper)

#### Pulling the Docker Image

```bash
docker pull tinywind0/webfile-scraper
```

#### Running the Docker Container

To run the Docker container, use:

```bash
docker run -v $(pwd)/config.json:/config.json -v $(pwd)/downloads:/downloads tinywind0/webfile-scraper
```

### Dockerfile

A `Dockerfile` is provided to build the Docker image. See the [Dockerfile](./Dockerfile) for details.

### Docker Compose (Optional)

A `docker-compose.yml` file can be used for easier management. See the [docker-compose.yml](./docker-compose.yml) for details.

### Building the Docker Image

To build the Docker image, run:

```bash
docker build -t webfile-scraper .
```

### Using Docker Compose

To use Docker Compose, run:

```bash
docker-compose up
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

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

---
