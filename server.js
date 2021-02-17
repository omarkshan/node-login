require('dotenv').config();
const express = require('express');
const server = express();

const users = [];

server.get('/users', (req, res) => {
    res.json(users)
});

server.listen(process.env.PORT, ()=> {
    console.log(`Server is listening on port ${process.env.PORT}`);
});