const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');

const webServer = express();

webServer.use(express.urlencoded({ extended: true }));
webServer.use(express.json({ extended: true }));

const PORT = 7780;
const logPath = path.join(__dirname, '_server.log');

function logLineSync(logMessage, logFilePath = logPath) {
  const logDT = new Date();
  const fullLog = `${logDT.toLocaleDateString()} ${logDT.toLocaleTimeString()} ${logMessage}`;

  console.log(fullLog);

  const logFd = fs.openSync(logFilePath, 'a+');
  fs.writeFileSync(logFd, fullLog + os.EOL);
  fs.closeSync(logFd);
}

const questions = {
  _id: 'someId',
  created: new Date(),
  data: [
    {
      questionId: '1',
      questionText: 'Question 1',
      answers: [
        { answerId: '1-1', answerText: 'yes' },
        { answerId: '1-2', answerText: 'no' },
      ],
    },
    {
      questionId: '2',
      questionText: 'Question 2',
      answers: [
        { answerId: '2-1', answerText: 'yes' },
        { answerId: '2-2', answerText: 'no' },
      ],
    },
    {
      questionId: '3',
      questionText: 'Question 3',
      answers: [
        { answerId: '3-1', answerText: 'yes' },
        { answerId: '3-2', answerText: 'no' },
        { answerId: '3-3', answerText: 'maybe' },
      ],
    },
  ],
};

const statistic = {
  updated: new Date(),
  data: {
    ['1']: {
      ['1-1']: 0,
      ['1-2']: 0,
    },
    ['2']: {
      ['2-1']: 0,
      ['2-2']: 0,
    },
    ['3']: {
      ['3-1']: 0,
      ['3-2']: 0,
      ['3-3']: 0,
    },
  },
};

webServer.get('/variants', (req, res) => {
  logLineSync(`${PORT} /variants called`);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(questions));
});

webServer.get('/stat', (req, res) => {
  logLineSync(`${PORT} /stat called`);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  console.log('statistic was send', statistic);
  
  res.send(JSON.stringify(statistic));
});

webServer.options('/vote', (req, res) => {
  logLineSync(`${PORT} /vote preflight called`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.send('');
});

webServer.post('/vote', (req, res) => {
  const voteData = req.body.answers;
  
  logLineSync(`${PORT} /vote called`);
  
  if (voteData) {
    for (const [questionId, answerId] of Object.entries(voteData)) {
      try {
        statistic.data[questionId][answerId]++;
        statistic.updated = new Date();
      } catch (e) {
        logLineSync(`${PORT} handle data error`);
        res.status(400).end();
      }
    }
    logLineSync(`${PORT} /vote data handled`);
  } else {
    logLineSync(`${PORT} /vote ERROR 400, bad data in request`);
    res.status(400).end();
  }
  
  console.log('statistic was changed', statistic);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  res.send('successfully added!');
});

webServer.listen(PORT, () => {
  logLineSync(`Backend server has been started on port ${PORT} in ${process.env.NODE_ENV} mode ......`);
});
