const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('./auth-middleware');
const routes = express.Router();

const secretKey = process.env.SECRET_KEY || 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdlatRjRjogo3WojgGHFHYLugd\nUWAY9iR3fy4arWNA1KoS8kVw33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQs\nHUfQrSDv+MuSUMAe8jzKE4qW+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5D\no2kQ+X5xK9cipRgEKwIDAQAB';
  

routes.get('/', (req, res) => {
    res.send('Hello World!');
});

routes.post('/login', (req, res) => {
    // TODO implement user verification. Keeping static now as there is no unique email or mobile and password to login and verify
    const token = jwt.sign({
       "https://hasura.io/jwt/claims": {
           "x-hasura-default-role": "role1",
           "x-hasura-allowed-roles": ["role1"]
        }
    }, secretKey);
    res.send({ token });
});

routes.post('/verify-jwt', auth, (req, res) => {
    res.send('Success');
});


exports.routes = routes;
