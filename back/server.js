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
//signing up a new user
app.post('/auth/signup', async(req,res) =>{
    try{
    console.log("a signup request has arrived");
    const  { email, password } = req.body;

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
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) return res.status(401).json({error: "User is not registered"});

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if(!validPassword) return res.status(401).json({ error:"Password is incorrect" });

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