module.exports = (app, dao, userdao, defidao, auth) => {

    app.get("/suivi/:id", auth.isLoggedInAPI, (req, res) => {
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                if(user.id === parseInt(req.params.id)){
                    dao.getByUser(req.params.id, (suivis) => {
                        defidao.getAll((defis) => {
                            return res.json(defis)
                        }, "date", user.id, "suivi", req.params.id, suivis)
                    })
                }
            }
        })
    });

    app.post("/suivi",  (req, res) => {
        const suivi = req.body;
        if (suivi.idDefi === undefined) {
            res.status(400).type('text/plain').end()
            return
        }
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                if(suivi.idUser === undefined || suivi.idUser === null){
                    suivi.idUser = user.id;
                }
                if(user.id === suivi.idUser){
                    dao.insert(suivi, (err) => {
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

    app.delete("/suivi/:idDefi", auth.isLoggedInAPI, (req, res) => {
        userdao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                dao.delete(user.id, req.params.idDefi, (err) => {
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
