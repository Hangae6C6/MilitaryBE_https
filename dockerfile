# syntax=docker/dockerfile:1

FROM node:current-slim
ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4433

CMD [ "node", "app.js" ]

