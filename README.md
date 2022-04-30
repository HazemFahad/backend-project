# Northcoders News API

## Notes on env files:

Developer must add an .env.development (PGDATABASE=nc_news) file and a .env.test file (PGDATABASE=nc_news_test) to BE-NC-NEWS folder in order to successfully connect to the two databases locally.

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
(Git Clone https://github.com/squarezy/backend-project)

3- After cloning successfully - Use this command to open Project:
(code backend-project/)

## What to do after cloning?

1- Run this command in the terminal to install all required packages:
(npm i)

2- Create two (.env) Files:

The first is (.env.development) and inside it write the following code: (Pgdatabase=nc_news)

The second is (.env.development) and inside it write the following code: (Pgdatabase=nc_news_test)

3- Run the following command in the terminal to establish a connection to (Postgresql):

(sudo service postgresql start)

4- Run the following command in the terminal (npm run setup-dbs)

5- Run the following command in the terminal to test the app
(npm t app.test.js)

6- If you wanted to run the app in your local host:

Inside the (listen.js) file:

Replace line 3 with this ( const {port=9090} = process.env; )

Then to run the server, run this command (npm start)

7- In your browser set the url to: ( http://localhost:9090/ )

8- Add any of the available points after the ('/')

## Thank you!
