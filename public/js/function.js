function loadMsg(isSender, d){
  if (isSender){
    FRAME.msgBox.append(
      `<div class="sent-f">
        <div class="sent-ct">
          <div class="sent-ct-inb">
            <p>${d.content}</p>
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
            <p>${d.content}</p>
          </div>
        </div>
      </div>`
    );
  }
}

function loadHistoryChat(history = []){
  FRAME.msgBox.html("");
  history.forEach(d => {
    if (d.sender_username == USERNAME){
      loadMsg(true,d);
    }
    else{
      loadMsg(false,d);
    }
  });
}