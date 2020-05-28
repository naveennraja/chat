/** */
(function(){
     $('.menu .item').tab();
     // Variable Declarations
     const chatForm = document.getElementById("chat-form");
     const conversation = document.querySelector(".conversation-list"); 
     //Getting the username from the url 
     const params = (new URL(document.location)).searchParams;
     const username = params.get("username");
     const roomname = params.get("roomname");
     const date = new Date();
     
}());
     


