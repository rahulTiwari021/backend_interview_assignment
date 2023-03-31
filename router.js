const express = require('express');
const jwt = require('jsonwebtoken');
const { request } = require('graphql-request');
const routes = express.Router();

const secretKey = process.env.SECRET_KEY || 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdlatRjRjogo3WojgGHFHYLugd\nUWAY9iR3fy4arWNA1KoS8kVw33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQs\nHUfQrSDv+MuSUMAe8jzKE4qW+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5D\no2kQ+X5xK9cipRgEKwIDAQAB';
const API_URL = 'http://localhost:8080/v1/graphql';

routes.post('/login', (req, res) => {
    const token = jwt.sign({
        "https://hasura.io/jwt/claims": {
            "x-hasura-default-role": "role1",
            "x-hasura-allowed-roles": ["role1"]
        }
    }, secretKey);
    res.send({ token });
});

routes.post('/find-nearby-users', auth, async (req, res) => {
    const { user_id, distance_kms } = req.body;
    const token = req.headers.authorization;
    console.log('token = ', token);
    try {
        const query = `query {
            search_nearby_users_id(args: {distance_kms: ${distance_kms}, userid: ${user_id}}) {
                first_name
                gender
                last_name
                nearby_users
                user_id
            }
        }`;

        const requestHeaders = {
            'authorization': `${token}`,
            'x-hasura-admin-secret': 'myadminsecretkey'
        }
        const data = await request(API_URL, query, {}, requestHeaders);
        const result = data.search_nearby_users_id[0].nearby_users;

        const formattedResponse = result.map(item => {
            return {
                first_name: item.first_name,
                last_name: item.last_name,
                gender: item.gender,
                user_id: item.user_id,
                location: {
                    lat: item.lat,
                    lng: item.lng
                }
            }
        });
        console.log('Data = ', formattedResponse);
        res.json(formattedResponse);

    } catch (error) {
        console.log('Error occured while searching nearby users = ', error);
        res.status(500).send(error);
    }
});


exports.routes = routes;
