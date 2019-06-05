const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./mabase.db");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const UserDAO = require("./model/userDAO");
const DefiDAO = require("./model/defiDAO");
const LikeDAO = require("./model/likeDAO");
const SuiviDAO = require("./model/suiviDAO");
const PostDAO = require("./model/postDAO");

const userdao = new UserDAO(db);
const defidao = new DefiDAO(db);
const likedao = new LikeDAO(db);
const suividao = new SuiviDAO(db);
const postdao = new PostDAO(db);
require('./model/seeder')(userdao, defidao, likedao, suividao, postdao);

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
require('./api/defi')(app, defidao, userdao, likedao, auth);
require('./api/like')(app, likedao, userdao, auth);
require('./api/suivi')(app, suividao, userdao, defidao, auth);
require('./api/post')(app, postdao, userdao,  auth);
require('./route')(app, passport, auth);


app.listen(3333);
console.log("Serveur démarré");