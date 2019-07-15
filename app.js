const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter.js');

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
	res.status(404).send({ msg: 'Page Not Found' });
});

app.use((err, req, res, next) => {
	// console.log(err.message);
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	}
	const reg = /invalid.+/g;
	if (err.code === '22P02') {
		res.status(400).send({ msg: err.message.match(reg)[0] });
	}
});

module.exports = app;
