const fs = require('fs');
const os = require('os');
const path = require('path');

const logPath = path.join(__dirname, '_server.log');

function logLineSync(logMessage, logFilePath = logPath) {
  const logDT = new Date();
  const fullLog = `${logDT.toLocaleDateString()} ${logDT.toLocaleTimeString()} ${logMessage}`;
  
  console.log(fullLog);
  
  const logFd = fs.openSync(logFilePath, 'a+');
  fs.writeFileSync(logFd, fullLog + os.EOL);
  fs.closeSync(logFd);
}

function logLineAsync(logMessage, logFilePath = logPath) {
 return new Promise((resolve ,reject) => {
   const logDT = new Date();
   const fullLog = `${logDT.toLocaleDateString()} ${logDT.toLocaleTimeString()} ${logMessage}`;
  
   console.log(fullLog);
  
   fs.open(logFilePath, 'a+', (err, logFd) => {
     if(err) {
       reject(err);
     } else {
       fs.write(logFd, fullLog + os.EOL, (err) => {
         if (err) {
           reject(err);
         } else {
           fs.close(logFd, err => { err ? reject(err) : resolve(); });
         }
       });
     }
   });
 })
}

function removeDuplicated(arrayOfObj) {
  const checkForDuplicate = [...arrayOfObj];
  
  return Array.from(new Set(checkForDuplicate.map(JSON.stringify))).map(JSON.parse);
}

module.exports = {
  logLineSync,
  logLineAsync,
  removeDuplicated,
};
