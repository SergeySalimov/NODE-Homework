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

function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  
  return shuffledArray;
}

function getNewId() {
  // return 16 digit string ID
  const randomString = (Date.now().toString(36)  + Math.random().toString(36).substring(2, 15));
  const shuffledString = shuffleArray(randomString.split('')).join('');
  
  return shuffledString.substring(0, 16);
}

function checkIdValidity(id, logPath, PORT) {
  try {
    // Check for correct id
    assert(typeof id === 'string');
    assert(!id.match(/\s|S+/));
    assert(id.length === 16);
  } catch (e) {
    logLineAsync(`[${PORT}] history id=${id} was incorrect`, logPath);
    return false;
  }
  
  return true;
}

function getDateTimeLog() {
  const logDT = new Date();
  const currentDateTime = `${logDT.toLocaleDateString()} ${logDT.toLocaleTimeString()}:>`;
  
  return currentDateTime;
}

function messageLog(msg) {
  return console.log(`${getDateTimeLog()} ${msg}`);
}

function shortMessage(message, cutOn = 15) {
  return message.length > cutOn ? `${message.slice((cutOn - 3))}...` : message;
}

module.exports = {
  logLineSync,
  logLineAsync,
  removeDuplicated,
  getNewId,
  checkIdValidity,
  getDateTimeLog,
  messageLog,
  shortMessage,
};
