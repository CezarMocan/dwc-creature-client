# Creature Web Client

## Setup

Run `yarn install` in order to install the dependencies. 

Note: This will install `puppeteer`, the headless Google Chrome library, which is a quite large download. I've used it in order to load test the site (using `scripts/test.js`). You can disable the dependency and the site will still run properly.

## Running

Run `npm run dev` in order to start the development server.

Run `npm run export` in order to generate a static site.

Note: The websocket server is currently hardcoded in `index.js`. I'll make sure to update that.

