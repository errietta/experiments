const bcrypt = require('bcrypt');

const getUserByUsername = (db, username) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username=?", [username], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
};

const getUserById = (db, id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE id=?", [id], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
};

const checkPassword = (user, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, res) => {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
}

const insertUserRow = (db, username, hashedPassword) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users(username, password) VALUES(?, ?)',
      [username, hashedPassword],
      (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
}

const createUser = async (db, username, password) => {
  let user = await getUserByUsername(db, username);
  if (user) {
    throw new Error('User exists already');
  }

  const hashedPassword = await (hashPassword(password));
  await insertUserRow(db, username, hashedPassword);
  return true;
}

module.exports = {
  getUserByUsername,
  getUserById,
  checkPassword,
  createUser,
};
