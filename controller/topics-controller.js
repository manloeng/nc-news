const { getTopics } = require('../model/topics-model.js');

const sendGetTopics = (req, res, next) => {
	getTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch(next);
};

module.exports = { sendGetTopics };
