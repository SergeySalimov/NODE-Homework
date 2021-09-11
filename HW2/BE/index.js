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
      questionId: 'q1',
      questionText: 'Бейсбольная бита и мяч вместе стоят 1 доллар 10 центов. Бита дороже мяча на 1 доллар. Сколько стоит мяч?',
      answers: [
        { answerId: 'a1-1', answerText: '10 центов' },
        { answerId: 'a1-2', answerText: 'Другое' },
        { answerId: 'a1-3', answerText: 'Не знаю' },
      ],
    },
    {
      questionId: 'q2',
      questionText: '5 машин за 5 минут производят 5 штуковин. Сколько времени понадобится 100 машинам, чтобы произвести 100 штуковин?',
      answers: [
        { answerId: 'a2-1', answerText: '100 минут' },
        { answerId: 'a2-2', answerText: '5 минут' },
        { answerId: 'a2-3', answerText: 'Не знаю' },
      ],
    },
    {
      questionId: 'q3',
      questionText: 'Пруд зарастает кувшинками. Каждый день их площадь удваивается. Целиком озеро зарастет за 48 дней. За сколько дней цветы поглотят половину его поверхности?',
      answers: [
        { answerId: 'a3-1', answerText: '24' },
        { answerId: 'a3-2', answerText: '47' },
        { answerId: 'a3-3', answerText: 'Не знаю' },
      ],
    },
  ],
};

const statistic = {
  updated: new Date(),
  questionsData: [
    { ['q1']: 'Бейсбольная бита и мяч вместе стоят 1 доллар 10 центов. Бита дороже мяча на 1 доллар. Сколько стоит мяч?' },
    { ['q2']: '5 машин за 5 минут производят 5 штуковин. Сколько времени понадобится 100 машинам, чтобы произвести 100 штуковин?' },
    { ['q3']: 'Пруд зарастает кувшинками. Каждый день их площадь удваивается. Целиком озеро зарастет за 48 дней. За сколько дней цветы поглотят половину его поверхности?' },
  ],
  answersData: [
    { ['a1-1']: '10 центов' },
    { ['a1-2']: 'Другое' },
    { ['a1-3']: 'Не знаю' },
    { ['a2-1']: '100 минут' },
    { ['a2-2']: '5 минут' },
    { ['a2-3']: 'Не знаю' },
    { ['a3-1']: '24' },
    { ['a3-2']: '47' },
    { ['a3-3']: 'Не знаю' },
  ],
  data: {
    ['q1']: {
      ['a1-1']: 0,
      ['a1-2']: 0,
      ['a1-3']: 0,
    },
    ['q2']: {
      ['a2-1']: 0,
      ['a2-2']: 0,
      ['a2-3']: 0,
    },
    ['q3']: {
      ['a3-1']: 0,
      ['a3-2']: 0,
      ['a3-3']: 0,
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
