module.exports = (app, dao,auth) => {

    app.get("/user",  (req, res) => {
        dao.getByLogin(req.user.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                res.json(user)
            }
        })
    });

    app.get("/user/all",  (req, res) => {
        dao.getAll((users) => {
            return res.json(users)
        })
    });

    app.get("/user/compare/:password",  (req, res) => {
        dao.getByLogin(req.user.login, (user)=>{
            const isSame = dao.comparePassword(req.params.password, user.password);
            return res.json(isSame);
        })
    });


    app.get("/user/login/:login",  (req, res) => {
        dao.getByLogin(req.params.login, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                res.json(user)
            }
        })
    });    
    
    app.get("/user/:id",  (req, res) => {
        dao.getById(req.params.id, (user) => {
            if (user == null) {
                res.status(404).type('text/plain').end()
            } else {
                res.json(user)
            }
        })
    });

    app.post("/user",  (req, res) => {
        const user = req.body;
        if (user.login === undefined || user.password === undefined) {
            res.status(400).end()
            return
        }
        dao.insert(user, (err) => {
            if (err == null) {
                res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    });
    
    app.put("/user/:id", auth.isLoggedInAPI, (req, res) => {
        const user = req.body;
        if (user.login === undefined) {
            res.status(400).type('text/plain').end()
            return
        }
        dao.getByLogin(req.user.login, (u)=>{
            if(u.id === parseInt(req.params.id)){
                let ifPassword = true;
                if(user.password === undefined || user.password === null || user.password === ""){
                    dao.updateLogin(req.params.id, user, (err) => {
                        if (err == null) {
                            res.status(200).type('text/plain').end()
                        } else {
                            res.status(500).end()
                        }
                    })
                }
                else{
                    dao.update(req.params.id, user, (err) => {
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
