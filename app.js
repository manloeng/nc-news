const express = require('express');
const app = express();

app.all('/*', (req, res, next) => {
	res.status(404).send({ msg: 'Page Not Found' });
});

module.exports = app;
