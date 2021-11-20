process.title = 'hw6195';
const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('handlebars');
const { logLineAsync, shortMessage } = require('../share/helper');
const cors = require('cors');

const DATA_BASE = 'learning_db';

const PORT = 7780;
const CORS_OPTIONS = {
  origin: '*', // разрешаем запросы с любого origin, вместо * здесь может быть ОДИН origin
  optionsSuccessStatus: 200, // на preflight-запрос OPTIONS отвечать кодом ответа 200
};
const logPath = path.join(__dirname, '_server.log');
const viewsDirectoryPath = path.join(__dirname, 'fe/views');
let serverUrl;
let connectionConfig;

// Set configurations for development or production
if (process.env.NODE_ENV === 'production') {
  serverUrl = 'http://178.172.195.18:7780/api';
  connectionConfig = {
    connectionLimit : 2,      // полагаем что БД выдержит 2 соединения, т.е. в пуле будет максимум 2 соединения
    host            : 'localhost',   // на каком компьютере расположена база данных
    user            : 'root',    // каким пользователем подключаемся (на учебном сервере - "root")
    password        : '1234',    // каким паролем подключаемся (на учебном сервере - "1234")
    database        : DATA_BASE, // к какой базе данных подключаемся
  };
} else {
  serverUrl = 'http://localhost:7780/api';
  connectionConfig = {
    connectionLimit : 2,
    host            : 'localhost',
    user            : 'root',
    database        : DATA_BASE,
  };
}

const webServer = express();

webServer.engine('handlebars', expressHandlebars());
webServer.set('view engine', 'handlebars');
webServer.set('views', path.join(viewsDirectoryPath));
webServer.use(cors(CORS_OPTIONS));
webServer.use(bodyParser.json());
webServer.use((req, res, next) => {
  logLineAsync(`[${PORT}] url=${req.originalUrl} called`, logPath);
  next();
});

webServer.post('/api/sql', (req, res) => {
  const { sqlRequest } = req.body;
  if (!sqlRequest) {
    logLineAsync(`[${PORT}] ERROR sql request not defined`, logPath);
    return res.status(400).send().end();
  }
  
  logLineAsync(`[${PORT}] opening DB connection`, logPath);
  let connection = null;
  
  try {
    connection = mysql.createConnection(connectionConfig); // в каждом обработчике express устанавливаем с MySQL новое соединение!
    connection.connect();
    
    connection.query(sqlRequest, (error, results, fields) => {
      if (error) {
        logLineAsync(`[${PORT}] ERROR bad sql request. Error text: ${shortMessage(error)}`, logPath);
        res.status(501).send();
      } else {
        res.status(200).send({ results, fields });
      }
  
      logLineAsync(`[${PORT}] closing DB connection`, logPath);
      connection.end();
      res.end();
    });
  } catch (e) {
    logLineAsync(`[${PORT}] ERROR connecting DB: Error text: ${shortMessage(e)}`, logPath);
    return res.status(500).send().end;
  }
});

webServer.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('Cache-Control','public, max-age=60');
  
  res.render(
    'home-page',
    {
      DATA_BASE,
      serverUrl,
      layout: 'app-layout',
    },
  );
});

webServer.listen(PORT, () => {
  logLineAsync(`Backend server has been started on port ${PORT} in ${process.env.NODE_ENV} mode ......`, logPath);
});
