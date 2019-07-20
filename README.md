# Project NC News

API that fetches data from the Northcoder's News Database.
Your database will be PSQL, and you will interact with it using Knex.js

Currently the project is hosted on https://project-nc-news.herokuapp.com/api

## Prerequisites

What things you need:

- `Code Editor` (We're using Visual Studio Code)
- `Node.js` (Version to Date : v12.1.0)
- `PostgreSQL`(Version to Date: v11.2)


## Step 1 - Setting up your own repository

`Fork` this repo on:

```bash
https://github.com/manloeng/nc-news

```
and then `Clone` the repo:

```bash
git clone https://github.com/manloeng/nc-news

cd nc-news
```
Once you have cloned the repo, you should have the repo on your system.

You will need to install the required modules to run the api successfully.

## Step 2 - Installing

On your terminal you will want to run:
```bash
npm install
```
This will install all the modules that are listed in the `package.json`

## Step 3 - Creating knexfile.js

In this repo we have not provided you with the `knexfile.js` Make sure to add it to the to your repository before starting.

If you are on `linux` insert your postgres username and password into the `knexfile.js` file.

An example of `knexfile.js`:

```bash
const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations',
    //username : your username, (for linux users only)
    //password : your password  (for linux users only)
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news'
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };

```

## Step 4 - Running on an Environment  

### Running the tests - On the 'test' Environment

Once you have the modules installed, and the `knexfile.js` you can run the `end-to-end` `test` on the terminal with : 

```bash
npm run setup-dbs
npm test
```
This will run the test with the installed modules of `Mocha` and `Chai`.

### Running On the 'development' Environment

If you want to run the `API` on the 'development environment, you will want to run the following commands on the terminal:

```bash
npm run setup-dbs
npm run migrate-latest
npm run seed

```

`npm run setup-dbs` will set up the databases on `PSQL`.

`npm run migrate-latest` will setup the 'development' tables (nc_news) on `PSQL`.

`npm run seed` will insert data into the 'development' tables (nc_news) on `PSQL`.

Once you have `seeded` your tables you can run:

```bash
npm run start
```

`npm run start` will start up the server on its default `PORT` of `9090`

you should see this message on your terminal, Ex:

```bash
> node listen.js

server is listening on port: 9090
```
You can go over to: 
`http://localhost:9090/api`

to see your server running from your local computer.

If you want to stop the server, you will need to hit `Ctrl+C` on the terminal.

### Understanding the endpoints

To navigate sucessfully around the `API`, you can look into the JSON of `http://localhost:9090/api` which will provide you with the routes of all the endpoints available to you.

Ex: 

```bash
"GET /api/articles": {
  "description": "serves an array of all topics",
  "queries": [ "author", "topic", "sort_by", "order" ],
  "exampleResponse": {
    "articles": [
    {
    "title": "Seafood substitutions are increasing",
    "topic": "cooking",
    "author": "weegembump",
    "body": "Text from the article..",
    "created_at": 1527695953341
    }
    ]
  }
},
```

The example:

- Shows the `HTTP method` used on the endpoint in this case it's `GET `
- Shows the `route` that the `HTTP method` is applied to in this case it's `http://localhost:9090/api/articles`

The document also supplies you with a:
- list of extras including a `description` on what you can expect from the endpoints
- queries that could be added to the endpoint. Ex: `http://localhost:9090/api/articles?sort_by=author`
- example of what you will see at the endpoint


## Authors

* **Andrew Chung** - *Initial work* - [Andrew Chung](https://github.com/manloeng/nc-news)



