const User = require('./user');
const Defi = require('./defi');

module.exports = (userdao, defidao) => {
    userdao.db.run("CREATE TABLE user" +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT,"+
        "login TEXT UNIQUE, " +
        "password TEXT)", (err)=>{
        if(err == null){
            userdao.insert(new User("login1", "login1"), ()=>{})
            userdao.insert(new User("login2", "login2"), ()=>{})
        }
    });
    defidao.db.run("CREATE TABLE defi" +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT,"+
        "nom TEXT, " +
        "description TEXT  CHECK (LENGTH(description)<=140), " +
        "date INTEGER, " +
        "idUser INTEGER, " +
        "nbLike INTEGER, " +
        "nbComment INTEGER, " +
        "nbFinish INTEGER, " +
        "masked BOOL)", (err)=>{
        if(err == null){
            defidao.insert(new Defi("Cheese Challenge", "Lorem ipsum dolor sit amet, consectetur massa nunc.", 1), ()=>{})
            defidao.insert(new Defi("Mon idée", "Morbi vel dictum dolor. Mauris facilisis velit quis nibh consequat scelerisque. Mauris vitae ligula id. ", 2, null,false, 3,1), ()=>{})
        }
    });
};