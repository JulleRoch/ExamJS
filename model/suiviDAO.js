const Suivi = require('./suivi');

module.exports = class SuiviDAO {
    constructor(db) {
        this.db = db;
    }

    insert(suivi, done) {
        const stmt = this.db.prepare("INSERT INTO suivi(idUser, idDefi) VALUES (?,?)");
        stmt.run([suivi.idUser, suivi.idDefi], function (err) {
            done(err);
        });
        stmt.finalize();
    }

    getByUser(idUser, done) {
        const suivis = [];
        this.db.each("SELECT * FROM suivi WHERE idUser=?", [idUser],
            (err, row) => {
                if (err === null) {
                    let s = new Suivi(row.idUser, row.idDefi);
                    s.id = row.id;
                    suivis.push(s);
                }
            },
            (err) => {
                if (err == null && done) {
                    done(suivis);
                }
            }
        );
    }  
    delete(idUser, idDefi, done) {
        const stmt = this.db.prepare("DELETE FROM suivi WHERE idUser=? AND idDefi=?");
        stmt.run(idUser, idDefi, done);
        stmt.finalize();
    }
};