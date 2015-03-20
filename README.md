An API that extracts metadata from a given article URL. Uses the excellent Python [newspaper library](https://github.com/codelucas/newspaper).

## Start with Docker

```
docker run -d -p 3333:80 blikk/url-metadata-extractor
```

## Usage

```shell
curl -XPOST http://192.168.59.103:1337/extract \
  --header "Content-Type:application/json" \
  --data '{"url": "http://fox13/new-year-new-laws-obamacare-pot-guns-and-drones/"}'
```

## Build yourself

In addition to node.js you must have the [Python newspaper library](https://github.com/codelucas/newspaper) installed.