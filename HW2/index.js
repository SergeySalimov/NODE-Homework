process.title = 'vote3595';
const express = require('express');
const path = require('path');
const fs = require('fs');
const { logLineAsync } = require('../share/helper');
const { statisticFromScratch } = require('./statistic-start-data');

const webServer = express();
const PORT = 7781;
const logPath = path.join(__dirname, '_server.log');
const questionsPath = path.join(__dirname, 'data/questions.json');
const statisticPath = path.join(__dirname, 'data/statistic.json');

webServer.use(express.urlencoded({ extended: true }));
webServer.use(express.json({ extended: true }));
webServer.use((req, res, next) => {
  logLineAsync(`[${PORT}] url=${req.originalUrl} called`, logPath);
  next();
});
webServer.use(express.static(process.cwd() + '/vote-app/dist/vote-app/'));

webServer.get('/api/variants', (req, res) => {
  const questionsJson = fs.readFileSync(questionsPath, 'utf-8');
  
  res.setHeader('Cache-Control','public, max-age=60');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  res.send(questionsJson);
});

webServer.get('/api/stat', (req, res) => {
  res.setHeader('Cache-Control','public, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const acceptHeader = req.headers['accept'];
  const isAcceptHeaderTextPlain = (acceptHeader === 'text/plain');
  
  isAcceptHeaderTextPlain
    ? res.setHeader('Content-Type', 'text/plain')
    : res.setHeader('Content-Type', 'application/json');
  
  try {
    const statisticJson = fs.readFileSync(statisticPath, 'utf-8');
    logLineAsync(`[${PORT}] statistic was send`, logPath);
  
    isAcceptHeaderTextPlain ? res.send(JSON.stringify(statisticJson)) : res.send(statisticJson);
  } catch (e) {
    logLineAsync(`[${PORT}] statistic was send from ZERO file`, logPath);
    
    res.send(JSON.stringify(statisticFromScratch));
  }
});

webServer.options('/api/vote', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.send('');
});

webServer.post('/api/vote', (req, res) => {
  const voteData = req.body.answers;
  let statistic;
  try {
    const statisticJson = fs.readFileSync(statisticPath, 'utf-8');
    statistic = JSON.parse(statisticJson);
  } catch (e) {
    logLineAsync(`[${PORT}] first save of statistic, got it from SCRATCH`, logPath);
    statistic = { ...statisticFromScratch };
  }
  
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
    logLineAsync(`[${PORT}] /vote data updated`, logPath);
  } else {
    logLineAsync(`[${PORT}] /vote ERROR 400, bad data in request`, logPath);
    res.status(400).end();
  }
  
  fs.writeFileSync(statisticPath, JSON.stringify(statistic), 'utf-8');
  logLineAsync(`[${PORT}] vote was successfully added`, logPath);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  res.send('successfully added!');
});

webServer.get('*', (req, res) => {
  res.sendFile(process.cwd() + '/vote-app/dist/vote-app/index.html');
});

webServer.listen(PORT, () => {
  logLineAsync(`Backend server has been started on port ${PORT} in ${process.env.NODE_ENV} mode ......`, logPath);
});
