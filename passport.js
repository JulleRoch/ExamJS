
const LocalStrategy = require('passport-local').Strategy;
const User = require('./model/user');

module.exports =  (passport, userDao) => {

    // objet utilisateur -> identifiant de session
    passport.serializeUser((user, done) => {
        done(null, user.login)
    });

    // identifiant de session -> objet utilisateur
    passport.deserializeUser((login, done) => {
        done(null, new User(login))
    });

    passport.use('local-login', new LocalStrategy({
            // champs du formulaire login
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, login, password, done) => {
            userDao.getByLogin(login, (user) => {
                if (user != null && userDao.comparePassword(password, user.password, user.admin)) {
                    return done(null, new User(login, user.password, user.admin))
                } else {
                    return done(null, false)
                }
            })
        })
    );

    // autologin
    var defaultUser = null;

    return {
        isLoggedInAPI(req, res, next) {
            // autologin
            if (defaultUser != null) {
                req.user = defaultUser
                return next()
            }
            // si utilisateur authentifié, continuer
            if (req.isAuthenticated()) {
                return next()
            }
            // sinon erreur 'Unauthorized'
            res.status(401).type("text/plain").end()
        },
        isLoggedInWeb(req, res, next) {
            // autologin
            if (defaultUser != null) {
                req.user = defaultUser;
                return next()
            }
            // si utilisateur authentifié, continuer
            if (req.isAuthenticated()) {
                return next()
            }
            // sinon afficher formulaire de login
            res.redirect('/login')

        }
    }
}