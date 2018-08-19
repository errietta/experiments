const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { getUserById, getUserByUsername, checkPassword } = require('../user');

const strategies = (state) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
          const user = await getUserByUsername(state.db, username);

          if (user) {
            if (await checkPassword(user, password)) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'incorrect password' });
            }
          } else {
            return done(null, false, { message: 'Incorrect username' });
          }
        } catch (e) {
          console.error(e);
          return done(null, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(state.db, id);
      done(null, user);
    } catch (e) {
      console.log(e);
      done(null, false);
    }
  });

  return passport;
};

module.exports = strategies;
