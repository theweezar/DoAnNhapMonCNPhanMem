function loadMsg(isSender,d = {senderUsername, rcvUsername, msg, type}){
  let msgHTML = "";
  if (d.type == "text") msgHTML = `<p>${d.msg}</p>`;
  else if (d.type == "img") msgHTML = `<img src="../../${d.msg}" alt="" srcset="">`;
  if (isSender){
    // Load msg in current MessageBoxchat
    FRAME.msgBox.append(
      `<div class="sent-f">
        <div class="sent-ct">
          <div class="sent-ct-inb">
            ${msgHTML}
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
            ${msgHTML}
          </div>
        </div>
      </div>`
    );
  }
}

function loadLastestMsgInFriendTag(d = {senderUsername, rcvUsername, msg, type}){
  // Load lastest msg in all friendTag
  // If the sender is the one who is connecting with this account, this func will load
  // the msg unhighlight
  if (d.senderUsername === location.pathname.split("/")[3] || d.senderUsername === USERNAME){
    $(`a[role='link'][data-username='${location.pathname.split("/")[3]}']`)
    .find("#lst-msg")
    .text(`${d.senderUsername}: ${d.type == "text" ? d.msg:"File"}`);
    // console.log(USERNAME);
  }
  // If not, this func will load the msg and highlight it
  else{
    $(`a[role='link'][data-username='${d.senderUsername}']`)
    .find("#lst-msg")
    .text(`${d.senderUsername}: ${d.type == "text" ? d.msg:"File"}`)
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
      msg: d.content,
      type: d.type
    });
  });
}

function reLoadContactList(topUsername){
  let top = $(`li a[data-username='${topUsername}']`).parent();
  top.remove();
  let bottom = $("#contact-list ul li");
  FRAME.contactList.append(top);
  FRAME.contactList.append(bottom);
}

function loadFoundFriend(fList = []){
  FRAME.contactList.html("");
  fList.forEach(friend => {
    if (friend.username !== USERNAME){
      let html = "";
      if (friend.connect === undefined) html = `<div role="req" class="request">+ Add friend</div>`;
      else if (friend.connect === "w84accept") html = `<div class="wait">Waiting...</div>`;
      else if (friend.connect === "w84answer") html = `
        <div class='answer'><span id="answer" role='yes'>Accept</span><span id="answer" role='no'>Decline</span></div>
      `
      else if (friend.connect === "friend") html = `<div class="friend">&#10004; Friend</div>`;
      FRAME.contactList.append(
        `<li>
          <a role="tag" data-username="${friend.username}" rcv-type="user">
            <img class="avatar" src="../../icon/PngItem_5167304.png" alt="">
            <div class="in4">
              <div class="in4-1">${friend.fullname}</div>
              ${html}
            </div>
          </a>
        </li>`
      );
    }
  });
}