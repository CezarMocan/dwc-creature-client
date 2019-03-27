# Creature Web Client

## Pre-performance setup for each Raspberry Pi

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

Install `pm2` on the PI's:

```sh
npm install pm2@latest -g
```

Pull repository and install latest dependencies:

```sh
git pull
yarn install
```

**Make sure to set up the garden IP and ports on each Pi in `constants.js`.**

Start servers:

```sh
sudo pm2 start npm -- run start:server alpha #Starts server named alpha.
sudo pm2 start npm -- run start:server beta #Starts server named beta.
sudo pm2 start npm -- run start:server gamma #Starts server named gamma.
```

## PM2 instructions

See the logs by doing: `sudo pm2 logs`.
See the running processes by doing: `sudo pm2 list`.
Stop all processes by doing: `sudo pm2 stop all`.


## Performance script

**1.**

npm run p:centralizedPlay

**2.**

npm run p:toDecentralized

npm run p:decentralizedCreaturesToGardens

**3.**

npm run p:toDistributed

npm run p:sendCreatureToGarden creature4 alpha

npm run p:sendCreatureToGarden creature5 beta

npm run p:sendCreatureToGarden creature6 gamma

npm run p:sendCreatureToGarden creature7 alpha