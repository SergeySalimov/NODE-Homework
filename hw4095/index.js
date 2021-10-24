process.title = 'postmanApp';
const express = require('express');
const path = require('path');
const fetch = require("isomorphic-fetch");
const fs = require('fs');
const { logLineAsync, getNewId } = require('../share/helper');

const webServer = express();
const PORT = 7780;
const API = '/api';
const pathToAppDist = '/postman/dist/postman/';
const logPath = path.join(__dirname, '_server.log');
const historyPath = path.join(__dirname, 'data/history.json');
let newHistory = {};

webServer.use(express.urlencoded({ extended: true }));
webServer.use(express.json({ extended: true }));
webServer.use((req, res, next) => {
  logLineAsync(`[${PORT}] url=${req.originalUrl} called`, logPath);
  next();
});
webServer.use(express.static(process.cwd() + pathToAppDist));

webServer.get(`${API}/histories`, (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    logLineAsync(`[${PORT}] history was send`, logPath);
    const historyJson = fs.readFileSync(historyPath, 'utf-8');
    res.send(historyJson).end();
  } catch (e) {
    logLineAsync(`[${PORT}] history is not exist return null`, logPath);
    res.status(204).send([]).end();
  }
});

webServer.get(`${API}/histories/:id`, (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  const { id } = req.id;
  
  try {
    const historyJson = fs.readFileSync(historyPath, 'utf-8');
    const histories = JSON.parse(historyJson);
    const response = histories.find(history => history.id === id);
    
    if (response) {
      logLineAsync(`[${PORT}] history id=${id} was send`, logPath);
      res.send(JSON.stringify(response)).end();
    } else {
      logLineAsync(`[${PORT}] history id=${id} was not found`, logPath);
      res.status(404).end();
    }
  } catch (e) {
    logLineAsync(`[${PORT}] history is not exist return null`, logPath);
    res.status(204).send([]).end();
  }
});

webServer.delete(`${API}/histories/:id`, (req, res) => {
  const { id } = req.params;
  let history;
  try {
    const historyJson = fs.readFileSync(historyPath, 'utf-8');
    history = JSON.parse(historyJson);
  } catch (e) {
    res.status(422).end();
  }
  
  const findIndex = history.findIndex(history => history.id === id);
  if (findIndex === -1) {
    res.status(404).end('History not found');
  }
  
  history.splice(findIndex, 1);
  try {
    fs.writeFileSync(historyPath, JSON.stringify(history), 'utf-8');
    logLineAsync(`[${PORT}] history file was successfully deleted`, logPath);
  } catch (e) {
    logLineAsync(`[${PORT}] error of deleting history`, logPath);
    res.status(422).end();
  }
  
  res.status(204).end();
});

webServer.options(`${API}/requests`, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.send('');
});

webServer.post(`${API}/requests`, async (req, res, next) => {
  const { type, url, body, headers } = req.body;
  newHistory = { ...req.body, id: getNewId(), created: new Date() };
  
  const options = {
    method: type,
    credentials: "same-origin",
  };
  // set Headers
  if (headers) {
    options.headers = headers;
  }
  // set Body, but not for GET, if so body ignores
  if (body && type !== 'GET') {
    options.body = body;
  }
  
  logLineAsync(`[${PORT}] proxy called for url=${url}, method ${type} ${!!headers ? 'with headers' : ''} ${!!headers && !!options.body ? 'and' : ''} ${!!options.body ? 'with body' : ''}`, logPath);
  
  let proxy_response;
  try {
    proxy_response = await fetch(url, options);
  } catch (e) {
    logLineAsync(`[${PORT}] fetch request return error`, logPath);
    res.status(400).end();
  }
  
  const responseText = await proxy_response.text();
  
  const headersArr = [];
  proxy_response.headers.forEach((value, name) => {
    headersArr.push(`${name}: ${value}`);
  }, this);
  
  const response = {
    responseText,
    contentType: proxy_response.headers.get('content-type'),
    headers: headersArr,
    status: proxy_response.status,
    statusText: proxy_response.statusText,
    url: proxy_response.url,
  };
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, max-age=0');
  res.setHeader('Content-Type', 'application/text');
  
  res.send(JSON.stringify(response));
  next();
});

webServer.use((req, res) => {
  let history;
  try {
    const historyJson = fs.readFileSync(historyPath, 'utf-8');
    history = JSON.parse(historyJson);
  } catch (e) {
    history = [];
  }
  
  history.push(newHistory);
  try {
    fs.writeFileSync(historyPath, JSON.stringify(history), 'utf-8');
    logLineAsync(`[${PORT}] history file was successfully updated`, logPath);
  } catch (e) {
    logLineAsync(`[${PORT}] error of saving history`, logPath);
  }
  
  res.end();
});

webServer.get('*', (req, res) => {
  res.sendFile(process.cwd() + pathToAppDist + 'index.html');
});

webServer.listen(PORT, () => {
  logLineAsync(`Backend server has been started on port ${PORT} in ${process.env.NODE_ENV} mode ......`, logPath);
});
