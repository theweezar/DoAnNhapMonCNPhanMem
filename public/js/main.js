$(function(){
  const socket = io();
  console.log(socket);
  socket.emit("CONNECT_TO_SERVER",{username:USERNAME});
  $("#t_msg").keyup(function(e){ // Type enter and the msg will be sent to server
    if (e.keyCode === 13){
      var msg = $(this).val();

      if (msg.trim() !== ""){
        // Show the msg in chatbox
        $("#msg_box").append(`
          <div class="sent-f">
            <div class="sent-ct">
              <div class="sent-ct-inb">
                <p>${msg}</p>
              </div>
            </div>
            <div class="sent-ava">
              <img src="icon/PngItem_5167304.png" alt="" srcset="">
            </div>
          </div>
        `);
      }

      $(this).val("");


    }
  }).keydown(function(e){ // Avoid creating massive space
    if (e.keyCode === 13){
      $(this).val($(this).val().trim());
    }
  });

  $("#clickme").click(function(e){
    // e.preventDefault();
    history.pushState({ foo: 'fake' }, 'Fake Url', '/something');
  })

  $("a[role='link']").click(function(e){
    e.preventDefault();
    var url = $(this).attr("href");
    var rcvUsername = url.split("/")[3];
    console.log(rcvUsername);
    history.pushState("","",url);
    socket.emit("CONNECT_TO_RECEIVER_USER",{
      senderUsername:USERNAME,
      senderID:ID,
      rcvUsername:rcvUsername
    });

    socket.on("SEND_RECEIVER_DATA",function(data){
      console.log(data);
    })
  })
});