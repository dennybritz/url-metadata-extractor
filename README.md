An API that extracts metadata from a given article URL. It uses a combination metatags, item properties and link tags to find metadata. Does not do any sophisticated NLP.

## Start with Docker

```
docker run -d -p 3000:80 blikk/url-metadata-extractor
```

## Usage

```shell
curl -XPOST http://localhost:3000/extract \
  --header "Content-Type:application/json" \
  --data '{"url": "http://techcrunch.com/2015/01/06/razer-announces-199-open-source-virtual-reality-headset/"}'
```

## Example Response

```json
{
  "url": "http://techcrunch.com/2015/01/06/razer-announces-199-open-source-virtual-reality-headset/",
  "metatags": {
    "p:domain_verify": "ee3dd0cd95c625f8f2446d34712815ed",
    "handheldfriendly": "True",
    "mobileoptimized": "320",
    "viewport": "initial-scale=1.0,width=device-width,user-scalable=no,minimum-scale=1.0,maximum-scale=1.0",
    "apple-mobile-web-app-title": "TechCrunch",
    "robots": "NOYDIR,NOODP",
    "google-site-verification": "4U1OC1LwZlFHAehLhCV4rt3YzWI_AyF7Gb0XqlaVEhE",
    "msvalidate:01": "5ABD8A078F3356F3A6A8C8643C31FB8F",
    "generator": "WordPress.com",
    "sailthru:date": "2015-01-06 06:00:51",
    "sailthru:title": "Razer Announces $199 ‘Open Source’ Virtual Reality Headset",
    "sailthru:tags": "Virtual reality",
    "sailthru:author": "<a href=\"/author/kyle-russell/\" title=\"Posts by Kyle Russell\" onclick=\"s_objectID='river_author';\" rel=\"author\">Kyle Russell</a> <span class=\"twitter-handle\">(<a href=\"https://twitter.com/kylebrussell\" rel=\"external\">@kylebrussell</a>)</span>",
    "sailthru:description": "The headset, which the company says will arrive this June, is meant to serve as an alternative hardware test bed for developers looking at the VR space.",
    "sailthru:image.full": "https://tctechcrunch2011.files.wordpress.com/2015/01/img_0023.png",
    "sailthru:image.thumb": "https://tctechcrunch2011.files.wordpress.com/2015/01/img_0023.png?w=50",
    "fb:app_id": "187288694643718",
    "fb:admins": "1076790301,543710097,500024101,771265067,1661021707,1550970059,663677613,10219991,1178144075,726995222,506404657,4700188",
    "article:publisher": "https://www.facebook.com/techcrunch",
    "og:site_name": "TechCrunch",
    "og:site": "social.techcrunch.com",
    "og:title": "Razer Announces $199 ‘Open Source’ Virtual Reality Headset",
    "og:description": "The headset, which the company says will arrive this June, is meant to serve as an alternative hardware test bed for developers looking at the VR space.",
    "og:image": "https://tctechcrunch2011.files.wordpress.com/2015/01/img_0023.png?w=680",
    "og:url": "http://social.techcrunch.com/2015/01/06/razer-announces-199-open-source-virtual-reality-headset/",
    "og:type": "article",
    "twitter:card": "summary_large_image",
    "twitter:image:src": "https://tctechcrunch2011.files.wordpress.com/2015/01/img_0023.png",
    "twitter:site": "@techcrunch",
    "twitter:url": "http://techcrunch.com/2015/01/06/razer-announces-199-open-source-virtual-reality-headset/",
    "twitter:description": "The headset, which the company says will arrive this June, is meant to serve as an alternative hardware test bed for developers looking at the VR space.",
    "twitter:title": "Razer Announces $199 ‘Open Source’ Virtual Reality…",
    "description": "The headset, which the company says will arrive this June, is meant to serve as an alternative hardware test bed for developers looking at the VR space.",
    "application-name": "TechCrunch",
    "msapplication-window": "width=device-width;height=device-height",
    "msapplication-tooltip": "Startup and Technology News",
    "msapplication-task": "name=Subscribe;action-uri=http://techcrunch.com/feed/;icon-uri=http://0.gravatar.com/blavatar/ad5b2a2b10ddd8fc4e4588abd4e12a84?s=16"
  },
  "title": "Razer Announces $199 ‘Open Source’ Virtual Reality Headset",
  "description": "The headset, which the company says will arrive this June, is meant to serve as an alternative hardware test bed for developers looking at the VR space.",
  "image": "https://tctechcrunch2011.files.wordpress.com/2015/01/img_0023.png?w=680",
  "contentType": "article",
  "site": "TechCrunch",
  "date": "2015-01-06T06:00:51+00:00"
}
```

## Build yourself

```
npm install
npm start
```