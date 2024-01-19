const fs = require('fs');
const path = require('path');
const { stat } = require('node:fs');

fs.readdir(`${__dirname}/secret-folder`, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      stat(`${__dirname}/secret-folder/${path.basename(file)}`, (err, stats) => {
        if (err) console.log(err);
        if (stats.isDirectory() === false) {
          console.log(`${path.basename(file, `${path.extname(file)}`)} - ${stats.size} - ${path.extname(file)}`);
        }
      });
    })
  }
})