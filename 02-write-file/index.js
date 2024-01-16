const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

const result = fs.createWriteStream(path.join(__dirname, '02-write-file.txt'), 'utf-8');
 
rl.setPrompt('Hi, Enter text:\n');
rl.prompt();
rl.on('line', (text) => {
  if (text.toString().toLowerCase() === 'exit') {
    rl.close();
  } else {
    result.write(`${text}\n`, 'utf-8');
  }
});

rl.on('close', () => {
  console.log('Bye!');
});