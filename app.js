const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const strategies = require('./auth/strategies');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db.db');

const getConfig = require('./config').getConfig;

const setUpApp = (config) => {
  const state = {
    config,
    db,
  };

  state.passport = strategies(state);

  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(cookieParser());
  app.use(session({ secret: config.sessionSecret }));

  app.use(state.passport.initialize());
  app.use(state.passport.session());

  app.use(require('./routes')(state));

  return new Promise((resolve, reject) => app.listen(process.env.PORT || 3000, (err, res) => {
    if (err) { reject(err); }
    resolve(res);
  }));
};

const startServer = async () => {
  try {
    const config = await getConfig();
    await setUpApp(config);
    console.log('ready');
  } catch (e) {
    console.error(e);
  }
}

startServer();
