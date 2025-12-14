const express = require('express');
const pool = require('./database');
const cors = require('cors')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000;

const app = express();

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));

//app.use(express.json());  
app.use(cookieParser());  

app.use(express.json());


    //  Handling HTTP requests code will go here  

app.listen(port, () => {
    console.log("Server is listening to port " + port)
});

app.get('/',(req, res) =>{
    res.sendFile('./views/homepage.html', {root: __dirname })
});