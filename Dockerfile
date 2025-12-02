FROM node:lts-slim AS base
WORKDIR /usr/local/app
COPY package*.json ./
RUN npm install
COPY --link eslint.config.js vite.config.js index.html ./
COPY --link ./public ./public
COPY --link ./src ./src

FROM base AS dev
CMD ["npm", "run", "dev"]

FROM base AS build
RUN npm run build && ls dist

FROM alpine
LABEL org.opencontainers.image.title="Labspaces" \
    org.opencontainers.image.description="Learn through interactive and hands-on Labspaces" \
    org.opencontainers.image.vendor="Docker, Inc." \
    com.docker.desktop.extension.api.version="0.1.0" \
    com.docker.extension.screenshots="[{\"alt\":\"Viewing the Labspace extension dashboard\",\"url\":\"https://raw.githubusercontent.com/dockersamples/labspace-extension/refs/heads/main/images/dashboard.png\"},{\"alt\":\"Starting a Labspace\",\"url\":\"https://raw.githubusercontent.com/dockersamples/labspace-extension/refs/heads/main/images/starting-labspace.png\"},{\"alt\":\"Viewing a running Labspace\",\"url\":\"https://raw.githubusercontent.com/dockersamples/labspace-extension/refs/heads/main/images/opened-labspace.png\"}]" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/dockersamples/labspace-extension/refs/heads/main/beaker.svg" \
    com.docker.extension.detailed-description="Labspaces provide fully packaged learning labs, workshops, and demos. This extension provides a catalog of these resources." \
    com.docker.extension.publisher-url="https://github.com/dockersamples/labspace-extension" \
    com.docker.extension.additional-urls="[{\"title\":\"Create your own Labspace\",\"url\":\"https://github.com/dockersamples/labspace-starter\"}]" \
    com.docker.extension.categories="cloud-development" \
    com.docker.extension.changelog="- Persist filter settings and a few minor bug fixes"
COPY beaker.svg /
COPY metadata.json /
COPY --from=build /usr/local/app/dist /ui
