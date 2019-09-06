const app = require('./app.js');
const PORT = process.env.PORT || 9090;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
	console.log(`server is listening on: ${HOST}:${PORT}`);
});
