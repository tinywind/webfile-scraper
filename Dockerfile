FROM node:26.13.0-trixie-slim@sha256:5adad64f9a1fca2d51972caa65983634c8a774eb300d72b20f7f2a0f60368072

ARG VCS_REF=unknown
LABEL org.opencontainers.image.version="0.1.2" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.source="https://github.com/tinywind/webfile-scraper"

WORKDIR /usr/src/app
COPY scheduler.js scrap.js log-value.js ./
CMD ["node", "scheduler.js", "/config.json"]
