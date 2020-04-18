function loadMsg(isSender,d = {senderUsername, rcvUsername, msg}){
  if (isSender){
    // Load msg in current MessageBoxchat
    FRAME.msgBox.append(
      `<div class="sent-f">
        <div class="sent-ct">
          <div class="sent-ct-inb">
            <p>${d.msg}</p>
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
            <p>${d.msg}</p>
          </div>
        </div>
      </div>`
    );
  }
}

function loadLastestMsgInFriendTag(d = {senderUsername, rcvUsername, msg}){
  // Load lastest msg in all friendTag
  // If the sender is the one who is connecting with this account, this func will load
  // the msg unhighlight
  if (d.senderUsername === location.pathname.split("/")[3] || d.senderUsername === USERNAME){
    $(`a[role='link'][data-username='${location.pathname.split("/")[3]}']`)
    .find("#lst-msg")
    .text(`${d.senderUsername}: ${d.msg}`);
    console.log(USERNAME);
  }
  // If not, this func will load the msg and highlight it
  else{
    $(`a[role='link'][data-username='${d.senderUsername}']`)
    .find("#lst-msg")
    .text(`${d.senderUsername}: ${d.msg}`)
    .css({
      "font-weight":"bold",
      "color":"black"
    });
  }
}

function loadHistoryChat(history = []){
  FRAME.msgBox.html("");
  history.forEach(d => {
    let isSender = false;
    if (d.sender_username == USERNAME) isSender = true;
    loadMsg(isSender,{
      senderUsername: d.sender_username,
      rcvUsername: d.rcv_username,
      msg: d.content
    });
  });
}