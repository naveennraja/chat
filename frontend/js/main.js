/** */
(function(){
     // Variable Declarations
     const conversation = document.querySelector(".conversation-list"); 
     //Getting the username from the url 
     const params = (new URL(document.location)).searchParams;
     const username = params.get("username");
     const roomname = params.get("roomname");
     const date = new Date();
     const socket = io();
     //Decorations
     $('.menu .item').tab();
     $("#room-name").text(roomname);

     /** All Socket  */
     //Room joining message
          socket.emit("clientJoined",{username,roomname});
          
          // Sending the message
          socket.on("message",data => {
               //displayMessage(message);
               console.log("message recieved",data)
               
          });
          //Editing the message 
          socket.on("editMessage",(data)=>{
               console.log("edit message ",data);
               
          });
          //Deleting the message 
          socket.on("deleteMessage",(data)=>{
               console.log("Message deleted",data);
               
          });
     /** DOM Manipulattion */
     $( "#chat-form" ).submit(function( e ) {
          e.preventDefault();
          const data = {
               msg : $("#message").val(),
               msgId : Date.now(),
               time : `${date.getHours()} : ${date.getMinutes()}`
          }; 
          socket.emit("sendMessage",data); // Sending a message to the server
          $("#message").val("").focus();
     });
     /** common functions */
     
}());
     


