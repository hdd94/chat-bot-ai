let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let python = require('python-shell').PythonShell;

let fs = require("fs");
let mongo = require('mongodb');
let moment = require('moment');

var textAnimals = fs.readFileSync("./animals.txt").toString('utf-8');
let textArrayAnimals = textAnimals.split("\n");

var textColors = fs.readFileSync("./colors.txt").toString('utf-8');
let textArrayColors = textColors.split("\n");

var textColorsHex = fs.readFileSync("./colors-hex.txt").toString('utf-8');
let textArrayColorsHex = textColorsHex.split("\n");

var options = {
    path: "virtualenv/lib/python3.7",
    scriptPath: 'Python/',
}
const path = './db.sqlite3';

// console.log("Learning DB exists: " + fs.existsSync(path))
// if (!fs.existsSync(path))
//     try {
//         python.run('init.py', options, function (err, results) {
//             console.log(err);
//             console.log(results);
//         });
//     }
//     catch (err) {
//         console.log(err);
//     }
// Socket Stuff
io.on('connection', (socket) => {

    socket.on('disconnect', function () {
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
        // var options = {
        //     path: "virtualenv/lib/python3.7/site-packages",
        //     scriptPath: 'Python/',
        //     args: [message.text]
        // }
        // console.log(socket.username + ": " + message.text);
        io.emit('message', { msg: message.text, user: message.user, color: message.color, createdAt: new Date() });
        // try {
        //     python.run('chat.py', options, function (err, results) {
        //         console.log(err);
        //         console.log(results[0]);
        //         io.emit('message', { msg: results[0], user: "Dark Robotini", color: "#56e3ff", createdAt: new Date() });
        //     });
        // } catch (err) {
        //     console.log(err);
        // }
    });
});

// Express Server
var port = process.env.PORT || 3004;

server.listen(port, function () {
    console.log('listening in http://localhost:' + port);
});