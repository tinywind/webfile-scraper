FROM node:26-bookworm-slim

WORKDIR /usr/src/app

COPY scheduler.js scheduler.js
COPY scrap.js scrap.js
COPY log-value.js log-value.js

CMD ["node", "scheduler.js", "/config.json"]
