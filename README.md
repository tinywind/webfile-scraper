# Node.js Webpage Scraper

This Node.js script scrapes a webpage for `<a>` tags with links matching a specified pattern and downloads the linked files to a specified directory.

## Usage

To run the script, use the following command:

```bash
node scrap.js <webpage URL> <file RegExp pattern> <local download location:optional, defaults to current folder>
```

### Parameters

- `<webpage URL>`: The URL of the webpage to scrape.
- `<file RegExp pattern>`: The regular expression pattern to match file links.
- `<local download location>`: Optional. The local directory to download the files. Defaults to the current directory if not specified.

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

Feel free to copy and paste this markdown content into your GitHub repository's README.md file. This will provide users with a clear understanding of how to use your script and the licensing terms.
