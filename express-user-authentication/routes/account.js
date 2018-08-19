const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');

const { createUser } = require('../user');

const routes = (state) => {
  router.get('/info', requireAuth, (req, res) => {
    res.json(req.user);
  });

  router.post('/login', (req, res, next) => {
    state.passport.authenticate('local', (err, user, info) => {
      if (err) { next(err); }

      if (!user) {
        return res.status(422).json({ error: info.message });
      }

      req.logIn(user, (err) => {
        if (err) {
          next(err);
        }

        return res.json({ authenticated: 1, userId: user.id });
      });
    })(req, res, next);
  });

  router.post(
    '/register',
    async (req, res) => {
      try {
        await createUser(state.db, req.body.username, req.body.password);
        res.json({ 'ok': 1 });
      } catch (e) {
        console.error(e);
        res.sendStatus(500);
      }
    }
  );

  return router;
};

module.exports = routes;
