const path = require('path');
const stream = require('stream');
const fs = require('fs');
const zlib = require('zlib');
const util = require('util');
const { messageLog } = require('../share/helper');

const pipeline = util.promisify(stream.pipeline);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const defaultFolderName = 'gzip-place';
const GZ = '.gz';

let workingFolder;

if (process.argv.length <= 2) {
  workingFolder = path.join(__dirname, defaultFolderName);
} else {
  workingFolder = path.join(__dirname, process.argv[2]);
}

async function compressFile(file) {
  const startTime = Date.now();
  try {
    await pipeline(
      fs.createReadStream(file),
      zlib.createGzip(),
      fs.createWriteStream(file + GZ),
    );
    const endTime = Date.now();
    messageLog(`${file} successfully compressed! Work time is ${endTime - startTime} ms`);
  } catch (err) {
    messageLog(`${file} compression failed`);
  }
}

async function getFilesFromFolder(folder) {
  try {
    return await readdir(folder);
  } catch (e) {
    messageLog('Error no such directory! Program was terminated');
  }
}

async function processingFilesInFolder(folderData, workingDir) {
  for (const data of folderData) {
    if (data.endsWith(GZ)) {
      continue;
    }
    
    const fullPath = path.join(workingDir, data);
    const stats = await stat(fullPath);
    if (stats.isFile()) {
      const gzVersionPath = fullPath + GZ;
      
      if (fs.existsSync(gzVersionPath)) {
        const gzStats = await stat(gzVersionPath);
  
        if (stats.mtime > gzStats.mtime) {
          messageLog(`${fullPath} found not actual version of compressed file, will recompress this file!`);
        } else {
          messageLog(`${fullPath} is already compressed!`);
          continue;
        }
      }
      
      await compressFile(fullPath);
      
    } else if (stats.isDirectory()) {
      const newFolderData = await getFilesFromFolder(fullPath);
      await processingFilesInFolder(newFolderData, fullPath);
    } else {
      messageLog(`${data} is not a file or directory and was skipped`)
    }
  }
}

async function startProcess() {
  messageLog('====================================== STARTING AUTOCOMPRESSOR =====================================');
  messageLog(`${workingFolder} everything here will be compressed`);
  let folderData = await getFilesFromFolder(workingFolder);
  await processingFilesInFolder(folderData, workingFolder);
  messageLog('===================================== FINISHING AUTOCOMPRESSOR =====================================');
}

startProcess();
