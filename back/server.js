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

const secret = "gdgdhdbcb770785rgdzqws";
const maxAge = 60 * 60;

const generateJWT = (id) =>{
    return jwt.sign({id}, secret, { expiresIn : maxAge })
}

app.listen(port, () => {
    console.log("Server is listening to port " + port)
});
//create a new post
 app.post('/api/posts/', async(req, res) => {
    try {
        console.log("a post request has arrived");
        const post = req.body;
        const newpost = await pool.query(
            "INSERT INTO posttable(body) values ($1)    RETURNING*", [post.body]
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
            "UPDATE posttable SET (body) = ($2) WHERE id = $1", [id, post.body]
        );
        res.json(updatepost);
    } catch (err) {
        console.error(err.message);
    }
});
function validationError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  err.isValidation = true;
  return err;
}
//signing up a new user
app.post('/auth/signup', async(req,res) =>{
    try{
    console.log("a signup request has arrived");
    const  { email, password } = req.body;
    if (!email || !password) {
      throw validationError("Email and password are required");
    }
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(email)){
        throw validationError("Invalid email");
    }
    const passwordConstrictions = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!passwordConstrictions.test(password)){
        throw validationError("Invalid password, password has to be at least 8 characters, contain a letter, an uppercase letter, a number and a symbol");
    }
    const salt = await bcrypt.genSalt();
    const bcryptPassword = await bcrypt.hash(password, salt) 
    
    const authUser = await pool.query(
        "INSERT INTO users(email, password) values ($1, $2) RETURNING *", [email, bcryptPassword]
    );

    console.log(authUser.rows[0].id);
    const token = await generateJWT(authUser.rows[0].id);

    res
    .status(201)
    .cookie('jwt', token, { maxAge: 6000000, httpOnly: true })
    .json({user_id: authUser.rows[0].id})
    .send;
} catch (err){
    console.error(err.message);
    res.status(400).send(err.message);
}
});

//logging in
app.post('/auth/login', async(req, res) => {
    try{
        console.log("a login request has arrived");
        const { email, password } = req.body;
        if (!email || !password) {
            throw validationError("Email and password are required");
        }
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0){
            throw validationError("User is not registered");
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if(!validPassword) throw validationError("Password is incorrect" );

        const token = await generateJWT(user.rows[0].id);
        console.log(token);
        res.cookie("isAuthorized", true, { maxAge: 1000 * 60, httpOnly: true });
        res.cookie('jwt', token, { maxAge: 6000000, httpOnly: true });
        res 
            .status(201)
            .cookie('jwt', token, { maxAge: 6000000, httpOnly: true })
            .json({ user_id: user.rows[0].id })
            .send;
    } catch (err) {
        res.status(401).json({ error: err.message });
    }

});

//checking authentication
app.get('/auth/authenticate', async(req, res) => {
    console.log('authentication request');
    const token = req.cookies.jwt;

    let authenticated = false;
    try{
        if (token){
            await jwt.verify(token, secret, (err)=> {
                if (err) {
                    console.log(err.message);
                    console.log('token not verified');
                    res.send({ "authenticated": authenticated });
                } else {
                    console.log('author authenticated');
                    authenticated = true;
                    res.send({ "authenticated": authenticated});
                }
            })
        } else {
            console.log('author not authenticated, token does not exist');
            res.send({"authenticated" : authenticated});
        }
    } catch (err) {
        console.error(err.message);
        res.status(400).send(err.message);
    }
});
//logout a user = deletes the jwt
app.get('/auth/logout', (req, res) => {
    console.log('delete jwt request arrived');
    res.status(202).clearCookie('jwt').json({ "Msg": "cookie cleared" }).send
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