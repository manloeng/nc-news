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
		return request(app).get('/not-a-route').expect(404).then(({ body: { msg } }) => {
			expect(msg).to.equal('Page Not Found');
		});
	});

	describe('/api', () => {
		it('GET /api - responds with a Status:200 and a JSON describing all the available endpoints on your API', () => {
			return request(app).get('/api').expect(200).then(({ body }) => {
				expect(body).to.be.a('object');
				expect(body).to.contain.key('routes');
			});
		});

		it('Invalid Methods for /api - responds with a Status:405', () => {
			const invalidMethods = [ 'post', 'patch', 'put', 'delete' ];

			invalidMethods.forEach((method) => {
				return request(app)[method]('/api').expect(405).then(({ body: { msg } }) => {
					expect(msg).to.equal('Method Not Allowed');
				});
			});
		});

		describe('/api/topics', () => {
			describe('GET method', () => {
				it('GET /topics - responds with a Status:200 and the list of the topics data', () => {
					return request(app).get('/api/topics').expect(200).then(({ body: { topics } }) => {
						expect(topics[0]).to.have.keys('slug', 'description');
						expect(topics).to.have.lengthOf(3);
					});
				});
			});

			it('Invalid Methods for /topics - responds with a Status:405', () => {
				const invalidMethods = [ 'patch', 'put', 'post', 'delete' ];

				invalidMethods.forEach((method) => {
					return request(app)[method]('/api/topics').expect(405).then(({ body: { msg } }) => {
						expect(msg).to.equal('Method Not Allowed');
					});
				});
			});
		});

		describe('/api/users/:username', () => {
			describe('GET method', () => {
				it('GET /users/:username - responds with a Status:200 and the users data', () => {
					return request(app).get('/api/users/butter_bridge').expect(200).then(({ body: { user } }) => {
						expect(user).to.have.keys('username', 'name', 'avatar_url');
						expect(user.username).to.equal('butter_bridge');
					});
				});

				it('GET /users/:username - responds with a Status:400 when passed with an invalid username', () => {
					return request(app).get('/api/users/999').expect(400).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('Require a Valid Query');
					});
				});

				it("GET /users/:username - responds with a Status:404 when passed with an username that isn't found", () => {
					return request(app).get('/api/users/Andrew').expect(404).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('User Not Found');
					});
				});
			});

			it('Invalid Methods for /users/:username - responds with a Status:405', () => {
				const invalidMethods = [ 'patch', 'put', 'post', 'delete' ];

				invalidMethods.forEach((method) => {
					return request(app)[method]('/api/users/butter_bridge').expect(405).then(({ body: { msg } }) => {
						expect(msg).to.equal('Method Not Allowed');
					});
				});
			});
		});

		describe('/api/articles', () => {
			describe('GET method', () => {
				it('GET /articles - responds with a Status:200 and the list of articles which is limited to 10', () => {
					return request(app).get('/api/articles').expect(200).then(({ body }) => {
						expect(body.articles[0]).to.have.keys(
							'article_id',
							'title',
							'topic',
							'author',
							'votes',
							'created_at',
							'comment_count'
						);
						expect(body.articles).to.have.lengthOf(10);
						expect(body).to.have.key('articles', 'total_count');
						expect(body.total_count).to.equal(12);
					});
				});

				it('GET /articles - responds with a Status:200 and the list of articles sorted by a default of "created_at" in descending order', () => {
					return request(app).get('/api/articles').expect(200).then(({ body: { articles } }) => {
						expect(articles).to.be.descendingBy('created_at');
					});
				});

				it('GET /articles - responds with a Status:200 and the list of articles sorted by "created_at" in ascending order', () => {
					return request(app).get('/api/articles?order=asc').expect(200).then(({ body: { articles } }) => {
						expect(articles).to.be.ascendingBy('created_at');
					});
				});

				it('GET /articles - responds with a Status:200 and the list of articles sorted by "author" in descending order', () => {
					return request(app).get('/api/articles?sort_by=author').expect(200).then(({ body: { articles } }) => {
						expect(articles).to.be.descendingBy('author');
					});
				});

				it('GET /articles - responds with a Status:200 and the list of articles sorted by "author" in ascending order', () => {
					return request(app)
						.get('/api/articles?sort_by=author&order=asc')
						.expect(200)
						.then(({ body: { articles } }) => {
							expect(articles).to.be.ascendingBy('author');
						});
				});

				it('GET /articles - responds with a Status:200 and the list of articles filtered by "author"', () => {
					return request(app).get('/api/articles?author=butter_bridge').expect(200).then(({ body: { articles } }) => {
						expect(articles).to.be.descendingBy('created_at');
						expect(articles).to.have.lengthOf(3);
					});
				});

				it('GET /articles - responds with a Status:404 and an empty object of "author" data', () => {
					return request(app).get('/api/articles?author=andrew').expect(404).then(({ body: { msg } }) => {
						expect(msg).to.be.eql('Data Not Found');
					});
				});

				it('GET /articles - responds with a Status:200 and the list of articles filtered by "topic"', () => {
					return request(app).get('/api/articles?topic=mitch').expect(200).then(({ body: { articles } }) => {
						expect(articles).to.be.descendingBy('created_at');
					});
				});

				it('GET /articles - responds with a Status:404 when the "topic" data isn\'t found', () => {
					return request(app).get('/api/articles?topic=andrew').expect(404).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('Data Not Found');
					});
				});

				it('GET /articles - responds with a Status:400 and the list of articles filtered by "author"', () => {
					return request(app).get('/api/articles?author=123').expect(400).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('Require a Valid Query');
					});
				});

				it('GET /articles - responds with a Status:400 and the list of articles filtered by "topic"', () => {
					return request(app).get('/api/articles?topic=123').expect(400).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('Require a Valid Query');
					});
				});

				it('GET /articles - responds with a Status:400 when passed with a invalid query', () => {
					return request(app).get('/api/articles?sorting=author').expect(400).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('Require a Valid Query');
					});
				});

				it('GET /articles - responds with a Status:400 when passed with a invalid sort_by - query value', () => {
					return request(app).get('/api/articles?sort_by=shape').expect(400).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('order by "shape" desc limit $1 - column "shape" does not exist');
					});
				});

				it('GET /articles - responds with a Status:400 when passed with a invalid order - query value', () => {
					return request(app).get('/api/articles?order=shape').expect(400).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('Require a Valid Query');
					});
				});

				it('GET /articles - responds with a Status:400 when passed with a valid sort_by query and a invalid order query', () => {
					return request(app).get('/api/articles?sort_by=author&order=shape').expect(400).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('Require a Valid Query');
					});
				});

				it('GET /articles - responds with a Status:400 when passed with a valid order query and a invalid sort_by query', () => {
					return request(app).get('/api/articles?sort_by=shape&order=asc').expect(400).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('order by "shape" asc limit $1 - column "shape" does not exist');
					});
				});

				it('GET /articles - responds with a Status:400 when passed with a valid order query and a invalid query key', () => {
					return request(app).get('/api/articles?sorting=author&order=asc').expect(400).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('Require a Valid Query');
					});
				});

				it('GET /articles - responds with a Status:400 when passed with a valid sort_by query and a invalid query key', () => {
					return request(app).get('/api/articles?sort_by=author&order_by=asc').expect(400).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('Require a Valid Query');
					});
				});

				// it('GET /articles - responds with a Status:400 when passed with a valid sort_by query and a invalid query key', () => {
				// 	return request(app).get('/api/articles?sort_by=author&order_by=asc').expect(400).then(({ body: { msg } }) => {
				// 		expect(msg).to.be.equal('Require a Valid Query');
				// 	});
				// });
			});

			describe('POST method', () => {
				it('POST /articles/:article_id/comments - responds with a Status:201 and the newly created comment', () => {
					return request(app)
						.post('/api/articles')
						.send({
							title: "Andrew's First article post",
							body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
							username: 'butter_bridge',
							topic: 'cats'
						})
						.expect(201)
						.then(({ body: { article } }) => {
							expect(article).to.have.all.keys('article_id', 'title', 'topic', 'author', 'votes', 'body', 'created_at');
							expect(article.title).to.equal("Andrew's First article post");
							expect(article.article_id).to.equal(13);
						});
				});

				it('POST /articles/:article_id/comments - responds with a Status:400 when passed with an object just containing title key', () => {
					return request(app)
						.post('/api/articles')
						.send({ title: "Andrew's First article post" })
						.expect(400)
						.then(({ body: { msg } }) => {
							expect(msg).to.be.equal('null value in column "topic" violates not-null constraint');
						});
				});

				it('POST /articles/:article_id/comments - responds with a Status:400 when passed with an object containing the title key and topic key', () => {
					return request(app)
						.post('/api/articles')
						.send({ title: "Andrew's First article post", topic: 'cats' })
						.expect(400)
						.then(({ body: { msg } }) => {
							expect(msg).to.be.equal('null value in column "author" violates not-null constraint');
						});
				});

				it('POST /articles/:article_id/comments - responds with a Status:201 when passed with an object containing the title, topic and username key with an invalid title value', () => {
					return request(app)
						.post('/api/articles')
						.send({ title: 123, topic: 'cats', username: 'butter_bridge' })
						.expect(201)
						.then(({ body: { article } }) => {
							expect(article.title).to.be.equal('123');
						});
				});

				it('POST /articles/:article_id/comments - responds with a Status:201 when passed with an object containing the title, topic and username key', () => {
					return request(app)
						.post('/api/articles')
						.send({ title: 123, topic: 'cats', username: 'butter_bridge' })
						.expect(201)
						.then(({ body: { article } }) => {
							expect(article.title).to.be.equal('123');
						});
				});

				it("POST /articles/:article_id/comments - responds with a Status:404 when passed with an object containing the title, topic and username key with an invalid topic value that isn't found", () => {
					return request(app)
						.post('/api/articles')
						.send({ title: 'Something new', topic: 12345, username: 'butter_bridge' })
						.expect(404)
						.then(({ body: { msg } }) => {
							expect(msg).to.be.equal('Key (topic)=(12345) is not present in table');
						});
				});

				it("POST /articles/:article_id/comments - responds with a Status:404 when passed with an object containing the title, topic and username key with an username value that isn't found", () => {
					return request(app)
						.post('/api/articles')
						.send({ title: 'Something new', topic: 'cats', username: 'andrew' })
						.expect(404)
						.then(({ body: { msg } }) => {
							expect(msg).to.be.equal('Key (author)=(andrew) is not present in table');
						});
				});

				it('POST /articles/:article_id/comments - responds with a Status:400 when passed with an object containing other additional keys', () => {
					return request(app)
						.post('/api/articles')
						.send({ title: 'Something new', topic: 'cats', username: 'andrew', invalidKey: 'invalidValue' })
						.expect(400)
						.then(({ body: { msg } }) => {
							expect(msg).to.be.equal('Require a Valid Query');
						});
				});

				it('POST /articles/:article_id/comments - responds with a Status:400 when passed with an empty object', () => {
					return request(app).post('/api/articles').send({}).expect(400).then(({ body: { msg } }) => {
						expect(msg).to.be.equal('null value in column "title" violates not-null constraint');
					});
				});
			});

			it('Invalid Methods for /topics - responds with a Status:405', () => {
				const invalidMethods = [ 'patch', 'put', 'delete' ];

				invalidMethods.forEach((method) => {
					return request(app)[method]('/api/articles').expect(405).then(({ body: { msg } }) => {
						expect(msg).to.equal('Method Not Allowed');
					});
				});
			});

			describe('/api/articles/:article_id', () => {
				describe('GET method', () => {
					it('GET /articles/:article_id - responds with a Status:200 and the article data', () => {
						return request(app).get('/api/articles/1').expect(200).then(({ body: { article } }) => {
							expect(article).to.have.keys(
								'article_id',
								'title',
								'topic',
								'author',
								'body',
								'votes',
								'created_at',
								'comment_count'
							);
							expect(article.article_id).to.equal(1);
						});
					});

					it('GET /articles/:article_id - responds with a Status:400 when passed with an invalid article_id', () => {
						return request(app).get('/api/articles/not-a-valid-id').expect(400).then(({ body: { msg } }) => {
							expect(msg).to.be.equal('invalid input syntax for integer: "not-a-valid-id"');
						});
					});

					it("GET /articles/:article_id - responds with a Status:404 when passed with an article_id that isn't found", () => {
						return request(app).get('/api/articles/9999').expect(404).then(({ body: { msg } }) => {
							expect(msg).to.be.equal('Article ID Not Found');
						});
					});
				});

				describe('PATCH method', () => {
					it('PATCH /articles/:article_id - responds with a Status:200 and the updated article vote data', () => {
						return request(app)
							.patch('/api/articles/1')
							.send({ inc_votes: 105 })
							.expect(200)
							.then(({ body: { article } }) => {
								expect(article.votes).to.be.equal(205);
								expect(article).to.have.keys('article_id', 'title', 'topic', 'author', 'body', 'votes', 'created_at');
							});
					});

					it('PATCH /articles/:article_id - responds with a Status:200 and the updated article vote data', () => {
						return request(app)
							.patch('/api/articles/1')
							.send({ inc_votes: -101 })
							.expect(200)
							.then(({ body: { article } }) => {
								expect(article.votes).to.be.equal(-1);
							});
					});

					it('PATCH /articles/:article_id - responds with a Status:200 when passed with an empty object', () => {
						return request(app).patch('/api/articles/1').send({}).expect(200).then(({ body: { article } }) => {
							expect(article.article_id).to.be.equal(1);
							expect(article.votes).to.be.equal(100);
						});
					});

					it('PATCH /articles/:article_id - responds with a Status:400 when passed with an invalid article_id', () => {
						return request(app)
							.patch('/api/articles/not-a-valid-id')
							.send({ inc_votes: -101 })
							.expect(400)
							.then(({ body: { msg } }) => {
								expect(msg).to.be.equal('invalid input syntax for integer: "not-a-valid-id"');
							});
					});

					it('PATCH /articles/:article_id - responds with a Status:400 when passed with an invalid update key but a valid value', () => {
						return request(app)
							.patch('/api/articles/1')
							.send({ 'not-a-valid-key': 100 })
							.expect(400)
							.then(({ body: { msg } }) => {
								expect(msg).to.be.equal('Require a Valid Query');
							});
					});

					it('PATCH /articles/:article_id - responds with a Status:400 when passed with an valid key but invalid update value', () => {
						return request(app)
							.patch('/api/articles/1')
							.send({ inc_votes: 'not-a-valid-value' })
							.expect(400)
							.then(({ body: { msg } }) => {
								expect(msg).to.be.equal('invalid input syntax for integer: "NaN"');
							});
					});

					it('PATCH /articles/:article_id - responds with a Status:400 when passed with an valid update key-value pair and an invalid key-value pair', () => {
						return request(app)
							.patch('/api/articles/1')
							.send({ inc_votes: 100, 999: 100 })
							.expect(400)
							.then(({ body: { msg } }) => {
								expect(msg).to.be.equal('Require a Valid Query');
							});
					});

					it("PATCH /articles/:article_id - responds with a Status:404 when passed with an article_id that isn't found", () => {
						return request(app)
							.patch('/api/articles/999')
							.send({ inc_votes: -101 })
							.expect(404)
							.then(({ body: { msg } }) => {
								expect(msg).to.be.equal('Article ID Not Found');
							});
					});
				});

				describe('DELETE method', () => {
					it('DELETE /articles/:article_id - responds with a Status:204', () => {
						return request(app).delete('/api/articles/2').expect(204);
					});

					it('DELETE /articles/:article_id - responds with a Status:400', () => {
						return request(app).delete('/api/articles/not-a-valid-id').expect(400).then(({ body: { msg } }) => {
							expect(msg).to.equal('invalid input syntax for integer: "not-a-valid-id"');
						});
					});

					it('DELETE /articles/:article_id - responds with a Status:404', () => {
						return request(app).delete('/api/articles/999').expect(404).then(({ body: { msg } }) => {
							expect(msg).to.equal('Article ID Not Found');
						});
					});
				});

				it('Invalid Methods for /articles/:article_id - responds with a Status:405', () => {
					const invalidMethods = [ 'put', 'post' ];

					invalidMethods.forEach((method) => {
						return request(app)[method]('/api/articles/1').expect(405).then(({ body: { msg } }) => {
							expect(msg).to.equal('Method Not Allowed');
						});
					});
				});

				describe('/api/articles/:article_id/comments', () => {
					describe('POST method', () => {
						it('POST /articles/:article_id/comments - responds with a Status:201 and the newly created comment', () => {
							return request(app)
								.post('/api/articles/1/comments')
								.send({
									body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
									username: 'butter_bridge'
								})
								.expect(201)
								.then(({ body: { comment } }) => {
									expect(comment).to.have.keys('comment_id', 'body', 'article_id', 'author', 'votes', 'created_at');
									expect(comment.article_id).to.equal(1);
								});
						});

						it('POST /articles/:article_id/comments - responds with a Status:400 when passed with an empty object', () => {
							return request(app).post('/api/articles/1/comments').send({}).expect(400).then(({ body: { msg } }) => {
								expect(msg).to.be.equal('null value in column "body" violates not-null constraint');
							});
						});

						it('POST /articles/:article_id/comments - responds with a Status:400 when passed with an object not containing a body', () => {
							return request(app)
								.post('/api/articles/1/comments')
								.send({
									username: 'butter_bridge'
								})
								.expect(400)
								.then(({ body: { msg } }) => {
									expect(msg).to.be.equal('null value in column "body" violates not-null constraint');
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
								.then(({ body: { msg } }) => {
									expect(msg).to.be.equal('Bad Request');
								});
						});

						it('POST /articles/:article_id/comments - responds with a Status:400 when passed with an object not containing a username', () => {
							return request(app)
								.post('/api/articles/1/comments')
								.send({
									body: 'Some Text Here'
								})
								.expect(400)
								.then(({ body: { msg } }) => {
									expect(msg).to.be.equal('null value in column "author" violates not-null constraint');
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
								.then(({ body: { msg } }) => {
									expect(msg).to.be.equal('invalid input syntax for integer: "not-an-valid-id"');
								});
						});

						it("POST /articles/:article_id/comments - responds with a Status:404 when passed with an article_id that isn't found", () => {
							return request(app)
								.post('/api/articles/999/comments')
								.send({
									body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
									username: 'butter_bridge'
								})
								.expect(404)
								.then(({ body: { msg } }) => {
									expect(msg).to.be.equal('Key (article_id)=(999) is not present in table');
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
								.then(({ body: { msg } }) => {
									expect(msg).to.be.equal('Bad Request');
								});
						});
					});

					describe('GET method', () => {
						it('GET /articles/:article_id/comments  - responds with a Status:200 and the comments data based on article id and is sorted by "created_at" in descending order', () => {
							return request(app).get('/api/articles/1/comments ').expect(200).then(({ body }) => {
								body.comments.forEach((comment) => {
									expect(comment.article_id).to.equal(1);
								});
								expect(body.comments[0]).to.have.keys(
									'article_id',
									'comment_id',
									'votes',
									'created_at',
									'author',
									'body'
								);
								expect(body.comments).to.be.descendingBy('created_at');
								expect(body.comments).to.have.lengthOf(10);
								expect(body).to.have.key('comments', 'total_count');
								expect(body.total_count).to.equal(13);
							});
						});

						it('GET /articles/:article_id/comments  - responds with a Status:200 and an empty obecjt', () => {
							return request(app).get('/api/articles/2/comments').expect(200).then(({ body: { comments } }) => {
								expect(comments).to.eql([]);
							});
						});

						it('GET /articles/:article_id/comments  - responds with a Status:200 and the comments data based on article id and is sorted by "created_at" in ascending order', () => {
							return request(app)
								.get('/api/articles/1/comments?order=asc')
								.expect(200)
								.then(({ body: { comments } }) => {
									expect(comments).to.be.ascendingBy('created_at');
								});
						});

						it('GET /articles/:article_id/comments  - responds with a Status:200 and the comments data based on article id and is sorted by "author" in descending order', () => {
							return request(app)
								.get('/api/articles/1/comments?sort_by=author')
								.expect(200)
								.then(({ body: { comments } }) => {
									expect(comments).to.be.descendingBy('author');
								});
						});

						it('GET /articles/:article_id/comments  - responds with a Status:200 and the comments data based on article id and is sorted by "author" in ascending order', () => {
							return request(app)
								.get('/api/articles/1/comments?sort_by=author&order=asc')
								.expect(200)
								.then(({ body: { comments } }) => {
									expect(comments).to.be.ascendingBy('author');
								});
						});

						it('GET /articles/:article_id/comments  - responds with a Status:400 when passed with an invalid query', () => {
							return request(app)
								.get('/api/articles/1/comments?sorting=author')
								.expect(400)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Require a Valid Query');
								});
						});

						it('GET /articles/:article_id/comments  - responds with a Status:400 when passed with an invalid sort_by query', () => {
							return request(app)
								.get('/api/articles/1/comments?sort_by=shape')
								.expect(400)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('order by "shape" desc limit $2 - column "shape" does not exist');
								});
						});

						it('GET /articles/:article_id/comments  - responds with a Status:400 when passed with an invalid order query', () => {
							return request(app).get('/api/articles/1/comments?order=shape').expect(400).then(({ body: { msg } }) => {
								expect(msg).to.equal('Require a Valid Query');
							});
						});

						it('GET /articles/:article_id/comments  - responds with a Status:400 when passed with an invalid article_id', () => {
							return request(app).get('/api/articles/not-a-valid-id/comments').expect(400).then(({ body: { msg } }) => {
								expect(msg).to.equal('invalid input syntax for integer: "not-a-valid-id"');
							});
						});

						it('GET /articles/:article_id/comments  - responds with a Status:404 when passed with a article_id thats not found', () => {
							return request(app).get('/api/articles/999/comments').expect(404).then(({ body: { msg } }) => {
								expect(msg).to.equal('Article ID Not Found');
							});
						});
					});

					it('Invalid Methods for /articles/:article_id/comments - responds with a Status:405', () => {
						const invalidMethods = [ 'patch', 'put', 'delete' ];

						invalidMethods.forEach((method) => {
							return request(app)[method]('/api/articles/1/comments').expect(405).then(({ body: { msg } }) => {
								expect(msg).to.equal('Method Not Allowed');
							});
						});
					});
				});
			});
		});

		describe('/api/comments/:comment_id', () => {
			describe('PATCH method', () => {
				it('PATCH /comments/:comment_id - responds with a Status:200 and the comment data', () => {
					return request(app)
						.patch('/api/comments/1')
						.send({ inc_votes: 1 })
						.expect(200)
						.then(({ body: { comment } }) => {
							expect(comment).to.have.keys('article_id', 'comment_id', 'votes', 'created_at', 'author', 'body');
						});
				});

				it('PATCH /comments/:comment_id - responds with a Status:200 and the comment data', () => {
					return request(app)
						.patch('/api/comments/1')
						.send({ inc_votes: -100 })
						.expect(200)
						.then(({ body: { comment } }) => {
							expect(comment.votes).to.equal(-84);
						});
				});

				it('PATCH /comments/:comment_id - responds with a Status:200 when passed with an empty Object', () => {
					return request(app).patch('/api/comments/1').send({}).expect(200).then(({ body: { comment } }) => {
						expect(comment.comment_id).to.equal(1);
						expect(comment.votes).to.equal(16);
					});
				});

				it('PATCH /comments/:comment_id - responds with a Status:400 when passed with an invalid update key but a valid value', () => {
					return request(app)
						.patch('/api/comments/1')
						.send({ increase_votes: -100 })
						.expect(400)
						.then(({ body: { msg } }) => {
							expect(msg).to.equal('Require a Valid Query');
						});
				});
				it('PATCH /comments/:comment_id - responds with a Status:400 when passed with an valid update key-value pair and an invalid key-value pair', () => {
					return request(app)
						.patch('/api/comments/1')
						.send({ inc_votes: -100, increase_votes: -100 })
						.expect(400)
						.then(({ body: { msg } }) => {
							expect(msg).to.equal('Require a Valid Query');
						});
				});

				it('PATCH /comments/:comment_id - responds with a Status:400 when passed with anvalid key but invalid update value', () => {
					return request(app)
						.patch('/api/comments/1')
						.send({ inc_votes: 'not-a-value' })
						.expect(400)
						.then(({ body: { msg } }) => {
							expect(msg).to.equal('invalid input syntax for integer: "NaN"');
						});
				});

				it('PATCH /comments/:comment_id - responds with a Status:400 when passed with an invalid comment_id', () => {
					return request(app)
						.patch('/api/comments/not-an-valid-id')
						.send({ inc_votes: 1 })
						.expect(400)
						.then(({ body: { msg } }) => {
							expect(msg).to.equal('invalid input syntax for integer: "not-an-valid-id"');
						});
				});

				it("PATCH /comments/:comment_id - responds with a Status:404 when passed with an comment_id that isn't found", () => {
					return request(app)
						.patch('/api/comments/999')
						.send({ inc_votes: 1 })
						.expect(404)
						.then(({ body: { msg } }) => {
							expect(msg).to.equal('Comment ID Not Found');
						});
				});
			});

			describe('DELETE method', () => {
				it('DELETE /comments/:comment_id - responds with a Status:204', () => {
					return request(app).delete('/api/comments/1').expect(204);
				});

				it('DELETE /comments/:comment_id - responds with a Status:400', () => {
					return request(app).delete('/api/comments/not-a-valid-id').expect(400).then(({ body: { msg } }) => {
						expect(msg).to.equal('invalid input syntax for integer: "not-a-valid-id"');
					});
				});

				it('DELETE /comments/:comment_id - responds with a Status:404', () => {
					return request(app).delete('/api/comments/999').expect(404).then(({ body: { msg } }) => {
						expect(msg).to.equal('Comment ID Not Found');
					});
				});
			});

			it('Invalid Methods for /topics - responds with a Status:405', () => {
				const invalidMethods = [ 'get', 'post', 'put' ];

				invalidMethods.forEach((method) => {
					return request(app)[method]('/api/comments/:comment_id').expect(405).then(({ body: { msg } }) => {
						expect(msg).to.equal('Method Not Allowed');
					});
				});
			});
		});
	});
});
