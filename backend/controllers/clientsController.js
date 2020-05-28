const clients = [];
// Current client leaves

// Client  joins to the chat 
function clientJoin(id,username,roomname){
     const client = {id,username,roomname};
          clients.push(client);
     return client;
}
// Client leaves the chat
 function clientLeave(id){
     const idx = clients.findIndex(client => client.id === id)
          if(idx !== -1){
               return clients.splice(idx, 1)[0];
          }
}
// Get current client/user

//Getting all clients
module.exports = {
     clientJoin,
     clientLeave,
}
