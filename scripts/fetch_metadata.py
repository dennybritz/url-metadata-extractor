#! /usr/bin/env python

import argparse
from newspaper import Article
import json
from lxml import etree

parser = argparse.ArgumentParser(description='Parse a URL')
parser.add_argument('url', metavar='url', help='the url to be downloaded and parsed')
args = parser.parse_args()

article = Article(args.url)

# if not article.is_valid_url():
#   print json.dumps({
#     'error': 'Not a valid url.'
#   })
#   exit(1)

article.download()
article.parse()

# if not article.is_valid_body():
#   print json.dumps({
#     'error': 'Not a valid article body.'
#   })
#   exit(1)

article.nlp()



print json.dumps({
  'authors': article.authors,
  'keywords': article.keywords,
  'metadata': article.meta_data,
  'metaDescription': article.meta_description,
  'publishDate': (article.publish_date.isoformat() if article.publish_date else None),
  'tags': list(article.tags),
  'text': article.text,
  'title': article.title,
  'url': article.url
})