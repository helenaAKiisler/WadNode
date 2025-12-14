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