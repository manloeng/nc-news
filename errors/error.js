const sendMethodNotAllowed = (req, res, next) => {
	res.status(405).send({ msg: 'Method Not Allowed' });
};

const customError = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
};

const sqlErrors = (err, req, res, next) => {
	const sqlErrCodes = {
		'22P02': /invalid.+/g,
		'23502': /null.+/g,
		'23503': /.+?(?=")/,
		'23505': /.+/,
		'42703': /order by.+/g,

		// Dev sql error codes
		'42P01': /relation.+/g
	};

	if (err.code in sqlErrCodes) {
		if (err.code === '23503') {
			res.status(404).send({ msg: err.detail.match(sqlErrCodes[err.code])[0].trim() });
		}
		if (err.code === '23505') {
			res.status(400).send({ msg: err.detail.match(sqlErrCodes[err.code])[0] });
		}
		const errorMsg = err.message.match(sqlErrCodes[err.code])[0];
		res.status(400).send({ msg: errorMsg });
	} else next(err);
};

const serverErrors = (err, req, res, next) => {
	res.status(500).send({ msg: 'Internal Server Error' });
};

module.exports = { sendMethodNotAllowed, customError, sqlErrors, serverErrors };
