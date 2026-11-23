FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5

RUN apk update && apk upgrade --no-cache

ARG IMAGE_VERSION=0.1.2
ARG VCS_REF=unknown
LABEL org.opencontainers.image.version="${IMAGE_VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.source="https://github.com/tinywind/webfile-scraper"

WORKDIR /usr/src/app
COPY scheduler.js scrap.js log-value.js ./
CMD ["node", "scheduler.js", "/config.json"]
