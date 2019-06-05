const Defi = require('./defi');

module.exports = class DefiDAO {
    constructor(db) {
        this.db = db;
    }

    insert(defi, done) {
        const stmt = this.db.prepare("INSERT INTO defi(nom, description, date, idUser, masked, nbLike,nbComment, nbRealize) VALUES (?,?,?,?,?,?,?,?)");
        stmt.run([defi.nom, defi.description, defi.date, defi.idUser, defi.masked, defi.nbLike, defi.nbComment, defi.nbRealize], function (err) {
            defi.id = this.lastID;
            done(defi, err);
        });
        stmt.finalize();
    }
    update(id, defi, done) {
        const stmt = this.db.prepare("UPDATE defi SET nom=?, description=?, date=?, idUser=?, masked=?, nbLike=?,nbComment=?, nbRealize=? WHERE id=?");
        stmt.run(defi.nom, defi.description, defi.date, defi.idUser, defi.masked, defi.nbLike, defi.nbComment, defi.nbRealize, id, done);
        stmt.finalize();
    }

    updateComment(id, done) {
        const stmt = this.db.prepare("UPDATE defi SET nbComment=(nbComment+1) WHERE id=?");
        stmt.run(id, done);
        stmt.finalize();
    }

    updateRealize(id, done) {
        const stmt = this.db.prepare("UPDATE defi SET nbRealize=(nbRealize+1) WHERE id=?");
        stmt.run(id, done);
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

    getAll(done, order = "date", idLogin=0, type="all", id= 0 /*user ou defi suivant le type*/, tSuivi=null) {
        let rSelect = "SELECT * FROM defi";
        let rWhere = "";
        let rOrder = "";
        
        if(type !== "all"){
            rWhere += "WHERE";
            if(type === "byUser"){
                rWhere += " " + "idUser =" + id;
            }
            if(type ==="suivi"){
                rWhere += " " + "id IN(";
                let one=true;
                for (let suivi of tSuivi){
                    if(!one){
                        rWhere+=",";
                    }
                    rWhere += suivi.idDefi;
                    one=false;
                }
                rWhere +=")";
            }
            if(type="byId"){
                rWhere +=  " " + "id =" + id;
            }
        }

        rOrder+="ORDER BY "
        rOrder += order;
        if (order === "date" || order === "nbLike") {
            rOrder += " DESC";
        }

        const requete = rSelect + " " + rWhere + " " + rOrder;

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
                    this.db.each("SELECT idDefi FROM like WHERE idUser = ?", [idLogin],
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
                                        let d = new Defi(row.nom, row.description, row.idUser, row.date, row.masked, row.nbLike, row.nbComment, row.nbRealize);
                                        d.id = row.id;
                                        d.loginUser = user.get(d.idUser);
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

    getRealizeByUser(done, idLogin=0 /*id du user connecté*/, idUser = 0 /*id du user de la liste*/) {
        let rSelect = "SELECT d.*";
        let rFrom = "FROM defi d JOIN post p ON (d.id = p.idDefi)";
        let rWhere = "WHERE isRealize=1 AND p.idUser=?";
        let rOrder = "ORDER BY date DESC";

        const requete = rSelect + " " + rFrom + " " + rWhere + " " + rOrder;

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
                    this.db.each("SELECT idDefi FROM like WHERE idUser = ?", [idLogin],
                        (err, row) => {
                            if (err === null) {
                                likes.push(row.idDefi);
                            }
                        },
                        (err) => {
                            const defis = [];
                            this.db.each(requete, [idUser],
                                (err, row) => {
                                    if (err == null) {
                                        let d = new Defi(row.nom, row.description, row.idUser, row.date, row.masked, row.nbLike, row.nbComment, row.nbRealize);
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
                    defi = new defi(row.nom, row.description, row.idUser, row.date, row.masked, row.nbLike, row.nbComment, row.nbRealize);
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