const { getSecrets } = require('./secretsManager');

const getConfig = async (env) => {
  let config = {};

  if (env !== 'production') {
    config = {
      sessionSecret: 'DEVELOPMENT-ONLY',
      jwtKey: 'DEVELOPMENT-ONLY',
    }
  } else {
    const secrets = await getSecrets();
    console.log(secrets);
    config = {
      sessionSecret: secrets.sessionKey,
      jwtKey: secrets.jwtKey,
    }
  }

  console.log(config);

  return config;
}

module.exports = { getConfig };
