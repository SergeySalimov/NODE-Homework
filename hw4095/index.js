process.title = 'postmanApp';
const express = require('express');
const path = require('path');
const fs = require('fs');
const { logLineAsync } = require('../share/loggers');

const webServer = express();
const PORT = 7780;
const pathToAppDist = '/postman/dist/postman/';
const logPath = path.join(__dirname, '_server.log');

webServer.use(express.urlencoded({ extended: true }));
webServer.use(express.json({ extended: true }));
webServer.use((req, res, next) => {
  logLineAsync(`[${PORT}] url=${req.originalUrl} called`, logPath);
  next();
});
webServer.use(express.static(process.cwd() + pathToAppDist));

webServer.options('/api/request', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.send('');
});

webServer.post('/api/request', (req, res) => {
  console.log(req.body);
  
  res.send('got data successfully!')
});

webServer.get('*', (res, req) => {
  res.sendFile(process.cwd() + pathToAppDist);
});

webServer.listen(PORT, () => {
  logLineAsync(`Backend server has been started on port ${PORT} in ${process.env.NODE_ENV} mode ......`, logPath);
});
