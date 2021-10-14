const express = require('express');
const path = require('path');
const fs = require('fs');
const { logLineAsync } = require('../share/loggers');
const { statisticFromScratch } = require('./statistic-start-data');

const webServer = express();
const PORT = 7781;
const logPath = path.join(__dirname, '_server.log');

webServer.use(express.urlencoded({ extended: true }));
webServer.use(express.json({ extended: true }));
webServer.use((req, res, next) => {
  logLineAsync(`[${PORT}] url=${req.originalUrl} called`, logPath);
  next();
});
webServer.use(express.static(process.cwd() + '/vote-app/dist/vote-app/'));

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

webServer.get('/api/variants', (req, res) => {
  res.setHeader('Cache-Control','public, max-age=60');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(questions));
});

webServer.get('/api/stat', (req, res) => {
  res.setHeader('Cache-Control','private, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  logLineAsync(`[${PORT}] statistic was send ${statistic}`, logPath);
  
  res.send(JSON.stringify(statistic));
});

webServer.options('/api/vote', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.send('');
});

webServer.post('/api/vote', (req, res) => {
  const voteData = req.body.answers;
  
  if (voteData) {
    for (const [questionId, answerId] of Object.entries(voteData)) {
      try {
        statistic.data[questionId][answerId]++;
        statistic.updated = new Date();
      } catch (e) {
        logLineAsync(`[${PORT}] handle data error`, logPath);
        res.status(400).end();
      }
    }
    logLineAsync(`[${PORT}] /vote data handled`, logPath);
  } else {
    logLineAsync(`[${PORT}] /vote ERROR 400, bad data in request`, logPath);
    res.status(400).end();
  }
  
  logLineAsync(`[${PORT}] statistic was send ${statistic}`, logPath);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  res.send('successfully added!');
});

webServer.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/vote-app/dist/vote-app/index.html');
});

webServer.listen(PORT, () => {
  logLineAsync(`Backend server has been started on port ${PORT} in ${process.env.NODE_ENV} mode ......`, logPath);
});
