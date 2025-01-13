const { promisify } = require("util");
const db = require("../../../core/db")();

const queries = {
        loginWithEmail: (email, password) => promisify(db.get.bind(db))("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]),
        loginWithLogin: (login, password) => promisify(db.get.bind(db))("SELECT * FROM users WHERE login = ? AND password = ?", [login, password]),
        register: (username, password, email, login) =>
                promisify(db.run.bind(db))("INSERT INTO users(username, password, email, login) VALUES(?, ?, ?, ?)", [username, password, email, login]),

        getByUsername: (username) => promisify(db.get.bind(db))("SELECT * FROM users WHERE username = ?", [username]),
        getByLogin: (login) => promisify(db.get.bind(db))("SELECT * FROM users WHERE login = ?", [login]),
        getByEmail: (email) => promisify(db.get.bind(db))("SELECT * FROM users WHERE email = ?", [email]),
};

module.exports = queries;
