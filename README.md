# droplr-telegram-bot

[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]

[travis-image]: https://img.shields.io/travis/geekdada/droplr-telegram-bot.svg?style=flat-square
[travis-url]: https://travis-ci.org/geekdada/droplr-telegram-bot
[codecov-image]: https://codecov.io/gh/geekdada/droplr-telegram-bot/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/geekdada/droplr-telegram-bot
[david-image]: https://img.shields.io/david/geekdada/droplr-telegram-bot.svg?style=flat-square
[david-url]: https://david-dm.org/geekdada/droplr-telegram-bot
[snyk-image]: https://snyk.io/test/github/geekdada/droplr-telegram-bot/badge.svg?targetFile=package.json
[snyk-url]: https://snyk.io/test/github/geekdada/droplr-telegram-bot?targetFile=package.json

## Usage

### Get a Telegram Bot token

Go to https://t.me/BotFather and get a token.

### Run server as a daemon

```bash
NODE_ENV=production \
EGG_WORKERS=1 \
BOT_TOKEN=${TOKEN_FROM_LAST_STEP} \
DROPLR_USERNAME=${YOUR_DROPLR_EMAIL} \
DROPLR_PASSWORD=${YOUR_DROPLR_PASSWORD} \
BASE_URI=https://bot.example.com \
npx eggctl start --daemon
```

> Droplr doesn't provide an Oauth system, so your bot only works for you.

### Stop server

```bash
npx eggctl stop
```

## Features

### Shorten links

![](https://roy.d.pr/3s30Xc+)

### Upload images

![](https://roy.d.pr/azO9Yd+)

### Markdown notes

![](https://roy.d.pr/I8V2WP+)

[View](https://roy.d.pr/LW3YtK)

### Others

- Audio
- Video
- Files
