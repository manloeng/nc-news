const express = require('express');
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/apiRouter.js');
const { customError, sqlErrors, serverErrors } = require('./errors/error.js');

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
	res.status(404).send({ msg: 'Page Not Found' });
});

app.use(customError, sqlErrors, serverErrors);

module.exports = app;
