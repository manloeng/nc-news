const { getTopics } = require('../model/topics-model.js');

const sendGetTopics = () => {
	console.log('sendGetTopics');
	getTopics();
};

module.exports = { sendGetTopics };
