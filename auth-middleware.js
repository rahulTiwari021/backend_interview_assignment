const { expressjwt: jwt } = require('express-jwt');

const secretKey = process.env.SECRET_KEY || 'mysecretkey';

const auth = jwt({
    secret: secretKey,
    algorithms: ['HS256'],
    userProperty: 'user',
});

exports.auth = auth;