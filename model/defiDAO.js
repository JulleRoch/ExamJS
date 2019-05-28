const Defi = require('./defi');

module.exports = class DefiDAO {
    constructor(db) {
        this.db = db;
    }
    
    insert(defi, done){
        const stmt = this.db.prepare("INSERT INTO defi(nom, description, date, idUser, masked, nbLike,nbComment, nbFinish) VALUES (?,?,?,?,?,?,?,?)");
        stmt.run([defi.nom, defi.description, defi.date, defi.idUser, defi.masked, defi.nbLike,defi.nbComment, defi.nbFinish], function(err){
            done(err);
        });
        stmt.finalize();
    }
    update(id, defi, done) {
        const stmt = this.db.prepare("UPDATE defi SET nom=?, description=?, date=?, idUser=?, masked=?, nbLike=?,nbComment=?, nbFinish=? WHERE id=?");
        stmt.run(defi.nom, defi.description, defi.date, defi.idUser, defi.masked, defi.nbLike,defi.nbComment, defi.nbFinish, id, done);
        stmt.finalize();
    }
    getAll(done){
        const defis = [];
        this.db.each("SELECT * FROM defi",
            (err, row) => {
                if (err == null) {
                    let d = new Defi(row.nom, row.description, row.idUser, defi.date, row.masked, row.nbLike,row.nbComment, row.nbFinish);
                    d.id = row.id;
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

    getById(id, done){
        let defi = null
        this.db.each("SELECT * FROM defi WHERE id = ?", [id],
            (err, row) => {
                if (err == null) {
                    defi = new defi(row.nom, row.description, row.idUser, defi.date, row.masked, row.nbLike,row.nbComment, row.nbFinish);
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