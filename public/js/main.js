const FRAME = {
  textArea: $("#t_msg"),
  msgBox: $("#msg_box"),
  friendTag: $("a[role='link']") 
};

function loadMsg(isSender, msg){
  if (isSender){
    FRAME.msgBox.append(
      `<div class="sent-f">
        <div class="sent-ct">
          <div class="sent-ct-inb">
            <p>${msg}</p>
          </div>
        </div>
        <div class="sent-ava">
          <img src="../../icon/PngItem_5167304.png" alt="" srcset="">
        </div>
      </div>`
    );
  }
  else{
    FRAME.msgBox.append(
      `<div class="rcv-f">
        <div class="rcv-ava">
          <img src="../../icon/PngItem_5167304.png" alt="" srcset="">
        </div>
        <div class="rcv-ct">
          <div class="rcv-ct-inb">
            <p>${msg}</p>
          </div>
        </div>
      </div>`
    );
  }
}

function loadHistoryChat(history = []){
  FRAME.msgBox.html("");
  history.forEach(msg => {
    if (msg.sender_username == USERNAME){
      loadMsg(true,msg.content);
    }
    else{
      loadMsg(false,msg.content);
    }
  });
}


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
    loadMsg(false,d.msg);
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