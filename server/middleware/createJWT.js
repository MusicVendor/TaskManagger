const jwt = require('jsonwebtoken');
const http = require('http');
const {query} = require('../config/db');

const createJWT = async (userId, email) => {
    try {
        const accessToken = jwt.sign(
            { userId, email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10m' }
        );

        const refreshToken = jwt.sign(
            { userId, email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const queryText = `UPDATE users SET refresh_token = $1 WHERE id = $2`;
        await query(queryText, [refreshToken, userId]);

        return { accessToken, refreshToken };
    } catch (err) {
        console.error('Error creating JWT:', err);
        throw new Error('Internal server error');
    }
}

module.exports = {createJWT};