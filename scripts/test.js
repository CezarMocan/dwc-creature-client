const { spawn } = require('child_process');

// Running instructions: 
// node test.js [address] [noClients] [visitDuration_seconds]
// e.g. node test.js http://localhost:3000 90 60

const address = process.argv[2]
const noClients = parseInt(process.argv[3])
const duration = parseInt(process.argv[4])

for (let i = 0; i < (noClients / 15) + 1; i++) {
  const ls = spawn('node', ['15.js', address, duration]);

  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}