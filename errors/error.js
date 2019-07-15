const sendMethodNotAllowed = (req, res, next) => {
	res.status(405).send({ msg: 'Method Not Allowed' });
};

const customError = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
};

const sqlErrors = (err, req, res, next) => {
	const reg = /invalid.+/g;
	if (err.code === '22P02') {
		res.status(400).send({ msg: err.message.match(reg)[0] });
	} else next(err);
};

const serverErrors = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: 'Internal Server Error' });
};

module.exports = { sendMethodNotAllowed, customError, sqlErrors, serverErrors };
