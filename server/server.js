require('dotenv').config();
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const app = express();
const server = http.createServer(app);
const {query} = require('./config/db');
const {buildSchema} = require('./models/Index.js');
const  login = require('./routes/login.js');
const projects = require('./routes/projectsRoutes.js');
const tasks = require('./routes/taskRoutes.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const verifyJWT = require('./middleware/verifyJWT');

//Working with DB
//const mongoose = require('mongoose');
//const connectDB = require('./config/connectDB');
//const { verify } = require('jsonwebtoken');
const PORT = process.env.PORT || 0

//Connecting with DB
//connectDB();

//built-in middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//Socket IO configurations
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use((req, res, next) => {
  console.log("Incoming Method:", req.method, req.url);
  console.log("Incoming Content-Type:", req.headers['content-type']);
  next();
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

//Public Routes
app.use('/login', login); //User Login Route
// app.use('/register', require('./routes/register')); //User Registration Route
// app.use('/refreshToken', require('./routes/refresh')); //Generate access token when Expired
// app.use('/logout', require('./routes/logout')); //Logout Route

app.use(verifyJWT); //Checks user authentication after every request made below
//Protected Routes
app.use('/projects', projects);
app.use('/edit/project', projects);
app.use('/delete/project', projects);
app.use('/create/project', projects);
app.use('/tasks', tasks);
app.use('/status/tasks', tasks);
app.use('/delete/task', tasks);


io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join_project", (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`Socket Id:${socket.id} join the project room: ${projectId}`);
  });

  socket.on("leave_project", (projectId) => {
    socket.leave(`project_${projectId}`);
    console.log(`Socket Id:${socket.id} left the project room:${projectId}`);
  });

  socket.on("disconnect", () =>{
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, async () =>{
  try {
    await buildSchema();
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error('Error building schema:', err);
  }
});