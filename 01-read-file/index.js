const fs = require('node:fs');
const path = require('path');
const readable = fs.createReadStream(path.join(__dirname,'text.txt'));
let data = '';
readable.on('data', (chunk) => (data += chunk));
readable.on('end', () => console.log(data));