module.exports = (app, dao, userdao, defidao, auth) => {

    app.get("/post/defi/:id", auth.isLoggedInAPI, (req, res) => {
        dao.getByDefi(req.params.id, (posts) => {
            return res.json(posts)
        })
    });

    app.get("/post/:id", auth.isLoggedInAPI, (req, res) => {
        dao.getById(req.params.id, (post) => {
            return res.json(post)
        })
    });

    app.get("/post", auth.isLoggedInAPI, (req, res) => {
        dao.getAll((posts) => {
            return res.json(posts)
        })
    });

    app.get("/post/comment/:id", auth.isLoggedInAPI, (req, res) => {
        dao.getTypePostByDefi(req.params.id, 0, (posts) => {
            return res.json(posts)
        })
    });

    app.get("/post/realize/:id", auth.isLoggedInAPI, (req, res) => {
        dao.getTypePostByDefi(req.params.id, 1, (posts) => {
            return res.json(posts)
        })
    });

    app.post('/post/upload', function (req, res) {
        const body = req.body;
        let path = "";
        let typefile;
        if (req.files) {
            let file = req.files.preuve;
            const name = body.idDefi + "_" + (Math.floor(Math.random() * Math.floor(1000)) + 1000);
            typefile = file.mimetype.split('/');
            let typeExt = typefile[1];
            if (typeExt === "jpeg") {
                typeExt = "jpg"
            }
            if (typeExt === "ogg") {
                typeExt = "ogv"
            }
            path = name + "." + typeExt;
            file.mv('./web/media/' + path, function (err) {
                if (err)
                    return res.status(500).send(err);
            });
        }

        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                const post = body;
                post.idUser = user.id;
                post.date = new Date();
                post.isRealize = true;
                post.typePJ = typefile[0];
                post.pj = path;
                post.approved = false;
                dao.insert(post, (post, err) => {
                    if (err == null) {
                        defidao.updateRealize(body.idDefi, (err) => {
                            if (err == null) {
                                res.redirect("/detail.html?id=" + body.idDefi);
                            } else {
                                res.status(500).end()
                            }
                        })
                    } else {
                        res.status(500).end()
                    }
                })
            }
        })
    });

    app.post("/post", auth.isLoggedInAPI, (req, res) => {
        const post = req.body;
        if (post.idUser === undefined || post.idDefi === undefined || post.description === undefined || post.date === undefined || post.isRealize === undefined || post.typePJ === undefined || post.pj === undefined || post.approved === undefined) {
            res.status(400).end()
            return
        }
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                if (user.id === post.idUser) {
                    dao.insert(post, (post, err) => {
                        if (err == null) {
                            res.status(200).type('text/plain').end()
                        } else {
                            res.status(500).end()
                        }
                    })
                }

            }
        })

    });


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

    app.post('/post/upload/update', function (req, res) {
        const body = req.body;
        dao.getById(body.id, (posts) => {
            const post = posts[0];
            let path = "";
            let typePJ;
            if (req.files) {
                let file = req.files.preuve;
                const name = post.idDefi + "_" + (Math.floor(Math.random() * Math.floor(1000)) + 1000);
                typefile = file.mimetype.split('/');
                typePJ = typefile[0];
                let typeExt = typefile[1];
                if (typeExt === "jpeg") {
                    typeExt = "jpg"
                }
                if (typeExt === "ogg") {
                    typeExt = "ogv"
                }
                path = name + "." + typeExt;
                file.mv('./web/media/' + path, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
            }
            else {
                path = post.pj;
                typePJ = post.typePJ;
            }

            post.typePJ = typePJ;
            post.pj = path;
            post.description = body.description;

            dao.update(post.id, post, (p, err) => {
                if (err == null) {
                    res.redirect("/detail.html?id=" + post.idDefi);
                } else {
                    res.status(500).end()
                }
            })
        })

    });

    app.put("/post/:id", auth.isLoggedInAPI, (req, res) => {
        const post = req.body;
        if (post.idUser === undefined || post.idDefi === undefined || post.description === undefined || post.date === undefined || post.isRealize === undefined || post.typePJ === undefined || post.pj === undefined || post.approved === undefined) {
            res.status(400).end()
            return
        }
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                    dao.update(req.params.id, post, (post, err) => {
                        if (err == null) {
                            res.status(200).type('text/plain').end()
                        } else {
                            res.status(500).end()
                        }
                    })
            }
        })
    });
};
