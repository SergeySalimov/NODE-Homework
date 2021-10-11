const express = require('express');
const expressHandlebars  = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const os = require('os');
const helmet = require('helmet');
const handlebars = require('handlebars');
const { logLineAsync } = require('../share/loggers');

const PORT = 7781;
const logPath = path.join(__dirname, '_server.log');
const appDirectoryPath = path.join(__dirname, 'fe');
const viewsDirectoryPath = path.join(__dirname, 'fe/views');
const resultsPath = path.join(__dirname, 'results.json');

const webServer = express();

webServer.engine('handlebars', expressHandlebars());
webServer.set('view engine', 'handlebars');
webServer.set('views', path.join(viewsDirectoryPath));

webServer.use(express.urlencoded({ extended: true }));
webServer.use(express.json({ extended: true }));
webServer.use(helmet());
webServer.use(express.static(appDirectoryPath));
webServer.use((req, res, next) => {
  logLineAsync(`[${PORT}] static server called, original url=${req.originalUrl}`, logPath);
  next();
});
webServer.use('/', express.static(path.join(appDirectoryPath, 'index.html')));
webServer.use('/variants', express.static(path.join(appDirectoryPath, 'variants.html')));
webServer.use('/stat', express.static(path.join(appDirectoryPath, 'statistic.html')));

webServer.post('/vote', (req, res, next) => {
  try {
    const answer = req.body.answer;
    
    const resultsJson = fs.readFileSync(resultsPath, 'utf-8');
    const resultsArr = JSON.parse(resultsJson);
  
    let indexOfAnswerInResults = resultsArr.results.findIndex(result => result.id === answer);
    if (indexOfAnswerInResults === -1) {
      res.sendFile(path.join(appDirectoryPath, '404.html'));
      res.end();
    }

    let voteNumbers = resultsArr.results[indexOfAnswerInResults].answers;
    resultsArr.results[indexOfAnswerInResults].answers = ++voteNumbers;
  
    fs.writeFileSync(resultsPath, JSON.stringify(resultsArr), 'utf-8');
    logLineAsync(`[${PORT}] write answer in ${resultsPath}`, logPath);
    res.sendFile(path.join(appDirectoryPath, 'thanks.html'));
    
  } catch (e) {
    // ToDO rework on error on page
    res.sendFile(path.join(appDirectoryPath, '404.html'));
  }
});

webServer.listen(PORT, () => {
  logLineAsync(`Backend server has been started on port ${PORT} in ${process.env.NODE_ENV} mode ......
Path for index.html: ${appDirectoryPath}`, logPath);
});
