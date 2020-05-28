/** */
(function(){
     // Variable Declarations
     //Getting the username from the url 
     const params = (new URL(document.location)).searchParams;
     const username = params.get("username");
     const roomname = params.get("roomname");
     const socket = io();
     
     //Decorations
     $('.menu .item').tab();
     $("#room-name").text(roomname);

     /** All Socket  */
     //Room joining message
          socket.emit("clientJoined",{username,roomname});
          // Checking all clients who are present 
          socket.on("allClients",(data) =>{
               // console.log("All Clients-----",data);
                displayClients(data.clients)
                console.log(data.clients);
                $(`*[data-tab="people"]`).find("span").text(`(${ data.clients.length })`)
           })
          // Sending the message
          socket.on("message",data => {
               displayMessage(data);
               $(".conversation-list").animate({"scrollTop": $(".conversation-list")[0].scrollHeight}, "slow");               
          });
          //Editing the message 
          socket.on("editMessage",(data)=>{
               const date = new Date();
               $(`*[data-key="${data.msgId}"]`).find("span.label")
               .text(`Edited Message at ${date.getHours()} : ${(date.getMinutes()<10?'0':'') + date.getMinutes()}`);
               $(`*[data-key="${data.msgId}"]`).find(".message-content").text(data.msg);
               //console.log("edit message ",data);
               
          });
          //Deleting the message 
          socket.on("deleteMessage",(data)=>{
               $(`*[data-key="${data.msgId}"]`).find(".message-content").text(data.msg);
               $(`*[data-key="${data.msgId}"]`).find(".action-list").remove();
               //console.log("Message deleted",data);
          });
     /** DOM Manipulattion */
     $( "#chat-form" ).submit(function( e ) {
          e.preventDefault();
          const date = new Date();
          const data = {
               msg : $("#message").val(),
               msgId : Date.now(),
               time : `${date.getHours()} : ${(date.getMinutes()<10?'0':'') + date.getMinutes()}`
          }; 
          socket.emit("sendMessage",data); // Sending a message to the server
          $("#message").val("").focus();
     });
     // On edit delete click
     $(document).on("click",".action-list > .item i",(evt)=> {
          const currentElement = evt.target;
               $(currentElement).parents(".ui.message").addClass("update");
               if($(currentElement).hasClass("edit")){
                    $(".Delete").hide(); // Hiding delete button
                    $("#editMessage, .Save").show();
                    $("#editMessage").val($(".update").find(".message-content").text());
                    $(".poup-message").text("Please edit your message");
               } else {
                    $("#editMessage, .Save").hide();
                    $(".Delete").show();
                    $(".poup-message").text("Are you sure you want to delete the message ?");
               }
               $('.modal.small').modal('show');
    });
       // Updating the message 
     $(document).on("click",".Save",function(){
          const date = new Date();
          let currentText = $(".update").find(".message-content").text();
               if(currentText !== $("#editMessage").val()) {
                    $(".update").find(".message-content").text($("#editMessage").val())
                    data =  { 
                         msg : $("#editMessage").val(), 
                         msgId : $(".update").data("key"),
                         time : `${date.getHours()} : ${(date.getMinutes()<10?'0':'') + date.getMinutes()}`
                    }
                    socket.emit("editMessage",data);
               }
          $(".ui.message").removeClass("update");
          $('.modal.small').modal('hide');
     });
      // Deleting the message 
     $(document).on("click",".Delete",function(){
          const date = new Date();
          const delText = "Deleted this message";
          $(".update").find(".message-content > p").text(delText);
               data = { 
                    msg : delText , 
                    msgId : $(".update").data("key"),
                    time : `${date.getHours()} : ${(date.getMinutes()<10?'0':'') + date.getMinutes()}`
               }
               socket.emit("deleteMessage",data);
               $(".ui.message").removeClass("update");
               $('.modal.small').modal('hide');
     });
     /** common functions */
     function displayMessage( data ){
          const time =  data.time  !== undefined ? `<div class="ui label time">${data.time}<span class='ui label'></span></div>` : "";
          $(".conversation-list").append(`
               <div class = 'ui message'${ data.msgId !== undefined ? "data-key ="+data.msgId : "" }>
                     <div class="message-header">
                         <div class="ui header left floated">${data.username}
                              ${time}
                         </div>
                         ${data.username === username ? addOptions() : "" }
                    </div>
                    <div class=" message-content content"> ${convertUrlToAnchor(data.msg)} </div>
               </div>`);
     }
     function convertUrlToAnchor(text) {
          var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
          return text.replace(urlRegex, function(url) {
              return ` <a target="_blank" href= ${url}>${url}</a> ` ;
          });
      }
      function addOptions() {
          return (`<div class="ui right floated header">
                         <div class="ui large horizontal divided list action-list">
                              <div class="item"><i class="edit outline icon"></i></div>
                              <div class="item"><i class="trash alternate outline icon"></i></div>
                         </div>
                    </div>`  
          )
     }
     function displayClients( clients ){
          $("#client-list").empty().append(`
          ${clients.map(client => 
               `<div class="ui middle aligned selection list" id="users">
                    <div class="item">
                         <div class="content">
                              <div class="header">${client.username}</div>
                         </div>
                    </div>
               </div>`).join("")
          }`);
     }
}());
     


