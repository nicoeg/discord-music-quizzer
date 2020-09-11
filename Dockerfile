FROM node:14.10.1-stretch

COPY ./ /app

WORKDIR /app

RUN apt-get update && \
    apt install -y ffmpeg && \
    npm install && \
    npm run build


ENTRYPOINT [ "node", "dist/index.js" ]
