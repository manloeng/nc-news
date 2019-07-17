const getJSON = require('../model/api-model.js');

const sendGetJSON = (req, res, next) => {
	const json = getJSON();
	res.status(200).send({ json });
};

module.exports = sendGetJSON;
