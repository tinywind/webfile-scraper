# Security Policy

## Supported Versions

Security fixes are applied on `main` and released on the `0.1.x` line (currently `0.1.2`).

| Version | Supported |
| ------- | --------- |
| `0.1.x` (`main`) | Yes |
| `< 0.1.0` | No |

Supported runtime is Node.js `26.x` (built against Node.js `26.13.1` with no external npm dependencies).

## Reporting a Vulnerability

Please do **not** report undisclosed security vulnerabilities through public GitHub issues, pull requests, or discussions.

Use GitHub's [private vulnerability reporting](https://github.com/tinywind/webfile-scraper/security/advisories/new) for this repository to submit a report confidentially. If you cannot use GitHub Security Advisories, contact the maintainer directly at `tinywind0@gmail.com`.

When reporting an issue, please include as much of the following as possible:

- Release tag or commit SHA and Node.js / Docker environment details
- Affected file (`scrap.js`, `scheduler.js`, `Dockerfile`, or configuration loading)
- A minimal reproduction or proof of concept (without private URLs or credentials)
- Description of the potential impact and any suggested mitigation

## Response Process

- We aim to acknowledge receipt of a vulnerability report within 7 days.
- Validated issues are tracked privately through a GitHub Security Advisory while a fix is prepared and verified.
- Once a patch is available on `main`, we will publish the advisory and credit reporters who wish to be acknowledged.

## Scope and Security Model Notes

`webfile-scraper` is a dependency-free Node.js CLI and scheduler (`scrap.js`, `scheduler.js`) that fetches configured web pages and downloads matching linked files to a local directory. See also [SECURITY_CHECKS.md](SECURITY_CHECKS.md) for existing security regression checks.

### In scope

- Path traversal or file writes outside the configured `downloadLocation` via remote `Content-Disposition` headers or URL-decoded filenames
- Log forging or control-character injection in progress/error logs
- Unsafe handling of remote HTTP responses, redirects, or scheduler `scrap.db` persistence
- Base image vulnerabilities in `Dockerfile`

### Out of scope

- Operator-supplied URLs, regex patterns, or JavaScript configuration files (`config.js`), which are treated as trusted local operator inputs
- Availability or content of external websites targeted by operator configuration
