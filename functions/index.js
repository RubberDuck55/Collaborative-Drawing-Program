const functions = require('firebase-functions');

var express = require('express');

var app = express();
var server = app.listen('3000');

app.use(express.static('public'));

console.log("Running at port 3000");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
	console.log("New connection at: " + socket.id);
	var newConn = {
		nm: "Bot",
	  txt: "New Connection: " + socket.id
  };
	io.sockets.emit('geted', newConn);

	socket.on('mouse', mouseMsg);
	socket.on('newMsg', sendMsg);

	function mouseMsg(d){
		socket.broadcast.emit('mouse', d);
	}


	function sendMsg(m){
		var amorpm = "AM"
		var d = new Date();
		var h = d.getHours();
		//h++;
		if(h > 12){h-=12; amorpm = "PM"}
		io.sockets.emit('geted', m);
		//console.log(m.txt);
		if(m.txt == '?time'){
			//console.log(h);
			var botcmd = {
				nm: "Bot",
				txt: amorpm + " " + h + ":" + d.getMinutes()
			}
			io.sockets.emit('geted', botcmd);
		}
		if(m.txt == '?clear'){
			io.sockets.emit('clear', "clear! bzz");
		}
		if(split(m.txt, " ")[0] == '?image'){
			io.sockets.emit('img', split(m.txt, " ")[1]);
		}
	}
}
