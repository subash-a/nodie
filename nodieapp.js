
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];
app.use(express.logger());
app.use(express.static(__dirname+'/public'));

io.sockets.on('connection',function(socket){
    socket.emit("connectionsuccess",{"name":"subash"});
    console.log("Connection Success");
    
    socket.on("registeruser",function(data){
        users.push(data.username);
        console.log("user registered");
        console.log(users);
        socket.broadcast.emit("joined",{"user":data.username});
        socket.emit('userregistered',{"users":users});
    });
    
    socket.on("messagesent",function(data){
        console.log("message broadcast");
        socket.broadcast.emit("messagereceived",data);
    });
    
    socket.on("disconnecting",function(data){
       socket.broadcast.emit("left",{"user":data.username}); 
    });
});

server.listen(process.env.PORT,process.env.IP);