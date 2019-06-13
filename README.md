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
sudo pm2 start --name alpha npm -- run start:server alpha #Starts server named alpha.
sudo pm2 start --name beta npm -- run start:server beta #Starts server named beta.
sudo pm2 start --name gamma npm -- run start:server gamma #Starts server named gamma.
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

npm run p:distributedCreaturesToGardens


## Storage for messages passed by the creatures

We are currently keeping a log of all messages as text files, inside the `dwc-all-messages` folder. The filename format is `[server_name]-[timestamp].json`. (e.g. `alpha-1560202479535.json`). This is a really rudimentary way of storage which avoids having to set up a database on the Raspberry Pi. Each one of these JSON files stores the entire history of messages in the current session (since the server was started,) so the one with the latest timestamp will be the full archive. We're storing all of them for backup reasons, even though in the future we'll update to only storing 1 or 2 files. 

**One important thing to keep in mind around messages is that if the server is turned off, the message history is cleared out. They get saved in the JSON files, but whenever the server is turned on again, we don't load old messages.**