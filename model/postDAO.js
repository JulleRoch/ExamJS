const Post = require('./post');

module.exports = class PostDAO {
    constructor(db) {
        this.db = db;
    }

    insert(post, done) {
        const stmt = this.db.prepare("INSERT INTO post(idUser, idDefi, description, date, isRealize, typePJ, pj, approved) VALUES (?,?,?,?,?,?,?,?)");
        stmt.run([post.idUser, post.idDefi, post.description, post.date, post.isRealize, post.typePJ, post.pj, post.approved], function (err) {
            post.id = this.lastID;
            done(post, err);
        });
        stmt.finalize();
    }
    update(id, post, done) {
        const stmt = this.db.prepare("UPDATE post SET idUser=?, idDefi=?, description=?, date=?, isRealize=?, typePJ=?, pj=?, approved=? WHERE id=?");
        stmt.run(post.idUser, post.idDefi, post.description, post.date, post.isRealize, post.typePJ, post.pj, post.approved, id, done);
        stmt.finalize();
    }

    getAll(done) {
        const posts = [];
        this.db.each("SELECT * FROM post",
            (err, row) => {
                if (err == null) {
                    let p = new Post(row.idUser, row.idDefi, row.description, row.date, row.isRealize, row.typePJ, row.pj, row.approved);
                    p.id = row.id;
                    posts.push(p);
                }
            },
            (err) => {
                if (err == null && done) {
                    done(posts);
                }
            }
        );
    }
    
    getByDefi(idDefi, done) {
        const posts = [];
        this.db.each("SELECT * FROM post WHERE idDefi=?",[idDefi],
            (err, row) => {
                if (err == null) {
                    let p = new Post(row.idUser, row.idDefi, row.description, row.date, row.isRealize, row.typePJ, row.pj, row.approved);
                    p.id = row.id;
                    posts.push(p);
                }
            },
            (err) => {
                if (err == null && done) {
                    done(posts);
                }
            }
        );
    }

    getTypePostByDefi(idDefi, isRealize,done) {
        const user = new Map();
        this.db.each("SELECT id, login FROM user",
            (err, row) => {
                if (err === null) {
                    user.set(row.id, row.login);
                }
            },
            (err) => {
                if (err == null) {
                    const posts = [];
                    this.db.each("SELECT * FROM post WHERE idDefi=? AND isRealize=? ORDER BY date DESC",[idDefi, isRealize],
                        (err, row) => {
                            if (err == null) {
                                let p = new Post(row.idDefi, row.idUser, row.description, row.date, row.isRealize, row.typePJ, row.pj, row.approved);
                                p.id = row.id;
                                p.loginUser = user.get(p.idUser)
                                posts.push(p);
                            }
                        },
                        (err) => {
                            if (err == null && done) {
                                done(posts);
                            }
                        }
                    );
                }
            }
        );
    }

};