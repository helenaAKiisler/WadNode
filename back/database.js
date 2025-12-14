const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    password: "megasuper",
    database: "HW4",
    host: "localhost",
    port: "5433"
});

module.exports = pool;