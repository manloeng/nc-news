const { getTopics } = require('../model/topics-model.js');

const sendTopics = (req, res, next) => {
	getTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch(next);
};

module.exports = { sendTopics };
