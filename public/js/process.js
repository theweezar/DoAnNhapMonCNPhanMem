$(function(){
  const socket = io();
  // console.log(socket);
  // ==================================================================================
  // WHEN YOU CONNECT TO SERVER
  socket.emit("CONNECT_TO_SERVER",{
    username:USERNAME,
    userID: ID
  });
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

  // ===================================================================================
  // TYPING TO FIND FRIEND
  FRAME.findFriend.on("keyup", function(e){
    if (e.keyCode === 13 && $(this).val().trim().length !== 0){
      socket.emit("FIND_PEOPLE",{keyName: $(this).val().trim()});
    }
  });

  // ===================================================================================
  // RECEIVE THE LIST OF FRIEND WHO WE JUST FIND ABOVE
  socket.on(`RETURN_PEOPLE_TO_${USERNAME}`, function(d){
    console.log(d);
    loadFoundPeople(d.rsList);
    FRAME.reqBtn.click(function(e){
      console.log($(this).parent().parent().attr("data-username"));
      socket.emit("SEND_REQUEST",{
        fromUsername: USERNAME,
        fromID: ID,
        toUsername: $(this).parent().parent().attr("data-username")
      });
      // $(this).attr("class","wait").text("Waiting...");
    });
    FRAME.ansBtn.click(function(e){
      socket.emit("SEND_ANSWER",{
        fromUsername: USERNAME,
        toUsername: $(this).parent().parent().parent().attr("data-username")
      });
    })
  });

  socket.on(`RESPONSE_REQUEST_${USERNAME}`, function(d){
    if (d.isReq) FRAME.reqBtn.attr("class","wait").text("Waiting...");
    else{
      // Nofitication
    }
  });

  socket.on(`RESPONSE_ANSWER_${USERNAME}`, function(d){
    // Nofitication or decorating something, i don't know
    if (d.isAns){

    } 
    else{
      
    }
  });

  // ===========================================================================
  // CREATE NEW GROUP
  $("#newGroup").click(function(){
    $("#reg-g-f").attr("style","display: flex");
    $.ajax({
      type:"POST",
      url:"/getfriendtoaddtogroup",
      success: function(rs){
        console.log(rs);
        loadFriendToAddGroup(rs);
      }
    })
  });
  $("#closeBtn").click(function(){
    $("#reg-g-f").attr("style","display: none");
  });
  $("input#searchfriendtoaddgroup").keyup(function(e){
    if (e.keyCode == 13 && $(this).val().trim() != ""){
      $.ajax({
        type:"POST",
        url:"/searchfriendtoaddgroup",
        data:{
          clue: $(this).val().trim()
        },
        success: (rs) => {
          console.log(rs);
          $("ul#listpeople").html("");
          loadFriendToAddGroup(rs);
          $(this).val("");
        }
      })
    }
  })
  $("#inpfFriend").on("keyup", function(){
    if ($(this).val().trim() !== ""){
      socket.emit("FIND_FRIEND",{
        userID: ID,
        clue: $(this).val().trim()
      });
    }
  });
  socket.on(`RETURN_FRIEND_TO_${USERNAME}`, function(d){
    loadFoundFriend(d.friendList);
  });
});