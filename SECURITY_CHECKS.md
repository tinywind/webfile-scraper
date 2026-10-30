# Security checks

Release 0.1.2 uses Node.js 26.13.0 on Debian Trixie, pinned by the official image digest. The application has no external npm dependencies.

Remote response filenames and decoded URL filenames are confined to the configured download directory. Progress URLs, filenames, errors, and result lists are JSON-escaped in logs, including Unicode line separators. Error-path regression requests contain CR, LF, U+2028 and U+2029 and must not create forged log lines. Run `node --test test/security.test.cjs` for real HTTP download, scheduler persistence, and path traversal regressions. Tests use isolated fixtures under `.tmp/` and a loopback HTTP server.

Configured URLs and regular expressions are trusted operator inputs. This CLI intentionally fetches configured pages and follows matching links. No remote request supplies regex patterns. Extracted link text is discarded by the download flow; it is not used as HTML or as a security sanitizer. The HTTP URL comes from explicit operator configuration; local file contents are not uploaded.

Failed file writes are not recorded as completed downloads. A real HTTP regression test verifies that a later scheduler process retries the failed URL and persists it only after the file is saved. CI runs the full test suite against the packaged application in a container with external networking disabled.
