module.exports = (app, auth) => {
    app.post('/post/upload', function (req, res) {
        const body = req.body;
        if (req.files) {
            let file = req.files.preuve
            file.mv('./web/media/' + body.name, function (err) {
                if (err)
                    return res.status(500).send(err);
            });
        }
        res.redirect("/detail.html?id=" + body.idDefi);
    });
}