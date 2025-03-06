const express = require('express')
const {Server, Socket} = require('socket.io')
const bodyParser = require('body-parser')

const app = express();
const io = new Server({
    cors:true,
});

app.use(bodyParser.json());

const emailToScoketMapping = new Map();

io.on('connection', (socket) =>{
    console.log("New connection");
    socket.on('join-room', data =>{
        const {roomId, emailId} = data;
        console.log('User', emailId, 'joined room', roomId);
        emailToScoketMapping.set(emailId,socket.id);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-joined',{emailId});
    })
});

app.listen(8000, ()=> console.log('Http server running at PORT 8000'));
io.listen(8001);