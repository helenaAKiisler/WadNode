const express = require('express');
const pool = require('./database');
const cors = require('cors')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000;

const app = express();

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));

app.use(express.json());  
app.use(cookieParser());  

//app.use(express.json());


    //  Handling HTTP requests code will go here  

app.listen(port, () => {
    console.log("Server is listening to port " + port)
});
//create a new post
 app.post('/api/posts/', async(req, res) => {
    try {
        console.log("a post request has arrived");
        const post = req.body;
        const newpost = await pool.query(
            "INSERT INTO posttable(body, time) values ($1, $2)    RETURNING*", [post.body, post.TIMESTAMP]
// $1, $2, $3 are mapped to the first, second and third element of the passed array (post.title, post.body, post.urllink) 
// The RETURNING keyword in PostgreSQL allows returning a value from the insert or update statement.
// using "*" after the RETURNING keyword in PostgreSQL, will return everything
        );
        res.json(newpost);
    } catch (err) {
        console.error(err.message);
    }
});

//get a specific post
app.get('/api/posts/:id', async(req, res) => {
    try {
        console.log("get a post with route parameter  request has arrived");
        // The req.params property is an object containing properties mapped to the named route "parameters". 
        // For example, if you have the route /posts/:id, then the "id" property is available as req.params.id.
        const { id } = req.params; // assigning all route "parameters" to the id "object"
        const posts = await pool.query( // pool.query runs a single query on the database.
            //$1 is mapped to the first element of { id } (which is just the value of id). 
            "SELECT * FROM posttable WHERE id = $1", [id]
        );
        res.json(posts.rows[0]); 
// we already know that the row array contains a single element, and here we are trying to access it
        // The res.json() function sends a JSON response. 
        // This method sends a response (with the correct content-type) that is the parameter converted to a JSON string using the JSON.stringify() method.
    } catch (err) {
        console.error(err.message);
    }
});

//update a specific post
app.put('/api/posts/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const post = req.body;
        console.log("update request has arrived");
        const updatepost = await pool.query(
            "UPDATE posttable SET (body, time) = ($2, $3) WHERE id = $1", [id, post.body, post.TIMESTAMP]
        );
        res.json(updatepost);
    } catch (err) {
        console.error(err.message);
    }
});

//get all posts
app.get('/api/posts', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM posttable ORDER BY time DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

//delete all posts
app.delete('/api/posts', async (req, res) => {
  try {
    await pool.query('DELETE FROM posttable'); // delete all rows
    res.status(200).json({ message: 'All posts deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete posts' });
  }
});

app.get('/',(req, res) =>{
    res.sendFile('./views/homepage.html', {root: __dirname })
});