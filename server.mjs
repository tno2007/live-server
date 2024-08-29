const SERVER_PORT = 3001;
const REFRESHCSS_OR_RELOAD = "refreshcss";

import express from "express";
const app = express();
import { createServer } from "http";
const server = createServer(app);
import { Server } from "socket.io";
const io = new Server(server);
import path from 'path';
import Watcher from 'watcher';

const __dirname = path.resolve(path.dirname('')); 

const watcher = new Watcher ( __dirname +  '/public' );

watcher.on ( 'error', error => {
  console.log ( error instanceof Error ); // => true, "Error" instances are always provided on "error"
});

watcher.on ( 'change', () => {
  console.log ( 'Something changed in the file system' );
  switch(REFRESHCSS_OR_RELOAD) {
	case "reload":
		io.emit('message', { data: 'reload' });
		break;
	case "refreshcss":
	default:
		io.emit('message', { data: 'refreshcss' });	
		break;
  }  
});

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a client connected");
});

server.listen(SERVER_PORT || 3000, () => {
  console.log(`listening on *:${SERVER_PORT}`);
});
