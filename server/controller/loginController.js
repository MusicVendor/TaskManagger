//const User = require('../models/User');
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const {query} = require('../config/db');
const {createJWT} = require('../middleware/createJWT');

const client = new OAuth2Client();

const handleOAuthLogin = async (req, res) => {
    const {token} = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token, 
            audience: process.env.CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const googleId = payload['sub'];
        const email = payload['email'];
        const firstName = payload['given_name'];
        const lastName = payload['family_name'];

        let queryText = `SELECT * FROM users WHERE email = $1`;
        let result = await query(queryText, [email]);

        let user = result.rows[0];

        if( !user) {
            queryText = `INSERT INTO users (
                google_id,
                email,
                first_name,
                last_name)
                VALUES ($1, $2, $3, $4) RETURNING *`;
            result = await query(queryText, [googleId, email, firstName, lastName]);
            user = result.rows[0];            
        }

        res.status(200).json({ message: 'User authenticated successfully', user });

        const userId = user.id;     
        const {accessToken, refreshToken} = await createJWT(userId, email);
        
        res.cookie(
            'jwt',
            refreshToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000
            }
        );

        return res.status(200).json({message: 'User authenticated successfully', user, accessToken});
    } catch (error) {
        console.error('Error verifying Google ID token:', error);
        res.status(401).json({ message: 'Invalid Google ID token' });
    }
}

module.exports = { handleOAuthLogin };