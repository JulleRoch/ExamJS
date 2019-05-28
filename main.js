const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./mabase.db");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const UserDAO = require("./model/userDAO");
const DefiDAO = require("./model/defiDAO");

const userdao = new UserDAO(db);
const defidao = new DefiDAO(db);
require('./model/seeder')(userdao, defidao);

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
app.use(cookieParser()) // read cookies (obligatoire pour l'authentification)
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));
app.use(bodyParser.urlencoded({ extended: false })); // pour les 'form' HTML
app.use(bodyParser.json());
app.use(morgan('dev')); // toute les requêtes HTTP dans le log du serveur
app.use(passport.initialize());
app.use(passport.session());


const auth = require('./passport')(passport, userdao);
require('./api/user')(app, userdao, auth);
require('./api/defi')(app, defidao, auth);
require('./route')(app, passport, auth);


app.listen(3333);
console.log("Serveur démarré");