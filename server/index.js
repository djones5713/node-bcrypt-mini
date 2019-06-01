require('dotenv').config();
const express = require('express');
const session = require('express-session');

const massive = require('massive');
const { register, login } = require('./controller/authController')

const app = express();

app.use(express.json());

let { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

massive(CONNECTION_STRING).then(db => {
  // access db on any request 
  // db.init();
  app.set('db', db);
});

app.post("/auth/signup", register)
app.post("/auth/login", login)


app.listen(SERVER_PORT, () => {
  console.log(`Listening on port: ${SERVER_PORT}`);
});
