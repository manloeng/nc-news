const { getArticleById } = require('../model/articles-model.js');

const sendGetArticleById = () => {
	console.log('sendGetArticleById');
	getArticleById();
};

module.exports = { sendGetArticleById };
