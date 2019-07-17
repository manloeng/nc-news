const getJSON = require('../model/api-model.js');

const sendGetJSON = (req, res, next) => {
	console.log('sendGetJSON');
	getJSON();
};

module.exports = sendGetJSON;
