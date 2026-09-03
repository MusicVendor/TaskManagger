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
            newUser = true;
            queryText = `INSERT INTO users (
                google_id,
                email,
                first_name,
                last_name)
                VALUES ($1, $2, $3, $4) RETURNING *`;
            result = await query(queryText, [googleId, email, firstName, lastName]);
            user = result.rows[0];
            
            try{
                queryText = `INSERT INTO projects 
                        (name) VALUES($1) RETURNING *`;

                result = await query(queryText, ['Your Projects']);
                let project = result.rows[0];
                const projectId = project.id;
                //console.log(projectId);

                queryText = `INSERT INTO project_members (
                        project_id,
                        user_id)
                        VALUES ($1, $2) RETURNING *`;
                
                result = await query(queryText, [projectId, user.id]);
                //let members = result.rows[0];
                //console.log(members);

                queryText = `INSERT INTO tasks (
                        created_by,
                        project_id,
                        user_assigned,
                        task_name,
                        task_description,
                        task_status,
                        end_date)
                        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
                
                result = await query(queryText, [user.id, projectId, [user.id], 'Welcome to Task Manager', 'This is your first task. You can edit or delete it.', 'to-do', '2024-12-31']);
                let task = result.rows[0];
                console.log('Task created:', task);

                result = await query(queryText, [user.id, projectId, [user.id], 'Grocery Shopping', 'Buy groceries for the week.', 'completed', '2024-12-31']);
                task = result.rows[0];
                console.log('Task created:', task);

                result = await query(queryText, [user.id, projectId, [user.id], 'Take Tom for a walk', 'Evening walk with Tom.', 'in-progress', '2024-12-31']);
                task = result.rows[0];
                console.log('Task created:', task);

                result = await query(queryText, [user.id, projectId, [user.id], 'Send the mail', 'Send the email to the client.', 'in-progress', '2024-12-31']);
                task = result.rows[0];
                console.log('Task created:', task);

            } catch(err){
                console.log('Error in creating projects', err);
            }
        }

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