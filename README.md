# Creature Web Client

## Setup

Run `yarn install` in order to install the dependencies.

Note: This will install `puppeteer`, the headless Google Chrome library, which is a quite large download. I've used it in order to load test the site (using `scripts/test.js`). You can disable the dependency and the site will still run properly.

## Running

Run `npm run dev` in order to start the development server.

Run `npm run export` in order to generate a static site.

Note: The websocket server is currently hardcoded in `index.js`. I'll make sure to update that.


## Performance script

**1.**
Start servers:

`npm run start:server alpha`: Starts server named alpha.
`npm run start:server beta`: Starts server named beta.
`npm run start:server gamma`: Starts server named gamma.

They will all be in the centralized phase.

**2.**
Start playing birth animation *on each server*.

curl -d '' http://localhost:3001/centralized/start
curl -d '' http://localhost:3002/centralized/start
curl -d '' http://localhost:3003/centralized/start


**3.**
Move to decentralized phase *on each server*

curl -d 'phase=decentralized' http://localhost:3001/changePhase
curl -d 'phase=decentralized' http://localhost:3002/changePhase
curl -d 'phase=decentralized' http://localhost:3003/changePhase

Send creatures to the 3 gardens, *one per garden*

curl -d 'creature=creature1' http://localhost:3001/hello
curl -d 'creature=creature2' http://localhost:3002/hello
curl -d 'creature=creature3' http://localhost:3003/hello


**4.**

Move to distributed phase *on each server*

curl -d 'phase=distributed' http://localhost:3001/changePhase
curl -d 'phase=distributed' http://localhost:3002/changePhase
curl -d 'phase=distributed' http://localhost:3003/changePhase

## Pi Setup
```sh
sudo apt-get update
sudo apt-get install git

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

#Node
sudo apt-get install nodejs

#Yarn
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
     echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
     sudo apt-get update && sudo apt-get install yarn
```