const AWS = require('aws-sdk');

const getSecrets = async () => {
  const secretClient = new AWS.SecretsManager({
    endpoint: process.env.AWS_ENDPOINT || 'https://secretsmanager.eu-west-2.amazonaws.com',
    region: process.env.AWS_REGION || 'eu-west-2',
  });

  const secrets = await secretClient.getSecretValue({
    SecretId: 'MyAppSecrets',
  }).promise();

  return JSON.parse(secrets.SecretString);
}

module.exports = { getSecrets };
