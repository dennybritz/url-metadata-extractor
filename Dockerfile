FROM dockerfile/nodejs

COPY . /app

WORKDIR /app

RUN \
  apt-get update && \
  apt-get install -y libxml2-dev libxslt1-dev python-dev zlib1g-dev && \
  apt-get clean

RUN \
  rm -rf node_modules .env log && \
  pip install newspaper && \
  python -m nltk.downloader 'punkt' && \
  npm install

ENV NODE_ENV production
ENV LOG_NAME url-metadata-extractor
ENV PORT 80

EXPOSE 80

CMD ["npm", "start"]