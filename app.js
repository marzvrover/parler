//Express Server

var http = require('http');
var express = require('express'),
    app = module.exports.app = express();
var redis = require('node-redis');

/*
app.enable('trust proxy');

app.use (function (req, res, next) {
    if (req.secure) next();
    else res.redirect('https://' + req.headers.host + req.url);
});*/

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance


    credentials =  {
        "hostname": "pub-redis-13435.dal-05.1.sl.garantiadata.com",
        "password": "UNysCHyMqD5tesob",
        "port": 13435
      };
var redisClient = redis.createClient(credentials.port, credentials.hostname, credentials.password);
//var redisClient = redis.createClient(6379, '127.0.0.1');

//Server Setup
port = process.env.VCAP_APP_PORT ? process.env.VCAP_APP_PORT : 80;
//port = 80;

server.listen(port, function() {
              console.log("Starting project Gibber v0.3.4" + '\n' + "Listening on port " + port);
              });  //listen on port 80


app.get('/', function (req, res) {
        res.sendFile(__dirname + '/HTML/index.html');
        });
app.get('/JavaScript/jquery-2.1.3.min.js', function (req, res) {
        res.sendFile(__dirname + '/HTML/JavaScript/JQuery.js');
        });
app.get('/JavaScript/main.js', function (req, res) {
        res.sendFile(__dirname + '/HTML/JavaScript/main.js');
        });
app.get('/CSS/main.css', function (req, res) {
        res.sendFile(__dirname + '/HTML/CSS/main.css');
        });

/*app.get('/Gibber.zip', function(req, res) {
        res.sendFile(__dirname + '/HTML/Gibber.zip');
        });//*/

//GENERAL
function log(data) {
    console.log(data);
}

//Chat Server Setup
var users = {};
    users.list = [];
var msgNum = 1;

io.on('connection', function (socket) {
      sendFromRedis(socket);

      socket.on('addUser', function (data) {
                if (users.list.indexOf(data.username) == -1) {
                    users[socket.id] = data.username;
                    users.list[users.list.length] = data.username;
                    socket.emit('addUser', true);
                    io.sockets.emit('getUsers', users.list);
                    log(socket.id + " : " + users[socket.id] + " connected");
                }
                else socket.emit('addUser', false);
                });

      /*socket.on('getUsers', function (data) {
                socket.emit('getUsers', users.list);
                log(socket.id + " connected as " + data.username);
                });*/
      socket.on('message', function (data) {
                log(data.sender + " : " + data.message);
                msgNum++;
                data.msgNum = msgNum;
                io.sockets.emit('message', data);
                addToRedis(data);
                });



      socket.on('disconnect', function () {
                console.log(socket.id + " : " + users[socket.id] + " disconnected");
                index = users.list.indexOf(users[socket.id]);
                if (index > -1) users.list.splice(index, 1);
                delete users[socket.id];
                io.sockets.emit('getUsers', users.list);
                });
      });
//REDIS
function addToRedis(data) {
    redisClient.lpush('messages', JSON.stringify(data));
    redisClient.ltrim('messages', 0, 99);
}
function sendFromRedis(socket) {
    redisClient.lrange('messages',0,-1, function (err, reply) {
        reply.reverse();
        for (var i = 0, len = reply.length; i < len; i++) {
            socket.emit('message', JSON.parse(reply[i].toString()));
        }
        });
}
