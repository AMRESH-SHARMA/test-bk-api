import fs from 'fs-extra'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const mediaDel = () => {

  console.log(__dirname)
  console.log(path.join(__dirname, '../uploads'))

  let folder = path.join(__dirname, '../uploads')
  fs.emptyDir(folder)
  .then(() => {
    console.log('file deleted from uploads')
  })
  .catch(err => {
    console.error(err)
  })
}