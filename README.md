# Project NC News

API that fetches data from the Northcoder's News Database.
Your database will be PSQL, and you will interact with it using Knex.js

## Prerequisites

What things you need:

- `Code Editor` (We're using Visual Studio Code)
- `Node.js` (Version to Date : v12.1.0)
- `PostgreSQL`(Version to Date: v11.2)

### If you're deploying to your own server

- `Heroku`

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
const { DB_URL } = process.env;
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
  },
  production: {
    connection: `${DB_URL}?ssl=true`
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


## Deploying to your own server - Production Environment

### Hosting a PSQL DB using Heroku

There are many ways to host applications like the one you have created. One of these solutions is Heroku. 

Heroku is used to deploy, manage, and scale modern apps. The platform allows for a flexible, and easy to use approach, offering developers the simplest path to getting their apps to market.

Heroku provides a service that you can push your code to and it will build, run and host it. 

Heroku also allows for easy database integration. Their [documentation](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
 is excellent, so take a look at that. This document is essentially a more condensed, specific version of the steps described in the Heroku docs.

 ## Step 1 - Install the Heroku CLI

 On MacOS: 

 ```bash
brew tap heroku/brew && brew install heroku
 ```

or on Ubuntu

```bash
sudo snap install --classic heroku
```

## Step 2 - Create a Heroku App

Log into Heroku using their command line interface:

```bash
heroku login
```
Create an app in an active git directory. Doing this in the folder where your server is located at is a good start, as this is what you will be hosting.

```bash
heroku create <your-app-name>
```

`your-app-name` should be the name you want to give your application (`The name could be taken by someone else`). If you don't specify an app name, you'll get a random one which is automatically generated by `HEROKU`.

You will want to check your `remote` to your git repository.

```bash
git remote -v
```


### Step 3 - Push Your code up to Heroku

```bash
git push heroku master
```

### Step 4 - Creating a Hosted Database
Go to the heroku site and log in.

- Select your application
- Click on the `Configure Add-ons`
- Choose `Heroku Postgres`

The free tier will be adequate for our purposes. This will provide you with a postgreSQL pre-created database!

Check that the database exists.

```bash
heroku config
=== project-nc-news Config Vars
DATABASE_URL: <Your Database URL>
```

### Step 5 - Seeding the Production Database

Once you have your created your database on `HEROKU`

You will want to run the seed prod script from your `package.json`:
```bash
npm run seed:prod
```

### Step 6 - Review Your App

```bash
heroku open
```

Any issues should be debugged with:

```bash
heroku logs --tail
```

## Authors

* **Andrew Chung** - *Initial work* - [Andrew Chung](https://github.com/manloeng/nc-news)



