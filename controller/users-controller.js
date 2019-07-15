const { getUserByUsername } = require('../model/users-model.js');

const sendGetUserByUsername = (req, res, next) => {
	console.log('sendGetUserByUsername');
	getUserByUsername();
};

module.exports = { sendGetUserByUsername };
