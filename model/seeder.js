const User = require('./user');
const Defi = require('./defi');
const Like = require('./like');
const Suivi = require('./suivi');
const Post = require('./post');

module.exports = (userdao, defidao, likedao, suividao, postdao) => {
    userdao.db.run("CREATE TABLE user" +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT," +
        "login TEXT UNIQUE, " +
        "password TEXT)", (err) => {
            if (err == null) {
                for (let i = 0; i < 15; i++) {
                    userdao.insert(new User("login" + [i], "login" + [i]), () => { })
                }
            }
        });
    defidao.db.run("CREATE TABLE defi" +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT," +
        "nom TEXT, " +
        "description TEXT  CHECK (LENGTH(description)<=140), " +
        "date INTEGER, " +
        "idUser INTEGER, " +
        "nbLike INTEGER CHECK (nbLike>=0), " +
        "nbComment INTEGER CHECK (nbComment>=0), " +
        "nbRealize INTEGER CHECK (nbRealize>=0), " +
        "masked BOOL," +
        "FOREIGN KEY (idUser) REFERENCES user(id))", (err) => {
            if (err == null) {
                likedao.db.run("CREATE TABLE like" +
                    "(idUser INTEGER," +
                    "idDefi INTEGER, " +
                    "CONSTRAINT key_like UNIQUE (idUser,idDefi)," +
                    "FOREIGN KEY (idUser) REFERENCES user(id)," +
                    "FOREIGN KEY (idDefi) REFERENCES defi(id))", (err) => {
                        if (err == null) {
                            suividao.db.run("CREATE TABLE suivi" +
                                "(idUser INTEGER," +
                                "idDefi INTEGER, " +
                                "CONSTRAINT key_like UNIQUE (idUser,idDefi)," +
                                "FOREIGN KEY (idUser) REFERENCES user(id)," +
                                "FOREIGN KEY (idDefi) REFERENCES defi(id))", (err) => {
                                    if (err == null) {
                                        postdao.db.run("CREATE TABLE post" +
                                            "(id INTEGER PRIMARY KEY AUTOINCREMENT," +
                                            "description TEXT  CHECK (LENGTH(description)<=140), " +
                                            "date INTEGER, " +
                                            "idUser INTEGER, " +
                                            "idDefi INTEGER, " +
                                            "isRealize BOOL," +
                                            "typePJ TEXT, " +
                                            "pj TEXT, " +
                                            "approved BOOL," +
                                            "FOREIGN KEY (idUser) REFERENCES user(id)," +
                                            "FOREIGN KEY (idDefi) REFERENCES defi(id))", (err) => {
                                                if (err == null) {
                                                    defidao.insert(new Defi("Cheese Challenge", "Lorem ipsum dolor sit amet, consectetur massa nunc.", 1), (defi) => {
                                                        likedao.insert(new Like(3, defi.id),()=>{})
                                                        defidao.updateLike(defi.id, true, ()=>{})
                                                        likedao.insert(new Like(6, defi.id),()=>{})
                                                        defidao.updateLike(defi.id, true, ()=>{})
                                                        suividao.insert(new Suivi(5, defi.id), () => { })
                                                        postdao.insert(new Post(defi.id, 3, "C'est super marrant comme idée"), () => { })
                                                        defidao.updateComment(defi.id, () => { });
                                                        postdao.insert(new Post(defi.id, 6, "J'ai trop kiffé ce défi, j'vous montre la vidéo ;)", null, true, "video", "video.mp4"), () => { })
                                                        defidao.updateRealize(defi.id, () => { });
                                                    })
                                                    defidao.insert(new Defi("Mon idée", "Morbi vel dictum dolor. Mauris facilisis velit quis nibh consequat scelerisque. Mauris vitae ligula id. ", 2, new Date('2018-12-17T06:45:00')), (defi) => {
                                                        suividao.insert(new Suivi(5, defi.id), () => { })
                                                    })
                                                    defidao.insert(new Defi("Kellog's", "Mettre dans sa bouche le plus de Kellog's possible.", 2, new Date('2019-05-16T21:02:00')), (defi) => {
                                                        likedao.insert(new Like(7, defi.id),()=>{})
                                                        defidao.updateLike(defi.id, true, ()=>{})
                                                     })
                                                    defidao.insert(new Defi("Lapin Crétin", "Bwaaaaaaaahh", 2, new Date('2019-06-01T09:22:00'), true), (defi) => { })

                                                }
                                            });
                                    }
                                })
                        }
                    });

            }

        });

};