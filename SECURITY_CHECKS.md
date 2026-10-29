# Security checks

The image uses Node.js 26 LTS. The proposed Node.js 25 update is replaced by the supported 26 line because [Node.js 25 is end-of-life](https://nodejs.org/en/about/previous-releases).

Remote response filenames and decoded URL filenames are confined to the configured download directory. Progress URLs, filenames, errors, and result lists are JSON-escaped in logs, including Unicode line separators. Error-path regression requests contain CR, LF, U+2028 and U+2029 and must not create forged log lines. Run `node --test test/security.test.cjs` for real HTTP download, scheduler persistence, and path traversal regressions. Tests use isolated fixtures under `.tmp/` and a loopback HTTP server.

Configured URLs and regular expressions are trusted operator inputs. This CLI intentionally fetches configured pages and follows matching links. No remote request supplies regex patterns. Extracted link text is discarded by the download flow; it is not used as HTML or as a security sanitizer. The HTTP URL comes from explicit operator configuration; local file contents are not uploaded.

The original UTF-16 README is preserved unchanged.
