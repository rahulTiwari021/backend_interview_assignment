const express = require('express');
const jwt = require('jsonwebtoken');
const { request } = require('graphql-request');
const { auth } = require('./auth-middleware');
const routes = express.Router();

const secretKey = process.env.SECRET_KEY || 'mysecretkey';
const API_URL = 'http://localhost:8080/v1/graphql';
  

routes.get('/', (req, res) => {
    res.send('Hello World!');
});

routes.post('/login', (req, res) => {
    // TODO implement user verification. Keeping static now as there is no unique email or mobile and password to login and verify
    const token = jwt.sign({ username: 'rahul' }, secretKey);
    res.send({ token });
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
                gender
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
