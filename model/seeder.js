const User = require('./user');
const Defi = require('./defi');
const Like = require('./like');

module.exports = (userdao, defidao, likedao) => {
    userdao.db.run("CREATE TABLE user" +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT,"+
        "login TEXT UNIQUE, " +
        "password TEXT)", (err)=>{
        if(err == null){
            for(let i=0; i <15; i++){
                userdao.insert(new User("login"+[i], "login"+[i]), ()=>{})
            }
        }
    });
    defidao.db.run("CREATE TABLE defi" +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT,"+
        "nom TEXT, " +
        "description TEXT  CHECK (LENGTH(description)<=140), " +
        "date INTEGER, " +
        "idUser INTEGER, " +
        "nbLike INTEGER CHECK (nbLike>=0), " +
        "nbComment INTEGER CHECK (nbComment>=0), " +
        "nbFinish INTEGER CHECK (nbFinish>=0), " +
        "masked BOOL)", (err)=>{
        if(err == null){
            likedao.db.run("CREATE TABLE like" +
                "(idUser INTEGER,"+
                "idDefi INTEGER, " +
                "CONSTRAINT key_like UNIQUE (idUser,idDefi))", (err)=>{
                if(err == null){
                    defidao.insert(new Defi("Cheese Challenge", "Lorem ipsum dolor sit amet, consectetur massa nunc.", 1), (defi)=>{
                       /* const nbLike = Math.floor(Math.random() * Math.floor(5))+1;
                        for(let i=0; i<nbLike; i++){
                            const idUser = Math.floor(Math.random() * Math.floor(15))+1;
                            likedao.insert(new Like(idUser,defi.id),()=>{});
                            defidao.updateLike(defi.id, idUser,()=>{});
                        }*/
                    })
                    defidao.insert(new Defi("Mon idée", "Morbi vel dictum dolor. Mauris facilisis velit quis nibh consequat scelerisque. Mauris vitae ligula id. ", 2, new Date('2018-12-17T06:45:00')), (defi)=>{
                        /*const nbLike = Math.floor(Math.random() * Math.floor(5))+1;
                        for(let i=0; i<nbLike; i++){
                            const idUser = Math.floor(Math.random() * Math.floor(15))+1;
                            likedao.insert(new Like(idUser,defi.id),()=>{});
                            defidao.updateLike(defi.id, idUser,()=>{});
                        }*/
                    })
                    defidao.insert(new Defi("Kellog's", "Mettre dans sa bouche le plus de Kellog's possible.", 2, new Date('2019-05-16T21:02:00')),(defi)=>{
                        /*const nbLike = Math.floor(Math.random() * Math.floor(5))+1;
                        for(let i=0; i<nbLike; i++){
                            const idUser = Math.floor(Math.random() * Math.floor(15))+1;
                            likedao.insert(new Like(idUser,defi.id),()=>{});
                            defidao.updateLike(defi.id, idUser,()=>{});
                        }*/
                    })
                }
            });
        }
    });
};