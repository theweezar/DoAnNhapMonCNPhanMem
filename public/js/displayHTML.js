function loadMsg(isSender,d = {senderUsername, rcvUsername, msg, type, isGroup, groupId}){
  let msgHTML = "";
  console.log(d);
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
          ${d.senderUsername}
        </div>
      </div>`
    );
  }
  else{
    FRAME.msgBox.append(
      `<div class="rcv-f">
        <div class="rcv-ava">
          ${d.senderUsername}
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

function loadLastestMsgInFriendTag(d = {senderUsername, rcvUsername, msg, type, isGroup, groupId}){
  // Load lastest msg in all friendTag
  // If the sender is the one who is connecting with this account, this func will load
  // the msg unhighlight
  let there, here;
  // there means is not connect through box chat
  // here means is connecting through box chat
  if (d.isGroup){
    there = $(`a[role='link'][data-group-id='${d.groupId}']`);
    here = $(`a[role='link'][data-group-id='${location.pathname.split("/")[3]}']`); 
  }
  else{
    there = $(`a[role='link'][data-username='${d.senderUsername}']`);
    here = $(`a[role='link'][data-username='${location.pathname.split("/")[3]}']`);
  }
  if (d.senderUsername === location.pathname.split("/")[3] || d.senderUsername === USERNAME || d.groupId === location.pathname.split("/")[3]){
    here
    .find("#lst-msg")
    .text(`${d.senderUsername}: ${d.type == "text" ? d.msg:"File"}`);
    // console.log(USERNAME);
  }
  // If not, this func will load the msg and highlight it
  else{
    there
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

function reLoadContactList(d={topUsername, topGroupId}){
  let top = undefined;
  if (d.topUsername != undefined && d.topGroupId == undefined) top = $(`li a[data-username='${d.topUsername}']`).parent();
  else if (d.topGroupId != undefined) top = $(`li a[data-group-id='${d.topGroupId}']`).parent();
  // top.remove();
  // let bottom = $("#contact-list ul li");
  FRAME.contactList.prepend(top);
  // FRAME.contactList.append(bottom);
  
}

function loadFoundPeople(pList = []){
  FRAME.contactList.html("");
  pList.forEach(friend => {
    if (friend.username !== USERNAME){
      let html = "";
      if (friend.connect === undefined) html = `<div role="req" class="request">+ Add friend</div>`;
      else if (friend.connect === "waiting") html = `<div class="wait">Waiting...</div>`;
      else if (friend.connect === "answer") html = `
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

function loadFoundFriend(fList = []){
  FRAME.selectList.html("");
  fList.forEach(f => {
    FRAME.selectList.append(
      `<li>
        <div class="fname">${f.fullname}</div>
        <div class="check-p">&#10004;</div>
      </li>`
    )
  });
}

function loadFriendToAddGroup(fList = []){
  $("ul#listpeople").html("");
  fList.forEach(f => {
    if (f.isAdd){ // True
      $("ul#listpeople").append(
        `<li class="row py-1">
          <div class="col-lg-1 col-md-1 col-sm-1">ava</div>
          <div class="col-lg-8 col-md-8 col-sm-8">${f.fullname}</div>
          <div data-people-id="${f.id}" class="col-lg-3 col-md-3 col-sm-3">
            <button class="btn btn-danger" id="addpeople">Remove</button>
          </div>
        </li>`
      )
    }
    else{ // False, Undifined
      $("ul#listpeople").append(
        `<li class="row py-1">
          <div class="col-lg-1 col-md-1 col-sm-1">ava</div>
          <div class="col-lg-8 col-md-8 col-sm-8">${f.fullname}</div>
          <div data-people-id="${f.id}" data-people-username="${f.username}" class="col-lg-3 col-md-3 col-sm-3">
            <button class="btn btn-success" id="addpeople">Add</button>
          </div>
        </li>`
      )
    }
  });
  $("button#addpeople").click(function(e){
    $.ajax({
      type:"POST",
      url:"/addtogroup",
      data:{
        friendId: $(this).parent().attr("data-people-id"),
        friendUsername: $(this).parent().attr("data-people-username"),
        role: $(this).parent().attr("role")
      },
      success: rs => {
        // console.log(fList);
        if (rs) $(this).text("Remove").attr("class","btn btn-danger");
        else $(this).text("Add").attr("class","btn btn-success");
        $.ajax({
          type:"POST",
          url:"/getlistfriendingroup",
          success: function(rs){
            if (rs.length >= 2) $("button#createGroup").removeAttr("disabled");
            else $("button#createGroup").attr("disabled","disabled");
          }
        })
      }
    })
  })
}