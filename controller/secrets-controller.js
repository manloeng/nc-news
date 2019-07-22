const { getSecrets } = require('../model/secrets-model.js');

const sendSecrets = () => {
	console.log('sendSecrets');
	getSecrets();
};

module.exports = { sendSecrets };
