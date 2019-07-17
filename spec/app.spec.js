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
		it('GET /api - responds with a Status:200 and a JSON describing all the available endpoints on your API', () => {
			return request(app).get('/api').expect(200).then(({ body }) => {
				expect(body).to.be.a('object');
				expect(body).to.contain.key('routes');
			});
		});

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

		describe('/api/articles', () => {
			describe('Http methods', () => {
				describe('GET method', () => {
					it('GET /articles - responds with a Status:200 and the list of articles', () => {
						return request(app).get('/api/articles').expect(200).then(({ body }) => {
							expect(body).to.be.a('object');
							expect(body.articles[0]).to.have.keys(
								'article_id',
								'title',
								'topic',
								'author',
								'votes',
								'created_at',
								'comment_count'
							);
						});
					});

					it('GET /articles - responds with a Status:200 and the list of articles sorted by a default of "created_at" in descending order', () => {
						return request(app).get('/api/articles').expect(200).then(({ body }) => {
							expect(body.articles).to.be.descendingBy('created_at');
						});
					});

					it('GET /articles - responds with a Status:200 and the list of articles sorted by "created_at" in ascending order', () => {
						return request(app).get('/api/articles?order=asc').expect(200).then(({ body }) => {
							expect(body.articles).to.be.ascendingBy('created_at');
						});
					});

					it('GET /articles - responds with a Status:200 and the list of articles sorted by "author" in descending order', () => {
						return request(app).get('/api/articles?sort_by=author').expect(200).then(({ body }) => {
							expect(body.articles).to.be.descendingBy('author');
						});
					});

					it('GET /articles - responds with a Status:200 and the list of articles sorted by "author" in ascending order', () => {
						return request(app).get('/api/articles?sort_by=author&order=asc').expect(200).then(({ body }) => {
							expect(body.articles).to.be.ascendingBy('author');
						});
					});

					it('GET /articles - responds with a Status:200 and the list of articles filtered by "author"', () => {
						return request(app).get('/api/articles?author=butter_bridge').expect(200).then(({ body }) => {
							expect(body.articles).to.be.descendingBy('created_at');
							expect(body.articles).to.have.lengthOf(3);
						});
					});

					it('GET /articles - responds with a Status:200 and an empty object of "author" data', () => {
						return request(app).get('/api/articles?author=andrew').expect(200).then(({ body }) => {
							expect(body.articles).to.be.eql([]);
						});
					});

					it('GET /articles - responds with a Status:200 and the list of articles filtered by "topic"', () => {
						return request(app).get('/api/articles?topic=mitch').expect(200).then(({ body }) => {
							expect(body.articles).to.be.descendingBy('created_at');
						});
					});

					it('GET /articles - responds with a Status:200 and an empty object of "topic" data', () => {
						return request(app).get('/api/articles?topic=andrew').expect(200).then(({ body }) => {
							expect(body.articles).to.be.eql([]);
						});
					});

					it('GET /articles - responds with a Status:400 and the list of articles filtered by "author"', () => {
						return request(app).get('/api/articles?author=123').expect(400).then(({ body }) => {
							expect(body.msg).to.be.equal('Bad Request');
						});
					});

					it('GET /articles - responds with a Status:400 and the list of articles filtered by "topic"', () => {
						return request(app).get('/api/articles?topic=123').expect(400).then(({ body }) => {
							expect(body.msg).to.be.equal('Bad Request');
						});
					});

					it('GET /articles - responds with a Status:400 when passed with a invalid query', () => {
						return request(app).get('/api/articles?sorting=author').expect(400).then(({ body }) => {
							expect(body.msg).to.be.equal('Bad Request');
						});
					});

					it('GET /articles - responds with a Status:400 when passed with a invalid sort_by - query value', () => {
						return request(app).get('/api/articles?sort_by=shape').expect(400).then(({ body }) => {
							expect(body.msg).to.be.equal('order by "shape" desc - column "shape" does not exist');
						});
					});

					it('GET /articles - responds with a Status:400 when passed with a invalid order - query value', () => {
						return request(app).get('/api/articles?order=shape').expect(400).then(({ body }) => {
							expect(body.msg).to.be.equal('Bad Request');
						});
					});

					it('GET /articles - responds with a Status:400 when passed with a valid sort_by query and a invalid order query', () => {
						return request(app).get('/api/articles?sort_by=author&order=shape').expect(400).then(({ body }) => {
							expect(body.msg).to.be.equal('Bad Request');
						});
					});

					it('GET /articles - responds with a Status:400 when passed with a valid order query and a invalid sort_by query', () => {
						return request(app).get('/api/articles?sort_by=shape&order=asc').expect(400).then(({ body }) => {
							expect(body.msg).to.be.equal('order by "shape" asc - column "shape" does not exist');
						});
					});

					it('GET /articles - responds with a Status:400 when passed with a valid order query and a invalid query key', () => {
						return request(app).get('/api/articles?sorting=author&order=asc').expect(400).then(({ body }) => {
							expect(body.msg).to.be.equal('Bad Request');
						});
					});

					it('GET /articles - responds with a Status:400 when passed with a valid sort_by query and a invalid query key', () => {
						return request(app).get('/api/articles?sort_by=author&order_by=asc').expect(400).then(({ body }) => {
							expect(body.msg).to.be.equal('Bad Request');
						});
					});
				});

				it('Invalid Methods for /topics - responds with a Status:405', () => {
					const invalidMethods = [ 'patch', 'post', 'put', 'delete' ];

					invalidMethods.forEach((method) => {
						return request(app)[method]('/api/articles').expect(405).then(({ body }) => {
							expect(body.msg).to.equal('Method Not Allowed');
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
								expect(body).to.be.a('object');
								expect(body.article.votes).to.be.equal(205);
								expect(body.article).to.have.keys(
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
										expect(body.msg).to.be.equal('null value in column "author" violates not-null constraint');
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

						describe('GET method', () => {
							it('GET /articles/:article_id/comments  - responds with a Status:200 and the comments data based on article id and is sorted by "created_at" in descending order', () => {
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

							it('GET /articles/:article_id/comments  - responds with a Status:200 and the comments data based on article id and is sorted by "created_at" in ascending order', () => {
								return request(app).get('/api/articles/1/comments?order=asc').expect(200).then(({ body }) => {
									expect(body.comments).to.be.ascendingBy('created_at');
								});
							});

							it('GET /articles/:article_id/comments  - responds with a Status:200 and the comments data based on article id and is sorted by "author" in descending order', () => {
								return request(app).get('/api/articles/1/comments?sort_by=author').expect(200).then(({ body }) => {
									expect(body.comments).to.be.descendingBy('author');
								});
							});

							it('GET /articles/:article_id/comments  - responds with a Status:200 and the comments data based on article id and is sorted by "author" in ascending order', () => {
								return request(app)
									.get('/api/articles/1/comments?sort_by=author&order=asc')
									.expect(200)
									.then(({ body }) => {
										expect(body.comments).to.be.ascendingBy('author');
									});
							});

							it('GET /articles/:article_id/comments  - responds with a Status:400 when passed with an invalid query', () => {
								return request(app).get('/api/articles/1/comments?sorting=author').expect(400).then(({ body }) => {
									expect(body.msg).to.equal('Invalid query');
								});
							});

							it('GET /articles/:article_id/comments  - responds with a Status:400 when passed with an invalid sort_by query', () => {
								return request(app).get('/api/articles/1/comments?sort_by=shape').expect(400).then(({ body }) => {
									expect(body.msg).to.equal('order by "shape" desc - column "shape" does not exist');
								});
							});

							it('GET /articles/:article_id/comments  - responds with a Status:400 when passed with an invalid order query', () => {
								return request(app).get('/api/articles/1/comments?order=shape').expect(400).then(({ body }) => {
									expect(body.msg).to.equal('Invalid query');
								});
							});

							it('GET /articles/:article_id/comments  - responds with a Status:400 when passed with an invalid article_id', () => {
								return request(app).get('/api/articles/not-a-valid-id/comments').expect(400).then(({ body }) => {
									expect(body.msg).to.equal('invalid input syntax for integer: "not-a-valid-id"');
								});
							});

							it('GET /articles/:article_id/comments  - responds with a Status:404 when passed with a article_id thats not found', () => {
								return request(app).get('/api/articles/999/comments').expect(404).then(({ body }) => {
									expect(body.msg).to.equal('Article ID Not Found');
								});
							});
						});

						it('Invalid Methods for /articles/:article_id/comments - responds with a Status:405', () => {
							const invalidMethods = [ 'patch', 'put', 'delete' ];

							invalidMethods.forEach((method) => {
								return request(app)[method]('/api/articles/1/comments').expect(405).then(({ body }) => {
									expect(body.msg).to.equal('Method Not Allowed');
								});
							});
						});
					});
				});
			});
		});

		describe('/api/comments/:comment_id', () => {
			describe('Http methods', () => {
				describe('PATCH method', () => {
					it('PATCH /comments/:comment_id - responds with a Status:200 and the comment data', () => {
						return request(app).patch('/api/comments/1').send({ inc_votes: 1 }).expect(200).then(({ body }) => {
							expect(body).to.be.a('object');
							expect(body.comment).to.have.keys('article_id', 'comment_id', 'votes', 'created_at', 'author', 'body');
						});
					});

					it('PATCH /comments/:comment_id - responds with a Status:200 and the comment data', () => {
						return request(app).patch('/api/comments/1').send({ inc_votes: -100 }).expect(200).then(({ body }) => {
							expect(body.comment.votes).to.equal(-84);
						});
					});

					it('PATCH /comments/:comment_id - responds with a Status:200 when passed with an empty Object', () => {
						return request(app).patch('/api/comments/1').send({}).expect(200).then(({ body }) => {
							expect(body.comment.comment_id).to.equal(1);
						});
					});

					it('PATCH /comments/:comment_id - responds with a Status:400 when passed with an invalid update key but a valid value', () => {
						return request(app).patch('/api/comments/1').send({ increase_votes: -100 }).expect(400).then(({ body }) => {
							expect(body.msg).to.equal('Bad Request');
						});
					});
					it('PATCH /comments/:comment_id - responds with a Status:400 when passed with an valid update key-value pair and an invalid key-value pair', () => {
						return request(app)
							.patch('/api/comments/1')
							.send({ inc_votes: -100, increase_votes: -100 })
							.expect(400)
							.then(({ body }) => {
								expect(body.msg).to.equal('Bad Request');
							});
					});

					it('PATCH /comments/:comment_id - responds with a Status:400 when passed with anvalid key but invalid update value', () => {
						return request(app)
							.patch('/api/comments/1')
							.send({ inc_votes: 'not-a-value' })
							.expect(400)
							.then(({ body }) => {
								expect(body.msg).to.equal('invalid input syntax for integer: "NaN"');
							});
					});

					it('PATCH /comments/:comment_id - responds with a Status:400 when passed with an invalid comment_id', () => {
						return request(app)
							.patch('/api/comments/not-an-valid-id')
							.send({ inc_votes: 1 })
							.expect(400)
							.then(({ body }) => {
								expect(body.msg).to.equal('invalid input syntax for integer: "not-an-valid-id"');
							});
					});

					it("PATCH /comments/:comment_id - responds with a Status:404 when passed with an comment_id that isn't found", () => {
						return request(app).patch('/api/comments/999').send({ inc_votes: 1 }).expect(404).then(({ body }) => {
							expect(body.msg).to.equal('Comment ID Not Found');
						});
					});
				});

				describe('DELETE method', () => {
					it('DELETE /comments/:comment_id - responds with a Status:204', () => {
						return request(app).delete('/api/comments/1').expect(204);
					});

					it('DELETE /comments/:comment_id - responds with a Status:400', () => {
						return request(app).delete('/api/comments/not-a-valid-id').expect(400).then(({ body }) => {
							expect(body.msg).to.equal('invalid input syntax for integer: "not-a-valid-id"');
						});
					});

					it('DELETE /comments/:comment_id - responds with a Status:404', () => {
						return request(app).delete('/api/comments/999').expect(404).then(({ body }) => {
							expect(body.msg).to.equal('Comment ID Not Found');
						});
					});
				});

				it('Invalid Methods for /topics - responds with a Status:405', () => {
					const invalidMethods = [ 'get', 'post', 'put' ];

					invalidMethods.forEach((method) => {
						return request(app)[method]('/api/comments/:comment_id').expect(405).then(({ body }) => {
							expect(body.msg).to.equal('Method Not Allowed');
						});
					});
				});
			});
		});
	});
});
