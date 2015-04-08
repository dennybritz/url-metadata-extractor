FROM node:0.12

COPY . /app

WORKDIR /app

RUN \
  rm -rf node_modules .env log && \
  npm install

ENV NODE_ENV production
ENV LOG_NAME url-metadata-extractor
ENV PORT 80

EXPOSE 80

CMD ["npm", "start"]
