const db = require("../../../core/db.js")();
const { promisify } = require("util");

const queries = {
  getById: (id) =>
    promisify(db.get.bind(db))(
      "SELECT * FROM users WHERE id = ?",
      [id],
    ),
};


module.exports = queries;
