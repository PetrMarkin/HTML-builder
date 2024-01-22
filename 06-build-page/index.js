const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const projectDistPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(__dirname, 'assets');
const assetsDistPath = path.join(projectDistPath, 'assets');
const styleCssPath = path.join(projectDistPath, 'style.css');
const indexHtmlPath = path.join(projectDistPath, 'index.html');
const templateHtmlPath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const writeableStreamCss = fs.createWriteStream(styleCssPath);

fs.mkdir(projectDistPath, { recursive: true }, () => {});
fs.mkdir(assetsDistPath, { recursive: true }, () => {});
fs.unlink(assetsDistPath, () => {});

const readableTemplate = fs.createReadStream(templateHtmlPath, 'utf-8', () => {});
readableTemplate.on('data', (chunk) => {
  let data = '';
  data += chunk;
  fs.readdir(componentsPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === '.html') {
          const component = file.name.replace(path.extname(path.join(componentsPath, file.name)), '');
          const readableComponents = fs.createReadStream(path.join(componentsPath, file.name), 'utf-8');
          readableComponents.on('data', (chunk) => {
            data = data.replaceAll(`{{${component}}}`, chunk);
            fs.writeFile(indexHtmlPath, data, () => {});
          })
        }
      })
    }
  })
});

async function bundleAssets(assetsPath) {
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
          bundleAssets(currentPath);
        } else {
          fsPromises.copyFile(currentPath, path.join(assetsDistPath, currentPath.slice(66)));
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
bundleAssets(assetsPath);

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