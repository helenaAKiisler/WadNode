const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    password: "megasuper",
    database: "HW4",
    host: "localhost",
    port: "5433"
});

const execute = async(query) => {
    try {
        await pool.connect(); // create a connection
        await pool.query(query); // executes a query
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};

const createTblQuery = `
    CREATE TABLE IF NOT EXISTS "users" (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(200) NOT NULL UNIQUE,
        password VARCHAR(200) NOT NULL 
    );`;

const createTblQueryPosts = `
    CREATE TABLE IF NOT EXISTS "posttable" (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        body VARCHAR(200) NOT NULL,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

execute(createTblQuery).then(result => {
    if (result) {
        console.log('Table "users"  is created');
    }
});

execute(createTblQueryPosts).then(result => {
    if (result) {
        console.log('Table "posttable"  is created');
    }
});

module.exports = pool;