const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const projectDistPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(__dirname, 'assets');
const assetsDistPath = path.join(projectDistPath, 'assets');
const styleCssPath = path.join(projectDistPath, 'style.css');
const indexHtmlPath = path.join(projectDistPath, 'index.html');
const templateHtmlPath = path.join(__dirname, 'template.html');
const stylesPath = path.join(__dirname, 'styles');
const writeableStreamCss = fs.createWriteStream(styleCssPath);
const writeableStreamIndexHtml = fs.createWriteStream(indexHtmlPath);

fs.mkdir(projectDistPath, { recursive: true }, () => {});
fs.mkdir(assetsDistPath, { recursive: true }, () => {});
fs.unlink(assetsDistPath, () => {});

async function copyFiles(assetsPath) {
  await fsPromises
    .readdir(assetsPath, { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        const currentPath = path.join(assetsPath, file.name);
        if (file.isDirectory()) {
          fs.mkdir(
            path.join(assetsDistPath, file.name),
            { recursive: true },
            () => {},
          );
          copyFiles(currentPath);
        } else {
          fsPromises.copyFile(currentPath, path.join(assetsDistPath, currentPath.slice(66)));
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
copyFiles(assetsPath);

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      if (file.isFile() && path.extname(path.join(stylesPath, file.name)) === '.css') {
        const readableStream = fs.createReadStream(path.join(stylesPath, file.name));
        readableStream.on('data', function (chunk) {
          writeableStreamCss.write(chunk);
        });
      }
    });
  }
})