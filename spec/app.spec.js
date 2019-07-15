process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
const request = require('supertest');
const connection = require('../db/connection.js');
const app = require('../app.js');

chai.use(chaiSorted);

describe('/', () => {
	after(() => {
		connection.destroy();
	});
	it('/not-a-route', () => {
		return request(app).get('/not-a-route').expect(404).then(({ body }) => {
			expect(body.msg).to.equal('Page Not Found');
		});
	});
});
