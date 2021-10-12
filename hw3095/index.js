const express = require('express');
const expressHandlebars  = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const handlebars = require('handlebars');
const { logLineAsync } = require('../share/loggers');

const PORT = 7781;
const logPath = path.join(__dirname, '_server.log');
const staticPath = path.join(__dirname, 'fe/static');
const viewsDirectoryPath = path.join(__dirname, 'fe/views');
const resultsPath = path.join(__dirname, 'results.json');
const questionsPath = path.join(__dirname, 'questions.json');

const webServer = express();

webServer.engine('handlebars', expressHandlebars());
webServer.set('view engine', 'handlebars');
webServer.set('views', path.join(viewsDirectoryPath));

webServer.use(express.urlencoded({ extended: true }));
webServer.use(express.json({ extended: true }));

webServer.use(express.static(staticPath));
webServer.use((req, res, next) => {
  logLineAsync(`[${PORT}] render dynamic page, original url=${req.originalUrl}`, logPath);
  next();
});

webServer.get('/', (req, res) => {
  res.render(
    'home-page',
    {
      layout: 'app-layout',
      pageTitle: 'Home page',
      withNavigation: true,
      activeHome: true,
    },
  );
});

webServer.get('/variants', (req, res) => {
  const questionsJson = fs.readFileSync(questionsPath, 'utf-8');
  const questionsArr = JSON.parse(questionsJson);
  const { question } = questionsArr;
  
  res.setHeader("Cache-Control","public, max-age=60");
  
  res.render(
    'variants-page',
    {
      question,
      layout: 'app-layout',
      pageTitle: 'Variants for favorite pet',
      withNavigation: true,
      activeVariants: true,
    },
  );
});

webServer.get('/stat', (req, res) => {
  const questionsJson = fs.readFileSync(questionsPath, 'utf-8');
  const resultsJson = fs.readFileSync(resultsPath, 'utf-8');
  const questionsArr = JSON.parse(questionsJson);
  const resultsArr = JSON.parse(resultsJson);
  const { question } = questionsArr;
  const { results } = resultsArr;
  const totalCount = results.map(r => r.answers).reduce((a, b) => a + b);
  const result = results.map((r, i) => ({
    ...r,
    ratio: !!totalCount ? Math.floor(r.answers / totalCount * 100) : 0,
    name: question.filter(q => q.id === r.id)[0].name || 'No name',
  }));
  
  res.setHeader("Cache-Control","private, max-age=0");
  
  res.render(
    'statistic-page',
    {
      result,
      totalCount,
      layout: 'app-layout',
      pageTitle: 'Statistic',
      withNavigation: true,
      activeStatistic: true,
    },
  );
});

webServer.post('/vote', (req, res, next) => {
  try {
    const answer = req.body.answer;
    
    const resultsJson = fs.readFileSync(resultsPath, 'utf-8');
    const resultsArr = JSON.parse(resultsJson);
  
    let indexOfAnswerInResults = resultsArr.results.findIndex(result => result.id === answer);
  
    if (indexOfAnswerInResults === -1) {
      res.render(
        'error-page',
        {
          layout: 'app-layout',
          pageTitle: 'Oops!',
          withNavigation: false,
        },
      );
    } else {
      let voteNumbers = resultsArr.results[indexOfAnswerInResults].answers;
      resultsArr.results[indexOfAnswerInResults].answers = ++voteNumbers;
  
      fs.writeFileSync(resultsPath, JSON.stringify(resultsArr), 'utf-8');
      logLineAsync(`[${PORT}] write answer in ${resultsPath}`, logPath);
      res.render(
        'thanks-page',
        {
          layout: 'app-layout',
          pageTitle: 'Thanks for voting !!',
          withNavigation: false,
        },
      );
    }
  } catch (e) {
    res.render(
      'error-page',
      {
        layout: 'app-layout',
        pageTitle: 'Oops!',
        withNavigation: false,
      },
    );
  }
});

webServer.get('*', (req, res) => {
  res.render(
    'error-page',
    {
      layout: 'app-layout',
      pageTitle: 'Oops!',
      withNavigation: false,
    },
  );
});

webServer.listen(PORT, () => {
  logLineAsync(`Backend server has been started on port ${PORT} in ${process.env.NODE_ENV} mode ......`, logPath);
});
