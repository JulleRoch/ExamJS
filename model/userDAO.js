const bcrypt = require('bcrypt');
const User = require('./user');

module.exports = class UserDAO {
    constructor(db) {
        this.db = db;
    }
    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash)
    }
    hashPassword(password) {
        return bcrypt.hashSync(password, 10)  // 10 : cost factor -> + élevé = hash + sûr
    }

    insert(user, done){
        const stmt = this.db.prepare("INSERT INTO user(login, password) VALUES (?, ?)");
        stmt.run([user.login, this.hashPassword(user.password)], function(err){
            done(err);
        });
        stmt.finalize();
    }
    update(login, user, done) {
        let nochange = false;
        this.db.each("SELECT password FROM user WHERE login = ?", [login],
            (err, row) => {
                if (err == null) {
                    if(row.password === user.password){
                        nochange = true;
                    }
                }
            },
            () => {
                let password = this.hashPassword(user.password);
                if(nochange){
                    password = user.password;
                }
                const stmt = this.db.prepare("UPDATE user SET login=?, password=? WHERE login=?");
                stmt.run(user.login, password, login, done);
                stmt.finalize();
            }
        );
    }

    getByLogin(login, done){
        let user = null;
        this.db.each("SELECT * FROM user WHERE login = ?", [login],
            (err, row) => {
                if (err == null) {
                    user = new User(row.login, row.password);
                }
            },
            () => { done(user) }
        )
    }
    getAll(done){
        const users = [];
        this.db.each("SELECT * FROM user",
            (err, row) => {
                if (err == null) {
                    let u = new User(row.login, row.password);
                    users.push(u);
                }
            },
            (err) => {
                if (err == null && done) {
                    done(users);
                }
            }
        );
    }

    delete(login, done) {
        const stmt = this.db.prepare("DELETE FROM user WHERE login=?");
        stmt.run(login, done);
        stmt.finalize();
    }
};