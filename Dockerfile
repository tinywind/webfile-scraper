FROM node:26.13.1-trixie-slim@sha256:e6bedef217677b276c591795e169840edd9096dbf13f29df8ef8d1856b8820bc

ARG VCS_REF=unknown
LABEL org.opencontainers.image.version="0.1.2" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.source="https://github.com/tinywind/webfile-scraper"

WORKDIR /usr/src/app
COPY scheduler.js scrap.js log-value.js ./
CMD ["node", "scheduler.js", "/config.json"]
