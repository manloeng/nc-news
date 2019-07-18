const { getTopics, insertTopics } = require('../model/topics-model.js');

const sendTopics = (req, res, next) => {
	getTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch(next);
};

const postTopics = (req, res, next) => {
	insertTopics(req.body)
		.then((topic) => {
			res.status(201).send({ topic });
		})
		.catch(next);
};
module.exports = { sendTopics, postTopics };
