const Like = require('./like');

module.exports = class LikeDAO {
    constructor(db) {
        this.db = db;
    }
    
    insert(like, done){
        const stmt = this.db.prepare("INSERT INTO like(idUser, idDefi) VALUES (?,?)");
        stmt.run([like.idUser,like.idDefi], function(err){
            done(err);
        });
        stmt.finalize();
    }
    getLike(idUser, idDefi, done){
        let like = null;
        this.db.each("SELECT * FROM like WHERE idUser = ? AND idDefi =?", [idUser,idDefi],
            (err, row) => {
                if (err === null) {
                    like = new Like(row.idUser, row.idDefi);
                }
            },
            (err) => {done(like) }
        )
    }

    update(like, done) {
        this.db.each("SELECT * FROM like WHERE idUser = ? AND idDefi =?", [like.idUser], [like.idDefi],
            (err, row) => {
               /* const stmt = this.db.prepare("DELETE FROM like WHERE idUser=? AND idDefi=?");
                stmt.run(row.idUser, row.idDefi, done);
                stmt.finalize();*/
            },
            (err) => {
                if(err === null){
                   /* const stmt = this.db.prepare("INSERT INTO like(idUser, idDefi) VALUES (?,?)");
                    stmt.run([like.idUser,like.idDefi], done);
                    stmt.finalize();*/
                }
            }
        )
    }

    getByUser(idUser, done){
        const likes = [];
        this.db.each("SELECT * FROM like WHERE idUser=?", [idUser],
            (err, row) => {
                if (err === null) {
                    let l = new Like(row.idUser, row.idDefi);
                    l.id = row.id;
                    likes.push(l);
                }
            },
            (err) => {
                if (err == null && done) {
                    done(likes);
                }
            }
        );
    }

    getByDefi(idDefi, done){
        const likes = [];
        this.db.each("SELECT * FROM like WHERE idDefi=?", [idDefi],
            (err, row) => {
                if (err === null) {
                    let l = new Like(row.idUser, row.idDefi);
                    l.id = row.id;
                    likes.push(l);
                }
            },
            (err) => {
                if (err == null && done) {
                    done(likes);
                }
            }
        );
    }

    delete(like, done) {
        const stmt = this.db.prepare("DELETE FROM like WHERE idUser=? AND idDefi=?");
        stmt.run(like.idUser, like.idDefi, done);
        stmt.finalize();
    }
};