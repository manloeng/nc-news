const app = require('./app.js');
const PORT = 9090;

app.listen(PORT, () => {
	console.log(`server is listening on port: ${PORT}`);
});
