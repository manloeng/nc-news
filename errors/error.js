const sendMethodNotAllowed = (req, res, next) => {
	res.status(405).send({ msg: 'Method Not Allowed' });
};

module.exports = { sendMethodNotAllowed };
