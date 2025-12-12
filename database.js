const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    password: "[add your password here]",
    database: "",
    host: "localhost",
    port: "5432"
});

module.exports = pool;