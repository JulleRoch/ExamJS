module.exports = (app, dao,auth) => {

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

    app.post("/defi", auth.isLoggedInAPI, (req, res) => {
        const defi = req.body;
        if (defi.nom === undefined || defi.description === undefined || defi.idUser === undefined || defi.date === undefined  || defi.masked === undefined || defi.nbLike === undefined || defi.nbComment === undefined || defi.nbFinish === undefined) {
            res.status(400).end()
            return
        }
        dao.insert(defi, (err) => {
            if (err == null) {
                res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    });

    app.delete("/defi/:id", auth.isLoggedInAPI, (req, res) => {
        dao.delete(req.params.id, (err) => {
            if (err == null) {
                res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    });

    app.put("/defi/:id", auth.isLoggedInAPI, (req, res) => {
        const defi = req.body;
        if (defi.nom === undefined || defi.description === undefined || defi.idUser === undefined || defi.date === undefined || defi.masked === undefined || defi.nbLike === undefined || defi.nbComment === undefined || defi.nbFinish === undefined) {
            res.status(400).type('text/plain').end()
            return
        }
        dao.update(req.params.id, defi, (err) => {
            if (err == null) {
                res.status(200).type('text/plain').end()
            } else {
                res.status(500).end()
            }
        })
    });

};
