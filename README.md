# Northcoders News API

## Notes on env files:

Developer must add an <code>.env.development</code> (PGDATABASE=nc_news) file and a <code>.env.test</code> file (PGDATABASE=nc_news_test) to BE-NC-NEWS folder in order to successfully connect to the two databases locally.

## What version of (Node.js) and (Postgresql) is required?

-for (Postgresql) ^8.7.3 or above.
-for (Node.js) V17.4.0 or above

## What Is This Api About?

-this Api Is for Articles and Comments for Those Articles. It uses RESTful Services (GET, PATCH, POST, DELETE)

## What Is the Link to the Api?

https://jibinandshwey.herokuapp.com/api/

## What Endpoints are available?

GET /api
GET /api/topics
GET /api/articles
GET /api/articles/:article_id
GET /api/users
GET /api/users/:username
GET /api/articles/:article_id/comments
PATCH /api/articles/:article_id
POST /api/articles
POST /api/articles/:article_id/comments
PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

## How to Clone this backend Repo From Github?

1- Copy This Link : https://github.com/squarezy/backend-project

2- In the Terminal use this command to clone it locally to the directory of your choice:
<code>git clone https://github.com/squarezy/backend-project</code>

3- After cloning successfully - Use this command to open Project:
<code>code backend-project/</code>

## What to do after cloning?

1- Run this command in the terminal to install all required packages:
(npm i)

2- Create two (.env) Files:

The first is <code>.env.development</code> and inside it write the following code: <code>Pgdatabase=nc_news</code>

The second is <code>.env.development</code> and inside it write the following code: <code>Pgdatabase=nc_news_test</code>

3- Run the following command in the terminal to establish a connection to (Postgresql):

<code>sudo service postgresql start</code>

4- Run the following command in the terminal <code>npm run setup-dbs</code>

5- Run the following command in the terminal to test the app
<code>npm t app.test.js</code>

6- If you wanted to run the app in your local host:

Inside the <code>listen.js</code> file:

Replace line 3 with this <code> const {port=9090} = process.env; </code>

Then to run the server, run this command <code>npm start</code>

7- In your browser set the url to: ( http://localhost:9090/ )

8- Add any of the available points after the ('/')

## Thank you!
