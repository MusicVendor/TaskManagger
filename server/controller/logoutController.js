const {query} = require('../config/db');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    const cookieOptions = {
        httpOnly: true,
        sameSite: 'None',
        secure: process.env.NODE_ENV === 'production'
    };

    if(!cookies?.jwt) return res.clearCookie('jwt', cookieOptions).sendStatus(204);
    const refreshToken = cookies.jwt;

    try {
        await query(
            'UPDATE users SET refresh_token = NULL WHERE refresh_token = $1',
            [refreshToken]
        );
    } catch (err) {
        console.error('Error clearing refresh token:', err);
        return res.clearCookie('jwt', cookieOptions).sendStatus(500);
    }

    res.clearCookie('jwt', cookieOptions).sendStatus(204);
}

module.exports = {handleLogout};