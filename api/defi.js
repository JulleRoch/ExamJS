module.exports = (app, dao, userdao, likedao, auth) => {

    app.get("/defi/:id", auth.isLoggedInAPI, (req, res) => {
        dao.getById(req.params.id, (defi) => {
            if (defi == null) {
                res.status(404).type('text/plain').end()
            } else {
                res.json(defi)
            }
        })
    });

    app.get("/defi", auth.isLoggedInAPI, (req, res) => {
        dao.getAll((defis) => {
            return res.json(defis)
        })
    });

    app.get("/defi/order/:order", auth.isLoggedInAPI, (req, res) => {
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                dao.getAll((defis) => {
                    return res.json(defis)
                }, req.params.order, user.id)
            }
        })
    });

    app.post("/defi", auth.isLoggedInAPI, (req, res) => {
        const defi = req.body;
        if (defi.nom === undefined || defi.description === undefined || defi.idUser === undefined || defi.date === undefined || defi.masked === undefined || defi.nbLike === undefined || defi.nbComment === undefined || defi.nbFinish === undefined) {
            res.status(400).end()
            return
        }
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                if (user.id === defi.idUser) {
                    dao.insert(defi, (defi, err) => {
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

    app.delete("/defi/:id", auth.isLoggedInAPI, (req, res) => {
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                if (user.id === req.params.id) {
                    dao.delete(req.params.id, (err) => {
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

    app.put("/defi/:id", auth.isLoggedInAPI, (req, res) => {
        const defi = req.body;
        if (defi.nom === undefined || defi.description === undefined || defi.idUser === undefined || defi.date === undefined || defi.masked === undefined || defi.nbLike === undefined || defi.nbComment === undefined || defi.nbFinish === undefined) {
            res.status(400).type('text/plain').end()
            alert("if :1" + status);
            return
        }
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                if (user.id === defi.idUser) {
                    dao.update(req.params.id, defi, (err) => {
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

    app.put("/defi", auth.isLoggedInAPI, (req, res) => {
        const like = req.body;
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                if (like.idUser === null || like.idUser === undefined) {
                    like.idUser = user.id;
                }
                if (user.id === like.idUser) {
                    likedao.getLike(like.idUser, like.idDefi, (l) => {
                        console.log("l" + l)
                        console.log("like" + like);
                        if (l === null) {
                            //-1
                            dao.updateLike(like.idDefi, false, (err) => {
                                if (err == null) {
                                    res.status(200).type('text/plain').end()
                                } else {
                                    res.status(500).end()
                                }
                            })
                        }
                        else {
                            //+1
                            dao.updateLike(like.idDefi, true, (err) => {
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

};
