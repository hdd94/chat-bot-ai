let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

// Socket Stuff
io.on('connection', (socket) => {

    socket.on('disconnect', function() {
        io.emit('users-changed', { user: socket.username, event: 'left' });
    });

    socket.on('set-name', (name) => {
        console.log('Set Name: ', name)
        socket.username = name;
        io.emit('users-changed', { user: name, event: 'joined' });
    });

    socket.on('send-message', (message) => {
        console.log(message);
        io.emit('message', { msg: message.message, user: socket.username, createdAt: new Date() });
    });
});

// Express Server
var port = process.env.PORT || 3001;

server.listen(port, function() {
    console.log('listening in http://localhost:' + port);
});