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


    app.get("/user/:login",  (req, res) => {
        dao.getByLogin(req.params.login, (user) => {
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
    
    app.put("/user/:login", auth.isLoggedInAPI, (req, res) => {
        const user = req.body;
        if (user.login === undefined || user.password === undefined) {
            res.status(400).type('text/plain').end()
            return
        }
        if(user.login === req.user.login){
            dao.update(req.params.login, user, (err) => {
                if (err == null) {
                    res.status(200).type('text/plain').end()
                } else {
                    res.status(500).end()
                }
            })
        }
    });

};
