const express = require('express');
const jwt = require('jsonwebtoken');
const { request } = require('graphql-request');
const { auth } = require('./auth-middleware');
const routes = express.Router();

const secretKey = process.env.SECRET_KEY || 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdlatRjRjogo3WojgGHFHYLugd\nUWAY9iR3fy4arWNA1KoS8kVw33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQs\nHUfQrSDv+MuSUMAe8jzKE4qW+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5D\no2kQ+X5xK9cipRgEKwIDAQAB';
const API_URL = 'http://localhost:8080/v1/graphql';
  

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

routes.post('/get-users', auth,  async (req, res) => {
    const { page_size, page_number } = req.body;
    const limit = page_size;
    const offset = page_number * page_size; 

    try {
        const query = `query {
            users(limit: ${limit}, offset: ${offset}) {
                id
                first_name
                last_name
            }
        }`;

        const data = await request(API_URL, query);
        res.json(data);
    } catch (error) {
        console.log('Error getting all users = ', error);
        res.status(500).send(error);
    }
});

routes.post('/find-nearby-users', auth, async (req, res) => {
    const { user_id, distance_kms } = req.body;
    try {
        const query = `query {
            search_nearby_users(args: {distance_kms: ${distance_kms}, userid: ${user_id}}) {
                location
                nearby_users
                user_id
                first_name
                gender
                last_name
            }
        }`;
        const data = await request(API_URL, query);
        res.json(data);

    } catch (error) {
        console.log('Error occured while searching nearby users = ', error);
        res.status(500).send(error);
    }
});


exports.routes = routes;
