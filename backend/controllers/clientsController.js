const clients = [];

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
 function getCurrentClient(id){
     return clients.find(client => client.id === id)
}
//Getting all clients
function getAllClients(roomname){
     return clients.filter(client => client.roomname === roomname)
}

module.exports = {
     clientJoin,
     clientLeave,
     getCurrentClient,
     getAllClients
}
