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

	beforeEach(() => {
		return connection.seed.run();
	});

	it('/not-a-route', () => {
		return request(app).get('/not-a-route').expect(404).then(({ body }) => {
			expect(body.msg).to.equal('Page Not Found');
		});
	});

	describe('/api', () => {
		describe('/api/topics', () => {
			describe('Http methods', () => {
				describe('GET method', () => {
					it('GET /topics - responds with a Status:200 and the list of the topics data', () => {
						return request(app).get('/api/topics').expect(200).then(({ body }) => {
							expect(body).to.be.a('object');
							expect(body.topics[0]).to.have.keys('slug', 'description');
						});
					});
				});
			});
		});
	});
});
