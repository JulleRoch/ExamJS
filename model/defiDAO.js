const Defi = require('./defi');

module.exports = class DefiDAO {
    constructor(db) {
        this.db = db;
    }

    insert(defi, done) {
        const stmt = this.db.prepare("INSERT INTO defi(nom, description, date, idUser, masked, nbLike,nbComment, nbFinish) VALUES (?,?,?,?,?,?,?,?)");
        stmt.run([defi.nom, defi.description, defi.date, defi.idUser, defi.masked, defi.nbLike, defi.nbComment, defi.nbFinish], function (err) {
            defi.id = this.lastID;
            done(defi, err);
        });
        stmt.finalize();
    }
    update(id, defi, done) {
        const stmt = this.db.prepare("UPDATE defi SET nom=?, description=?, date=?, idUser=?, masked=?, nbLike=?,nbComment=?, nbFinish=? WHERE id=?");
        stmt.run(defi.nom, defi.description, defi.date, defi.idUser, defi.masked, defi.nbLike, defi.nbComment, defi.nbFinish, id, done);
        stmt.finalize();
    }

    updateLike(idDefi, add, done) {
        let requete = "UPDATE defi SET nbLike=(nbLike";
        if (add === true) {
            requete += "+1";
        }
        else {
            requete += "-1";
        }
        requete += ") WHERE id=?"
        const stmt = this.db.prepare(requete);
        stmt.run(idDefi, done);
        stmt.finalize();
    }

    getAll(done, order = "nom", type="all", idUser = 0) {
        let requete = "SELECT * FROM defi ";
        requete+="ORDER BY "
        requete += order;
        if (order === "date" || order === "nbLike") {
            requete += " DESC";
        }

        const user = new Map();
        this.db.each("SELECT id, login FROM user",
            (err, row) => {
                if (err === null) {
                    user.set(row.id, row.login);

                }
            },
            (err) => {
                if (err == null) {
                    const likes = [];
                    this.db.each("SELECT idDefi FROM like WHERE idUser = ?", [idUser],
                        (err, row) => {
                            if (err === null) {
                                likes.push(row.idDefi);
                            }
                        },
                        (err) => {
                            const defis = [];
                            this.db.each(requete,
                                (err, row) => {
                                    if (err == null) {
                                        let d = new Defi(row.nom, row.description, row.idUser, row.date, row.masked, row.nbLike, row.nbComment, row.nbFinish);
                                        d.id = row.id;
                                        d.loginUser = user.get(d.id);
                                        d.like = likes.includes(d.id);
                                        defis.push(d);
                                    }
                                },
                                (err) => {
                                    if (err == null && done) {
                                        done(defis);
                                    }
                                }
                            );
                        }
                    )
                }
            }
        );
    }

    getById(id, done) {
        let defi = null
        this.db.each("SELECT * FROM defi WHERE id = ?", [id],
            (err, row) => {
                if (err == null) {
                    defi = new defi(row.nom, row.description, row.idUser, row.date, row.masked, row.nbLike, row.nbComment, row.nbFinish);
                    defi.id = id;
                }
            },
            () => { done(defi) }
        )
    }

    delete(id, done) {
        const stmt = this.db.prepare("DELETE FROM defi WHERE id=?");
        stmt.run(id, done);
        stmt.finalize();
    }
};