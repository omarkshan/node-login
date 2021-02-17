require('dotenv').config();
const express = require('express');
const server = express();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

server.use(express.json());

const users = [];

server.get('/users', (req, res) => {
    res.json(users)
});

server.post('/users', async (req,res) => {
    try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

server.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name = req.body.name);
    if (user === null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if ( await bcrypt.compare(req.body.password, user.password)) {
            jwt.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30s' }, (err, token) => {
                res.json({
                    token
                });
            });
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send();
    }
})

server.post('/users/dashboard', verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if (err) {
            res.status(403).send();
        } else {
            res.json({
                message: 'Logged In...',
                authData
            })
        }
    })
})

server.listen(process.env.PORT, ()=> {
    console.log(`Server is listening on port ${process.env.PORT}`);
});

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}
