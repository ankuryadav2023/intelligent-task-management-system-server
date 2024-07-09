const express = require('express');
require('dotenv').config();
const { Server } = require('socket.io');
const cors = require('cors');
const establishConnectionToDB = require('./mongodb');
const apiRouter = require('./Routes/api');

const app = express();

establishConnectionToDB();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

const server = app.listen(process.env.PORT, error => {
    if (error) console.log('Error: ', error);
    else console.log('Server Started Successfully at port ', process.env.PORT);
});

const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', socket => {
    console.log('New Connection Established with ', socket.id);
    socket.on('join-room', roomID => {
        socket.join(roomID);
        socket.emit('room-joined');
    });
    socket.on('new-project-created',(organizationID,projectName)=>{
        socket.broadcast.to(organizationID.split('(')[1].split(')')[0]).emit('new-project-created2',organizationID,projectName);
    })
    socket.on('new-task-created',(organizationID,organizationName,projectID,taskTitle)=>{
        socket.broadcast.to(organizationID).emit('new-task-created2',organizationID,organizationName,projectID,taskTitle);
    })
    socket.on('project-updated',(organizationID,organizationName,projectID,projectName)=>{
        socket.broadcast.to(organizationID).emit('project-updated2',organizationID,organizationName,projectID,projectName);
    })
    socket.on('task-updated',(organizationID,organizationName,projectID,taskTitle)=>{
        socket.broadcast.to(organizationID).emit('task-updated2',organizationID,organizationName,projectID,taskTitle);
    })
    socket.on('project-deleted',(organizationID,organizationName,projectID,projectName)=>{
        socket.broadcast.to(organizationID).emit('project-deleted2',organizationID,organizationName,projectID,projectName);
    })
    socket.on('task-deleted',(organizationID,organizationName,projectID,taskTitle)=>{
        socket.broadcast.to(organizationID).emit('task-deleted2',organizationID,organizationName,projectID,taskTitle);
    })
    socket.on('send-message',(organizationID,peerFullName,message)=>{
        socket.broadcast.to(organizationID).emit('recieve-message',peerFullName,message);
    })
});