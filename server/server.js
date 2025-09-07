require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const verifyJWT = require('./middleware/verifyJWT');

//Working with DB
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const { verify } = require('jsonwebtoken');
const PORT = process.env.PORT || 0

//Connecting with DB
connectDB();

//built-in middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());


//Routes
app.use('/register', require('./routes/register')); //User Registration Route
app.use('/auth', require('./routes/auth')); //User Authorization Route
app.use('/refreshToken', require('./routes/refresh')); //Generate access token when Expired
app.use('/logout', require('./routes/logout')); //Logout Route

app.use(verifyJWT); //Checks user authentication after every request made below

app.use('/Home', require('./routes/projectsRoutes')); //Build the list of projects user is related to
//Create PUT routes --WITH FRONTEND --
app.use('/Home/Task', require('./routes/taskRoutes'));




mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});