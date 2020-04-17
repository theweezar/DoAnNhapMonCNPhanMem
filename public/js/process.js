$(function(){
  const socket = io();
  // console.log(socket);
  socket.emit("CONNECT_TO_SERVER",{username:USERNAME});
  FRAME.textArea.keyup(function(e){ // Type enter and the msg will be sent to server
    if (e.keyCode === 13){
      var msg = $(this).val().split("\n")[0];

      if (msg.trim() !== ""){
        // Show the msg in chatbox
        loadMsg(true,msg);
        socket.emit("MESSAGE_USER_TO_USER",{
          senderUsername: USERNAME,
          rcvUsername: window.location.pathname.split("/")[3],
          msg: msg
        });
      }

      $(this).val("");
    }
  }).keydown(function(e){ // Avoid creating massive space
    if (e.keyCode === 13){
      $(this).val($(this).val().trim());
    }
  });
  socket.on(`MESSAGE_TO_${USERNAME}`,function(d){
    console.log(d);
    loadMsg(false,d);
  })

  FRAME.friendTag.click(function(e){
    e.preventDefault();
    var url = $(this).attr("href");
    history.pushState("","",url);
    if ($(this).attr("rcv-type") === "user"){
      socket.emit("USER_CONNECT_USER",{
        senderUsername:USERNAME,
        senderID:ID,
        rcvUsername:url.split("/")[3]
      });
    }
    else if($(this).attr("rcv-type") === "group"){
      socket.emit("USER_CONNECT_GROUP",{});
    }
    socket.on(`HISTORY_USER_USER_${USERNAME}`,function(d){
      console.log(d);
      loadHistoryChat(d.historyChat);
      socket.removeListener(`HISTORY_USER_USER_${USERNAME}`);
    })
  })
});