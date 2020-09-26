FROM node:12.18.4-stretch

WORKDIR /app

RUN apt-get update && \
    apt install -y ffmpeg libav-tools opus-tools

COPY ./ /app

RUN npm ci && \
    npm run build

ENTRYPOINT ["node", "dist/index.js"]
