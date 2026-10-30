FROM node:26.13.0-trixie-slim@sha256:e4db4c914bf8ad241bd24804fc25d272d89bad97e68cdc8a1414862790a02c39

ARG VCS_REF=unknown
LABEL org.opencontainers.image.version="0.1.2" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.source="https://github.com/tinywind/webfile-scraper"

WORKDIR /usr/src/app
COPY scheduler.js scrap.js log-value.js ./
CMD ["node", "scheduler.js", "/config.json"]
