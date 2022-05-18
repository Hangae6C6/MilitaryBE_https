# syntax=docker/dockerfile:1

FROM node:current-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY . /app/private.key

RUN npm install

EXPOSE 4433

CMD [ "node", "app.js" ]

