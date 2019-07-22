const getJSON = require('../model/api-model.js');

const sendJSON = (req, res, next) => {
	const routes = getJSON();
	res.status(200).send({ routes });
};

module.exports = sendJSON;
