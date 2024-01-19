const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const filesPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');

async function copyFiles() {
  fs.rm(filesCopyPath, { recursive: true }, () => {});
  await fsPromises.mkdir(filesCopyPath, { recursive: true }, (err) => {
    if (err) throw err;
  });
  await fsPromises
    .readdir(filesPath, { withFileTypes: true })
    .then((file) => {
      file.forEach((file) => {
        fsPromises.copyFile(path.join(filesPath, file.name), path.join(filesCopyPath, file.name))
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
copyFiles();