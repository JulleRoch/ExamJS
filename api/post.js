module.exports = (app, dao, userdao, auth) => {

    app.get("/post/defi/:id", auth.isLoggedInAPI, (req, res) => {
        dao.getByDefi(req.params.id, (posts) => {
            return res.json(posts)
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
                if (user.id === post.idUser) {
                    dao.update(req.params.id, post, (post, err) => {
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
};
