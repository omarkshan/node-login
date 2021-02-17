require('dotenv').config();
const express = require('express');
const server = express();

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
            res.send('Success');
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send();
    }
})

server.listen(process.env.PORT, ()=> {
    console.log(`Server is listening on port ${process.env.PORT}`);
});