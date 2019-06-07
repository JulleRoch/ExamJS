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

    insert(user, done) {
        const stmt = this.db.prepare("INSERT INTO user(login, password) VALUES (?, ?)");
        stmt.run([user.login, this.hashPassword(user.password)], function (err) {
            done(err);
        });
        stmt.finalize();
    }
    update(id, user, done) {
        const stmt = this.db.prepare("UPDATE user SET login=?, password=? WHERE id=?");
        stmt.run(user.login, this.hashPassword(user.password), id, done);
        stmt.finalize();
    }

    updateLogin(id, user, done){
        const stmt = this.db.prepare("UPDATE user SET login=? WHERE id=?");
        stmt.run(user.login, id, done);
        stmt.finalize();
    }

    getByLogin(login, done) {
        let user = null;
        this.db.each("SELECT * FROM user WHERE login = ?", [login],
            (err, row) => {
                if (err == null) {
                    user = new User(row.login, row.password);
                    user.id = row.id;
                }
            },
            () => { done(user) }
        )
    }

    getById(id, done) {
        let user = null;
        this.db.each("SELECT * FROM user WHERE id = ?", [id],
            (err, row) => {
                if (err == null) {
                    user = new User(row.login, row.password);
                    user.id = row.id;
                }
            },
            () => { done(user) }
        )
    }
    getAll(done) {
        const users = [];
        this.db.each("SELECT * FROM user",
            (err, row) => {
                if (err == null) {
                    let u = new User(row.login, row.password);
                    u.id = row.id;
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
};