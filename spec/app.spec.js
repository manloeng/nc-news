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

				it('Invalid Methods for /topics - responds with a Status:405', () => {
					const invalidMethods = [ 'patch', 'put', 'post', 'delete' ];

					invalidMethods.forEach((method) => {
						return request(app)[method]('/api/topics').expect(405).then(({ body }) => {
							expect(body.msg).to.equal('Method Not Allowed');
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

					it('GET /users/:username - responds with a Status:400 when passed with an invalid username', () => {
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

				it('Invalid Methods for /users/:username - responds with a Status:405', () => {
					const invalidMethods = [ 'patch', 'put', 'post', 'delete' ];

					invalidMethods.forEach((method) => {
						return request(app)[method]('/api/users/butter_bridge').expect(405).then(({ body }) => {
							expect(body.msg).to.equal('Method Not Allowed');
						});
					});
				});
			});
		});

		describe('/api/articles/:article_id', () => {
			describe('Http methods', () => {
				describe('GET method', () => {
					it('GET /articles/:article_id - responds with a Status:200 and the article data', () => {
						return request(app).get('/api/articles/1').expect(200).then(({ body }) => {
							expect(body).to.be.a('object');
							expect(body.article).to.have.keys(
								'article_id',
								'title',
								'topic',
								'author',
								'body',
								'votes',
								'created_at',
								'comment_count'
							);
						});
					});

					it('GET /articles/:article_id - responds with a Status:400 when passed with an invalid article_id', () => {
						return request(app).get('/api/articles/not-a-valid-id').expect(400).then(({ body }) => {
							expect(body.msg).to.be.equal('invalid input syntax for integer: "not-a-valid-id"');
						});
					});

					it("GET /articles/:article_id - responds with a Status:404 when passed with an article_id that isn't found", () => {
						return request(app).get('/api/articles/9999').expect(404).then(({ body }) => {
							expect(body.msg).to.be.equal('Article ID Not Found');
						});
					});
				});

				describe('PATCH method', () => {
					it('PATCH /articles/:article_id - responds with a Status:200 and the updated article vote data', () => {
						return request(app).patch('/api/articles/1').send({ inc_votes: 105 }).expect(200).then(({ body }) => {
							expect(body.article.votes).to.be.equal(205);
							expect(body.article).to.have.keys(
								'article_id',
								'title',
								'topic',
								'author',
								'body',
								'votes',
								'created_at',
								'comment_count'
							);
						});
					});

					it('PATCH /articles/:article_id - responds with a Status:200 and the updated article vote data', () => {
						return request(app).patch('/api/articles/1').send({ inc_votes: -101 }).expect(200).then(({ body }) => {
							expect(body.article.votes).to.be.equal(-1);
						});
					});

					it('PATCH /articles/:article_id - responds with a Status:200 when passed with an empty object', () => {
						return request(app).patch('/api/articles/1').send({}).expect(200).then(({ body }) => {
							expect(body.article.article_id).to.be.equal(1);
						});
					});

					it('PATCH /articles/:article_id - responds with a Status:400 when passed with an invalid article_id', () => {
						return request(app)
							.patch('/api/articles/not-a-valid-id')
							.send({ inc_votes: -101 })
							.expect(400)
							.then(({ body }) => {
								expect(body.msg).to.be.equal('invalid input syntax for integer: "not-a-valid-id"');
							});
					});

					it('PATCH /articles/:article_id - responds with a Status:400 when passed with an invalid update key but a valid value', () => {
						return request(app)
							.patch('/api/articles/1')
							.send({ 'not-a-valid-key': 100 })
							.expect(400)
							.then(({ body }) => {
								expect(body.msg).to.be.equal('Not a Valid Key-Value');
							});
					});

					it('PATCH /articles/:article_id - responds with a Status:400 when passed with an valid key but invalid update value', () => {
						return request(app)
							.patch('/api/articles/1')
							.send({ inc_votes: 'not-a-valid-value' })
							.expect(400)
							.then(({ body }) => {
								expect(body.msg).to.be.equal('invalid input syntax for integer: "NaN"');
							});
					});

					it('PATCH /articles/:article_id - responds with a Status:400 when passed with an valid update key-value pair and an invalid key-value pair', () => {
						return request(app)
							.patch('/api/articles/1')
							.send({ inc_votes: 100, 999: 100 })
							.expect(400)
							.then(({ body }) => {
								expect(body.msg).to.be.equal('Not a Valid Key-Value');
							});
					});

					it("PATCH /articles/:article_id - responds with a Status:404 when passed with an article_id that isn't found", () => {
						return request(app).patch('/api/articles/999').send({ inc_votes: -101 }).expect(404).then(({ body }) => {
							expect(body.msg).to.be.equal('Article ID Not Found');
						});
					});
				});

				it('Invalid Methods for /articles/:article_id - responds with a Status:405', () => {
					const invalidMethods = [ 'put', 'post', 'delete' ];

					invalidMethods.forEach((method) => {
						return request(app)[method]('/api/articles/1').expect(405).then(({ body }) => {
							expect(body.msg).to.equal('Method Not Allowed');
						});
					});
				});
			});

			describe('/api/articles/:article_id/comments', () => {
				describe('Http methods', () => {
					describe('POST method', () => {
						it('POST /articles/:article_id/comments - responds with a Status:201 and the newly created comment', () => {
							return request(app)
								.post('/api/articles/1/comments')
								.send({
									body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
									username: 'butter_bridge'
								})
								.expect(201)
								.then(({ body }) => {
									expect(body).to.be.a('object');
									expect(body.comment).to.have.keys(
										'comment_id',
										'body',
										'article_id',
										'author',
										'votes',
										'created_at'
									);
								});
						});

						it('POST /articles/:article_id/comments - responds with a Status:400 when passed with an empty object', () => {
							return request(app).post('/api/articles/1/comments').send({}).expect(400).then(({ body }) => {
								expect(body.msg).to.be.equal('null value in column "body" violates not-null constraint');
							});
						});

						it('POST /articles/:article_id/comments - responds with a Status:400 when passed with an object not containing a body', () => {
							return request(app)
								.post('/api/articles/1/comments')
								.send({
									username: 'butter_bridge'
								})
								.expect(400)
								.then(({ body }) => {
									expect(body.msg).to.be.equal('null value in column "body" violates not-null constraint');
								});
						});

						it('POST /articles/:article_id/comments - responds with a Status:400 when passed with an object not containing a invalid username', () => {
							return request(app)
								.post('/api/articles/1/comments')
								.send({
									body: 'Some Text Here',
									username: 123
								})
								.expect(400)
								.then(({ body }) => {
									expect(body.msg).to.be.equal(
										'insert or update on table "comments" violates foreign key constraint "comments_author_foreign"'
									);
								});
						});

						it('POST /articles/:article_id/comments - responds with a Status:400 when passed with an object not containing a username', () => {
							return request(app)
								.post('/api/articles/1/comments')
								.send({
									body: 'Some Text Here'
								})
								.expect(400)
								.then(({ body }) => {
									expect(body.msg).to.be.equal('Require Username Input');
								});
						});

						it('POST /articles/:article_id/comments - responds with a Status:400 when passed with an invalid article_id', () => {
							return request(app)
								.post('/api/articles/not-an-valid-id/comments')
								.send({
									body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
									username: 'butter_bridge'
								})
								.expect(400)
								.then(({ body }) => {
									expect(body.msg).to.be.equal('invalid input syntax for integer: "not-an-valid-id"');
								});
						});

						it("POST /articles/:article_id/comments - responds with a Status:400 when passed with an article_id that isn't found", () => {
							return request(app)
								.post('/api/articles/999/comments')
								.send({
									body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
									username: 'butter_bridge'
								})
								.expect(400)
								.then(({ body }) => {
									expect(body.msg).to.be.equal(
										'insert or update on table "comments" violates foreign key constraint "comments_article_id_foreign"'
									);
								});
						});

						it('POST /articles/:article_id/comments - responds with a Status:400 when passed with addtional unwanted key-values', () => {
							return request(app)
								.post('/api/articles/1/comments')
								.send({
									body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
									username: 'butter_bridge',
									age: 28,
									gender: 'male'
								})
								.expect(400)
								.then(({ body }) => {
									expect(body.msg).to.be.equal('Bad Request');
								});
						});
					});

					describe.only('GET method', () => {
						it('GET /articles/:article_id/comments  - responds with a Status:200 and the comments data based on article id', () => {
							return request(app).get('/api/articles/1/comments ').expect(200).then(({ body }) => {
								expect(body).to.be.a('object');
								expect(body.comments[0]).to.have.keys(
									'article_id',
									'comment_id',
									'votes',
									'created_at',
									'author',
									'body'
								);
								expect(body.comments).to.be.descendingBy('created_at');
							});
						});

						it('GET /articles/:article_id/comments  - responds with a Status:200 and the comments data based on article id', () => {
							return request(app).get('/api/articles/1/comments?order=asc').expect(200).then(({ body }) => {
								expect(body.comments).to.be.ascendingBy('created_at');
							});
						});

						it('GET /articles/:article_id/comments  - responds with a Status:200 and the comments data based on article id', () => {
							return request(app).get('/api/articles/1/comments?sort_by=author').expect(200).then(({ body }) => {
								expect(body.comments).to.be.descendingBy('author');
							});
						});
					});
				});
			});
		});
	});
});

/**
 * 				it('Invalid Methods for /topics - responds with a Status:405', () => {
					const invalidMethods = [ 'patch', 'put', 'delete' ];

					invalidMethods.forEach((method) => {
						return request(app)[method]('/api/topics').expect(405).then(({ body }) => {
							expect(body.msg).to.equal('Method Not Allowed');
						});
					});
				});
 */
