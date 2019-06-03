module.exports = (app, dao, userdao, auth) => {

    app.get("/like/:defi", auth.isLoggedInAPI, (req, res) => {
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                dao.getLike(user.id, req.params.defi, (like) => {
                    return res.json(like)
                })
            }
        });
    });
    
    app.get("/like/user/:id", auth.isLoggedInAPI, (req, res) => {
        dao.getByUser(req.params.id, (likes) => {
            return res.json(likes)
        })
    });

    app.get("/like/defi/:id", auth.isLoggedInAPI, (req, res) => {
        dao.getByDefi(req.params.id, (likes) => {
            return res.json(likes)
        })
    });

    
    app.post("/like",  (req, res) => {
        const like = req.body;
        if (like.idDefi === undefined) {
            res.status(400).type('text/plain').end()
            return
        }
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                if(like.idUser === undefined || like.idUser === null){
                    like.idUser = user.id;
                }
                if(user.id === like.idUser){
                    dao.getLike(like.idUser, like.idDefi, (l) => {
                        if(l !== null){
                            dao.delete(l, (err) => {
                                if (err == null) {
                                    res.status(200).type('text/plain').end()
                                } else {
                                    res.status(500).end()
                                }
                            })
                        }
                        else{
                            dao.insert(like, (err) => {
                                if (err == null) {
                                    res.status(200).type('text/plain').end()
                                } else {
                                    res.status(500).end()
                                }
                            })
                        }
                })
                }
            }
        })
        
    });

    app.put("/like", auth.isLoggedInAPI, (req, res) => {
        const like = req.body;
        if (like.idDefi === undefined) {
            res.status(400).type('text/plain').end()
            return
        }
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                if(like.idUser === undefined || like.idUser === null){
                    like.idUser = user.id;
                }
                if(user.id === like.idUser){
                     dao.update(like, (err) => {
                        if (err == null) {
                            res.status(200).type('text/plain').end()
                        } else {
                            res.status(500).end()
                        }
                    })
                    res.status(502).end()
                }
            }
        })
    });

};
