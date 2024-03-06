# bored-user

### Simple application to simulate a bored user visiting a webpage and randomly moving their mouse around the page every few seconds using [Puppeteer](https://pptr.dev/).  Useful in quickly and lazilly testing something where you need a random user in a page without caring what they're doing as long as they're doing something.

## How To Use

### Docker Compose

The easiest way to use this is to run using [Docker Compose](https://docs.docker.com/compose/):

`docker compose up --build`

This method will run the app in [the Puppeteer Docker Container](https://pptr.dev/guides/docker) which handles all the browser dependencies for you.  Just set the `URL` Environmental Variable and go!

### Docker

This app can also be run as a normal [Docker](https://www.docker.com/) container:

`docker run -e URL="https://google.com" ghcr.io/zozman/bored-user`

### NodeJs

The application can also be run as a pure Node app from the `src` directory:

```
cd src
npm install
npm run build
URL="https://google.com" npm start
```

This method is not recommended as you are on your own to handle Puppeteer dependencies for your OS.

## Environmental Variables

- `URL`
    - REQUIRED
    - String
    - Sets the URL of the page to visit
- `CRON_STRING`
    - String
    - Default: `*/5 * * * * *` (Every 5 seconds)
    - [`node-cron` format string](https://www.npmjs.com/package/node-cron) representing how often to perform the random mouse movement
- `DEBUG`
    - Boolean
    - Default: `false`
    - If enabled, provides additional logs