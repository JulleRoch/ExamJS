module.exports = (app, passport, auth) => {

    const web = __dirname + '/web/';
    const css = web + '/css/';
    const js = web + '/js/';
    const img = css + '/img/';
    const media = web + '/media/';

     app.get(['/login'], (req, res) => {
        if (req.originalUrl === '/') {
            res.sendFile(web + 'login.html');
            return
        }
        res.sendFile(web + req.path  + '.html')
    });

    app.get(['/', '/index', '/creation','/listeDefi','/detail','/profil'], auth.isLoggedInWeb, (req, res) => {
        if (req.originalUrl === '/') {
            res.sendFile(web + 'index.html');
            return
        }
        res.sendFile(web + req.path + '.html')
    });

    app.get('*.html', auth.isLoggedInWeb, (req, res) => {
        res.sendFile(web + req.path)
    });

    app.post('/authenticate', passport.authenticate('local-login', {
        successRedirect: '/index',
        failureRedirect: '/login'
    }));


    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/')
    });

    app.get('*.css', (req, res) => {
        res.sendFile(css + req.path)
    });

    app.get(['*.mp4', '*.webm', '*.ogv'], (req, res) => {
        res.sendFile(media + req.path)
    });
    app.get(['/media/*.jpg', '/media/*.png'], (req, res) => {
        res.sendFile(web + req.path)
    });

    app.get(['*.png', '*.jpg'], (req, res) => {
        res.sendFile(img + req.path)
    });
    app.get('*.js', (req, res) => {
        res.sendFile(js + req.path)
    });

};