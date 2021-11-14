import express from 'express';
import path from 'path';
import fetch from 'isomorphic-fetch';
import fs from 'fs';
import cors from 'cors';
import { logLineAsync, getNewId, checkIdValidity } from '../share/helper-es6';
import WebSocket from 'ws';

const webServer = express();
const PORT = 7780;
const PORT2 = 7781;
const API = '/api';
const CORS_OPTIONS = {
  origin: '*', // разрешаем запросы с любого origin, вместо * здесь может быть ОДИН origin
  optionsSuccessStatus: 200, // на preflight-запрос OPTIONS отвечать кодом ответа 200
};
const pathToAppDist = '/postman/dist/postman/';
const logPath = path.join(__dirname, '_server.log');
const historyPath = path.join(__dirname, 'data/history.json');

// const socketServer = new WebSocket.Server({ port: PORT2});
// logLineAsync(`Websocket server has been started on port ${PORT2}`);

webServer.use(express.urlencoded({ extended: true }));
webServer.use(express.json({ extended: true }));
webServer.use((req, res, next) => {
  logLineAsync(`[${PORT}] url=${req.originalUrl} called`, logPath);
  next();
});
webServer.use(express.static(process.cwd() + pathToAppDist));

webServer.get(`${API}/histories`, cors(CORS_OPTIONS), (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');
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

webServer.get(`${API}/histories/:id`, cors(CORS_OPTIONS), (req, res) => {
  const { id } = req.params;
  
  if (!checkIdValidity(id, logPath, PORT)) {
    return res.status(422).send().end();
  }
  
  res.setHeader('Cache-Control', 'public, max-age=0');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const historyJson = fs.readFileSync(historyPath, 'utf-8');
    const histories = JSON.parse(historyJson);
    const response = histories.find(history => history.id === id);
    
    if (response) {
      logLineAsync(`[${PORT}] history id=${id} was send`, logPath);
      res.send(JSON.stringify(response)).end();
    } else {
      logLineAsync(`[${PORT}] history id=${id} was not found`, logPath);
      return res.status(404).end();
    }
  } catch (e) {
    logLineAsync(`[${PORT}] history is not exist return null`, logPath);
    res.status(204).send([]).end();
  }
});

webServer.delete(`${API}/histories/:id`, (req, res) => {
  const { id } = req.params;
  
  if (!checkIdValidity(id, logPath, PORT)) {
    return res.status(422).send().end();
  }
  
  let history;
  try {
    const historyJson = fs.readFileSync(historyPath, 'utf-8');
    history = JSON.parse(historyJson);
  } catch (e) {
    return res.status(422).end();
  }
  
  const findIndex = history.findIndex(history => history.id === id);
  if (findIndex === -1) {
    return res.status(404).end('History not found');
  }
  
  history.splice(findIndex, 1);
  try {
    fs.writeFileSync(historyPath, JSON.stringify(history), 'utf-8');
    logLineAsync(`[${PORT}] history file was successfully deleted`, logPath);
  } catch (e) {
    logLineAsync(`[${PORT}] error of deleting history`, logPath);
    return res.status(422).end();
  }
  
  res.status(204).end();
});

webServer.options(`${API}/requests`, cors(CORS_OPTIONS));

webServer.post(`${API}/requests`, async (req, res) => {
  const { type, url, body, headers } = req.body;
  const newHistory = { ...req.body, id: getNewId(), created: new Date() };
  
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
  
  let responseText;
  try {
    responseText = await proxy_response.text();
  } catch (e) {
    responseText = 'Failed to parse response text';
  }
  
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
  
  res.setHeader('Cache-Control', 'public, max-age=0');
  res.setHeader('Content-Type', 'application/text');
  
  res.send(JSON.stringify(response));
  
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
