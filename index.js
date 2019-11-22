let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

let fs = require("fs");
let mongo = require('mongodb');
let moment = require('moment');


var textAnimals = fs.readFileSync("./animals.txt").toString('utf-8');
let textArrayAnimals = textAnimals.split("\n");

var textColors = fs.readFileSync("./colors.txt").toString('utf-8');
let textArrayColors = textColors.split("\n");

var textColorsHex = fs.readFileSync("./colors-hex.txt").toString('utf-8');
let textArrayColorsHex = textColorsHex.split("\n");

// Socket Stuff
io.on('connection', (socket) => {

    socket.on('disconnect', function() {
        io.emit('users-changed', { user: socket.username, event: 'left' });
    });

    // socket.on('set-name', (name) => {
    //     console.log('Set Name: ', name)
    //     socket.username = name;
    //     socket.emit('message', "this is a test");
    //     io.emit('users-changed', { user: name, event: 'joined' });
    // });

    socket.on('get-name', () => {
        let randomAnimal = textArrayAnimals[Math.floor(Math.random() * textArrayAnimals.length)]
        let randomNumber = Math.floor(Math.random() * textArrayColors.length);
        let randomColor = textArrayColors[randomNumber];
        let randomColorHex = textArrayColorsHex[randomNumber];
        let createdAt = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'); // November 21st 2019, 2:50:29 pm
        let userName = randomColor + " " + randomAnimal;
        console.log(createdAt + ": " + userName);
        socket.username = userName;
        socket.randomColorHex = randomColorHex;
        socket.emit('username', { randomColor: randomColor, randomColorHex: randomColorHex, randomAnimal: randomAnimal, userName: userName, createdAt: createdAt });
        io.emit('users-changed', { user: userName, event: 'joined' });
    });

    socket.on('send-message', (message) => {
        console.log(socket.username + ": " + message.text);
        io.emit('message', { msg: message.text, user: socket.username, color: socket.randomColorHex, createdAt: new Date() });
    });
});

// Express Server
var port = process.env.PORT || 3001;

server.listen(port, function() {
    console.log('listening in http://localhost:' + port);
});