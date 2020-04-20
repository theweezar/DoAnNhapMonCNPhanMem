$(function(){
  const socket = io();
  // console.log(socket);
  socket.emit("CONNECT_TO_SERVER",{username:USERNAME});
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
      rcvUsername: window.location.pathname.split("/")[3],
      msg: d.msg,
      type: d.type
    });
  })
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
  })
  // ====================================================================================
  // Connect to someone throught a chat box
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
      socket.emit("MAKE_MSG_SEEN",{
        senderUsername:USERNAME,
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
    });
    // If there are some msg which aren't read, we will make it "seen"
    $(`a[role='link'][data-username='${url.split("/")[3]}']`)
    .find("#lst-msg")
    .removeAttr("style");
  })
  // ====================================================================================
  // UploadBtn is clicked
  $("#fileUpload").change(function(){
    let reader = new FileReader();
    const fileExtList = ["jpg","png","jpeg"];
    if (this.files[0]){
      reader.readAsDataURL(this.files[0]);
    }
    reader.onloadend = () => {
      console.log(this.files[0]);
      // console.log(reader.result);
      let base64file = reader.result;
      let fileExt = this.files[0].name.match(/\w+$/g)[0];
      let type = "";
      // This file must be smaller than 25mb
      if (this.files[0].size < 1024 * 1024 * 25){
        FRAME.previewUploadFrame.removeAttr("style");
        if (fileExtList.includes(fileExt)) FRAME.previewUploadFile.attr("src",reader.result);
        else FRAME.previewUploadFile.attr("src","../../icon/Filetype-Docs-icon.png");
        FRAME.discardUploadFile.click(function(e){
          FRAME.previewUploadFrame.css({"display":"none"});
          FRAME.previewUploadFile.attr("src","");
        });
        FRAME.sendUploadFile.click(function(e){
          FRAME.previewUploadFrame.css({"display":"none"});
          FRAME.previewUploadFile.attr("src","");
          socket.emit("FILE_USER_TO_USER",{
            senderUsername: USERNAME,
            rcvUsername: window.location.pathname.split("/")[3],
            base64file: base64file,
            fileExt: fileExt
          });
        })
      }
    }
    
  })
});