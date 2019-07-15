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

		describe('/api/users/:username', () => {
			describe('Http methods', () => {
				describe('GET method', () => {
					it('GET /users/:username - responds with a Status:200 and the users data', () => {
						return request(app).get('/api/users/butter_bridge').expect(200).then(({ body }) => {
							expect(body).to.be.a('object');
							expect(body.user).to.have.keys('username', 'name', 'avatar_url');
						});
					});

					it('GET /users/:username - responds with a Status:400 when passed with an invalid username format', () => {
						return request(app).get('/api/users/999').expect(400).then(({ body }) => {
							expect(body.msg).to.be.equal('Bad Request');
						});
					});

					it("GET /users/:username - responds with a Status:404 when passed with an username that isn't found", () => {
						return request(app).get('/api/users/Andrew').expect(404).then(({ body }) => {
							expect(body.msg).to.be.equal('User Not Found');
						});
					});
				});
			});
		});

		describe.only('/api/articles/:article_id', () => {
			describe('Http methods', () => {
				describe('GET method', () => {
					it('GET /articles/:article_id - responds with a Status:200 and the article data', () => {
						return request(app).get('/api/articles/1').expect(200).then(({ body }) => {
							expect(body).to.be.a('object');
							expect(body.articles).to.have.keys(
								'article_id',
								'title',
								'topic',
								'author',
								'body',
								'votes',
								'created_at'
							);
						});
					});
				});
			});
		});
	});
});
