const path = require("path");
const http = require("http");
const express =  require( "express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const dataFormat = require("./backend/dataFormat/dataFormat");
const io =socketio(server);
const {clientJoin,
       clientLeave,
       getCurrentClient,
       getAllClients
     }  = require("./backend/controllers/clientsController");

     
// Setitng the directory to the file
app.use(express.static(path.join(__dirname,"frontend")));


io.on("connection",socket => {
     console.log("Connection is opened ");

     //Client Joined
     socket.on("clientJoined",({ username,roomname })=> {
          const client  = clientJoin(socket.id,username,roomname);
               socket.join(client.roomname)
               //Client welcome message
               socket.emit("message",dataFormat('', `Welcome ${client.username} to  ${client.roomname} room`));
               //Broadcasting when client  is connected 
               socket.broadcast.to(client.roomname)
               .emit('message',dataFormat('',`${client.username} has joined the chat`));
                // When new client join the chat update
               clientList(client.roomname)
     });

      //If the message is recieved 
      socket.on("sendMessage",(data)=>{
          const currentClient =  getCurrentClient(socket.id);
               io.to(currentClient.roomname).emit("message",dataFormat(currentClient.username,data.msg,data.msgId,data.time));
     })
     // Editting message
     socket.on("editMessage",(data) =>{
          const currentClient =  getCurrentClient(socket.id);
               io.to(currentClient.roomname).emit("editMessage",dataFormat(currentClient.username,data.msg,data.msgId,data.time));
               socket.broadcast.to(currentClient.roomname).emit('message',dataFormat('',`${currentClient.username} has edited a message`));
     });
     // Deleting message
     socket.on("deleteMessage",(data) =>{
           const currentClient =  getCurrentClient(socket.id);
                io.to(currentClient.roomname).emit("deleteMessage",dataFormat(currentClient.username,data.msg,data.msgId,data.time));
                socket.broadcast.to(currentClient.roomname).emit('message',dataFormat('',`${currentClient.username} has deleted a message`));
     });
  
     socket.on("disconnect",() => {
          const currentClient =  clientLeave(socket.id);
          if(currentClient){
               io.to(currentClient.roomname).emit("message",messageData('',` ${currentClient.username} has left the chat`));
               clientList(currentClient.roomname)
          }
     });
      function clientList(roomname) {
          io.to(roomname).emit('allClients',{
               roomname: roomname,
               clients: getAllClients(roomname)
          });
     }

});

const PORT = 8000 || process.env.PORT;
server.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));