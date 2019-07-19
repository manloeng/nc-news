const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter.js');
const { customError, sqlErrors, serverErrors } = require('./errors/error.js');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config.js');

app.use((req, res, next) => {
	if (req.url === '/api/login') return next();
	const { authorization } = req.headers;
	const token = authorization.split(' ')[1];
	jwt.verify(token, JWT_SECRET, (err, res) => {
		if (err) next({ status: 401, msg: 'Unauthorised' });
		else next();
	});
});

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
	res.status(404).send({ msg: 'Page Not Found' });
});

app.use(customError, sqlErrors, serverErrors);

module.exports = app;
