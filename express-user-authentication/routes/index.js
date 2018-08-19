const router = require('express').Router();

const routes = (state) => {
  router.use('/account', require('./account')(state));

  router.use((err, req, res, next) => {
    if (err) {
      console.error(err);
      req.logout();
    } else {
      next();
    }
  });

  return router;
};

module.exports = routes;
