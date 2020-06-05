$(function(){
  const socket = io();
  // ==================================================================================
  // WHEN YOU SEND A MSG TO YOUR FRIEND
  FRAME.textArea.keyup(function(e){ // Type enter and the msg will be sent to server
    if (e.keyCode === 13){
      var msg = $(this).val().split("\n")[0];
      if (msg.trim() !== ""){
        // Show the msg in chatbox
        // Everytime we send a msg to someone, we have to load it on MessageBoxChat
        // and load the lastest msg in the friend tag
        // SEND
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
  // ====================================================================================
  // RESPONSE TO ME
  socket.on(`RESPONSE_TO_${USERNAME}`,function(d){
    loadMsg(true,{
      senderUsername: USERNAME,
      msg: d.msg,
      type: d.type
    });
    loadLastestMsgInFriendTag({
      senderUsername: USERNAME,
      rcvUsername: d.rcvUsername,
      msg: d.msg,
      type: d.type
    });
    // Bring your friends to the top whenever you text to them
    reLoadContactList(d.rcvUsername);
  });
  // ===================================================================================
  // RECEIVE FROM SOMEONE
  socket.on(`MESSAGE_TO_${USERNAME}`,function(d){
    console.log(d);
    // if sender is connecting with this account, we will load the msg in MessageBoxChat
    if (d.senderUsername === window.location.pathname.split("/")[3]){
      loadMsg(false,{
        senderUsername: d.senderUsername,
        rcvUsername: d.rcvUsername,
        msg: d.msg,
        type: d.type
      });
    }
    // if not, we just need to load the lastestMsg in friend tag
    loadLastestMsgInFriendTag({
      senderUsername: d.senderUsername,
      rcvUsername: d.rcvUsername,
      msg: d.msg,
      type: d.type
    });
    // Bring your friends to the top whenever they text to you
    reLoadContactList(d.senderUsername);
  });
  // ====================================================================================
  // Connect to someone throught a chat box
  FRAME.friendTag.click(function(e){
    e.preventDefault();
    var url = $(this).attr("href");
    history.pushState("","",url);
    if ($(this).attr("rcv-type") === "user"){
      $.ajax({
        type:"POST",
        url:url,
        data:{

        },
        success: function(rs){
          loadHistoryChat(rs);
          // If there are some msg which aren't read, we will make it "seen"
          $(`a[role='link'][data-username='${url.split("/")[3]}']`)
          .find("#lst-msg")
          .removeAttr("style");
        }
      })
    }
    else if($(this).attr("rcv-type") === "group"){
      socket.emit("USER_CONNECT_GROUP",{});
    }
  });


})