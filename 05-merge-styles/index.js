const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, (path.join('project-dist', 'bundle.css')));
const stylesPath = path.join(__dirname, 'styles');
const writeableStream = fs.createWriteStream(bundlePath);

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      if (file.isFile() && path.extname(path.join(stylesPath, file.name)) === '.css') {
        const readableStream = fs.createReadStream(path.join(stylesPath, file.name));
        readableStream.on('data', function (chunk) {
          writeableStream.write(chunk);
        });
      }
    });
  }
})