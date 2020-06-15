const express = require("express");
const app = express();
const path = require("path");
const socketIO = require("socket.io");
const exphbs = require("express-handlebars");
const fs = require("fs");
const PORT = process.env.PORT | 5000;
const session = require("express-session");
const async = require("asyncawait/async");
const await = require("asyncawait/await");
const mysql = require("mysql");
const table = {
  users: require("./model/users"),
  friends: require("./model/friends"),
  userMsgDetail: require("./model/user_messages_detail"),
  groups: require("./model/groups"),
  groupMembersDetail: require("./model/groups_members_detail"),
  groupMsgDetail: require("./model/groups_messages_detail")
};
const mdW = require("./middleware.js");
const s = require("./validation");
const { dir } = require("console");
// ======================== Database connection is here ============================ //
const conn = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"test"
});
conn.connect(err => {
  if (err) throw err;
  else console.log("Connected to database successfully !");
})
// ============================== Model is here =================================== //
const userTb = new table.users(conn);
const friendTb = new table.friends(conn);
const userMsgDetail = new table.userMsgDetail(conn);
const groupTb = new table.groups(conn);
const groupMembersDetail = new table.groupMembersDetail(conn);
const groupMsgDetail = new table.groupMsgDetail(conn);
// ============================== Session is here ================================= //
app.use(session({
  secret:"thisisasecret",
  resave:true,
  saveUninitialized:true
}));

// set defaultlayout is main.handlebars
exphbs.create({
  ifEquals:(a, b, opt) => {
    return (a == b) ? opt.fn(this) : opt.inverse(this);
  }
});
app.engine('handlebars', exphbs({defaultLayout:'main'})); 
app.set('view engine', 'handlebars');


// use public resources such as css, js client side
app.use(express.static(path.join(__dirname,"public")));
// use socket module for client side 
app.use(express.static(path.join(__dirname,"node_modules","socket.io-client","dist")));
// use to load file which sent by user
app.use(express.static(path.join(__dirname,"files")));
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get("/",mdW.redirectApp,(req,res) => {
  res.render("login");
  // req.session.userID = '1';
  // req.session.username = 'admin';
  // req.session.logged = true;
  // res.redirect("/app");
});

app.get("/login",mdW.redirectApp,(req,res) => {
  res.render("login");
})

app.post("/login",(req,res) => {
  let username = s.validateString(req.body.username.trim());
  let password = req.body.password.trim(); //s.validatePassword(req.body.password.trim());
  // Get data from database
  userTb.getUser({username:username})
  .then(user => {
    if (user[0].password === password){
      req.session.userID = user[0].id;
      req.session.username = username;
      req.session.logged = true;
      res.redirect("/app");
    }
    else res.render("login",{err:true});
  })
  .catch(err => err);
  // Encode input data
  // Check input data if it is corrected or not
})

app.get("/register",mdW.redirectApp,(req,res) => {
  res.render("register");
})

app.post("/register",(req,res) => {
  let firstName = s.validateName(req.body.firstName.trim());
  let lastName = s.validateName(req.body.lastName.trim());
  let username = s.validateString(req.body.username.trim());
  let email = s.validateEmail(req.body.email.trim());
  let password = s.validatePassword(req.body.password.trim());
  let rePassword = s.validatePassword(req.body.rePassword.trim());
  if (
    firstName !== "" && lastName !== "" && username !== "" &&
    email !== "" && password !== "" && rePassword !== ""
  ){
    // Check if all this attributes are existed or not ?
    let checkExist = async(function(){
      let checkUsername = await(userTb.getUser({username:username}));
      let checkEmail = await(userTb.getUser({email:email}));
      return {
        checkUsername: checkUsername,
        checkEmail: checkEmail
      };
    });
    checkExist()
    .then(rs => {
      if (rs.checkUsername.length !== 0) res.render("/register",{usernameErr: true});
      else if (rs.checkEmail.length !== 0) res.render("/register",{emailErr: true});
      else if (password !== rePassword) res.render("/register",{passwordErr: true});
      else{
        let fullname = `${firstName} ${lastName}`;
        userTb.addUser(username, password, email, fullname);
        res.redirect("/login");
      }
    })
    .catch(err => err);
  }
  else res.redirect("/register");
})

app.get("/logout", (req, res) => {
  if (req.session.logged){
    req.session.destroy(err => {
      if (err) throw err;
      else res.redirect("/");
    })
  }
  else res.redirect("/");
})

app.get("/app",mdW.redirectLogin,(req,res) => {
  // res.render("app");
  req.session.group = [];
  let getEverything = async (function(){
    // The lastest texted friend
    let url = "";
    let tLTF = await(friendTb.getTheLastestTextedFriend(req.session.userID));
    let tLTG = await(groupTb.getLastestTextedGroup(req.session.userID));
    let historyChat = undefined;
    let friendList = await(friendTb.getFriends(req.session.userID)).map(f => {
      f.isUser = true;
      return f;
    });
    let groupList = await(groupTb.getGroup(req.session.userID)).map(g => {
      g.isGroup = true;
      return g;
    });
    // Sort by .recent of both lists DESC. To show in contact list on front end
    let fullList = friendList.concat(groupList);
    if (fullList.length > 1) fullList.sort((t1, t2) => {return t2.recent - t1.recent});
    // console.log(fullList);
    // Get history of the fullList
    // If the lastest sender is a user
    if (tLTF.length != 0 || tLTG.length != 0){
      url = `/app/u/${tLTF[0].username}`;
      if (tLTG.length == 0){
        historyChat = await(userMsgDetail.getHistory(req.session.username, tLTF[0].username)).map(row => {
          if (row.sender_username == req.session.username) row.isSender = true;
          else row.isSender = false;
          if (row.type == "text") row.text = true;
          else if (row.type == "img") row.img = true;
          else if (row.type == "file") row.file = true;
          return row;
        });
      }
      if (tLTF[0].recent > tLTG[0].recent ) {
        historyChat = await(userMsgDetail.getHistory(req.session.username, tLTF[0].username)).map(row => {
          if (row.sender_username == req.session.username) row.isSender = true;
          else row.isSender = false;
          if (row.type == "text") row.text = true;
          else if (row.type == "img") row.img = true;
          else if (row.type == "file") {
            row.file = true;
            row.fileName = row.content.split(":")[1];
            row.link = row.content.split(":")[0];
          }
          return row;
        });
      }
      // else the lastest sender is in a group
      else{
        url = `/app/g/${tLTG[0].id}`;
        historyChat = await(groupMsgDetail.getHistory(tLTG[0].id)).map(row => {
          row.sender_username = await(userTb.getUser({id: row.sender_id}))[0].username;
          if (row.sender_id == req.session.userID) row.isSender = true;
          else row.isSender = false;
          if (row.type == "text") row.text = true;
          else if (row.type == "img") row.img = true;
          else if (row.type == "file") {
            row.file = true;
            row.fileName = row.content.split(":")[1];
            row.link = row.content.split(":")[0];
          }
          return row;
        });
      }
    }
    
    let allLastestMsg = fullList.map(e => {
      if (e.isUser) return await(userMsgDetail.getLastestMsg(req.session.username, e.username));
      else if (e.isGroup) return await(groupMsgDetail.getLastestMsg(e.id));
    });
    // console.log(allLastestMsg);
    await(function(){
      fullList.map((e, i) => {
        e.seenMsg = true;
        // console.log(e);
        if (allLastestMsg[i][0] != undefined){
          e.lastestMsg = allLastestMsg[i][0].type == "text" ? allLastestMsg[i][0].content : "File";
          if (e.isUser){
            e.lastestSender = `${allLastestMsg[i][0].sender_username}: `;
            if (allLastestMsg[i][0].sender_username !== req.session.username){
              e.seenMsg = (allLastestMsg[i][0].seen == 0 ? false:true);
            }
          }
          if (e.isGroup){
            e.lastestSender = `${await(userTb.getUser({id: e.userid}))[0].username}: `;
            if (e.seen === 0) e.seenMsg = false;
          }
        }
        else {
          e.lastestMsg = "Nothing";
          e.lastestSender = "";
        }
      })
    }());
    console.log(historyChat);
    return {
      tLTF: tLTF,
      tLTG: tLTG,
      fullList: fullList,
      historyChat: historyChat,
      allLastestMsg: allLastestMsg,
      url: url
    };
  });
  getEverything()
  .then(rs => {
    console.log(rs.historyChat);
    res.render("app",{
      logged: req.session.logged,
      data: rs,
      myUsername: req.session.username,
      myID: req.session.userID,
      url: rs.url
    });
  })
  .catch(err => {throw err;});
})

app.get("/app/u/:username",mdW.redirectLogin, (req, res) => {
  res.redirect("/app");
  // let getData = async (function(){
  //   // Set group session empty
  //   // req.session.group = [];
  //   // Find user's friend in database and display it in client side
  //   let friendList = await(friendTb.getFriends(req.session.userID));
  //   // Find your message history and the lasted person who texted to you - Sent msg and rcv msg
  //   let historyChat = await(userMsgDetail.getHistory(req.session.username, req.params.username)).map(row => {
  //     if (row.sender_username == req.session.username) row.isSender = true;
  //     else row.isSender = false;
  //     if (row.type == "text") row.text = true;
  //     else if (row.type == "img") row.img = true;
  //     return row;
  //   })
  //   // Find all the lastest unseen or seen messages of you and your friends then display it on screen
  //   let allLastestMsg = friendList.map(friend => {
  //     return await(userMsgDetail.getLastestMsg(req.session.username, friend.username));
  //   });
  //   // If there are some msg that aren't seen yet from your friends, we will make all that msg "Seen"
  //   userMsgDetail.seenMsg(req.params.username, req.session.username);
  //   return {
  //     friendList: friendList,
  //     historyChat: historyChat,
  //     allLastestMsg: allLastestMsg
  //   };
  // });
  // getData()
  // .then(rs => {
  //   // console.log(rs.allLastestMsg);
  //   rs.friendList.map((friend, i) => {
  //     friend.seenMsg = true;
  //     if (rs.allLastestMsg[i][0] !== undefined){
  //       friend.lastestMsg = rs.allLastestMsg[i][0].type == "text" ? rs.allLastestMsg[i][0].content : "File";
  //       friend.lastestSender = `${rs.allLastestMsg[i][0].sender_username}: `;
  //       // if seen = false then css will highlight the message
  //       if (rs.allLastestMsg[i][0].sender_username !== req.session.username){
  //         friend.seenMsg = (rs.allLastestMsg[i][0].seen == 0 ? false:true);
  //       }
  //     }
  //     else{
  //       friend.lastestMsg = "Nothing";
  //       friend.lastestSender = "";
  //     }
  //   });
  //   res.render("app",{
  //     logged: req.session.logged,
  //     data: rs,
  //     myUsername: req.session.username,
  //     myID: req.session.userID
  //   })
  // })
  // .catch(err => {throw err;});
})

app.get("/app/g/:groupid", mdW.redirectLogin, (req, res) => {
  res.redirect("/app");
  // let getHistory = async(function(){
  //   // Combine friendList and groupList then sort them with .recent DESC
  //   let friendList = await(friendTb.getFriends(req.session.userID)).map(f => {
  //     f.isUser = true;
  //     return f;
  //   });
  //   let groupList = await(groupTb.getGroup(req.session.userID)).map(g => {
  //     g.isGroup = true;
  //     return g;
  //   });
  //   // Sort by .recent of both lists DESC. To show in contact list on front end
  //   let fullList = friendList.concat(groupList);
  //   fullList.sort((t1, t2) => {return t2.recent - t1.recent});
  //   // console.log(fullList);
  //   // Get history of the fullList
  //   let historyChat = await(groupMsgDetail.getHistory(req.params.groupid)).map(row => {
  //     if (row.sender_id == req.session.userID) row.isSender = true;
  //     else row.isSender = false;
  //     if (row.type == "text") row.text = true;
  //     else if (row.type == "img") row.img = true;
  //     return row;
  //   })
  //   let allLastestMsg = fullList.map(e => {
  //     if (e.isUser) return await(userMsgDetail.getLastestMsg(req.session.username, e.username));
  //     else if (e.isGroup) return await(groupMsgDetail.getLastestMsg(e.id));
  //   });
  //   // console.log(allLastestMsg);
  //   await(function(){
  //     fullList.map((e, i) => {
  //       e.seenMsg = true;
  //       // console.log(e);
  //       if (allLastestMsg[i][0] != undefined){
  //         e.lastestMsg = allLastestMsg[i][0].type == "text" ? allLastestMsg[i][0].content : "File";
  //         if (e.isUser){
  //           e.lastestSender = `${allLastestMsg[i][0].sender_username}: `;
  //           if (allLastestMsg[i][0].sender_username !== req.session.username){
  //             e.seenMsg = (allLastestMsg[i][0].seen == 0 ? false:true);
  //           }
  //         }
  //         if (e.isGroup){
  //           e.lastestSender = `${await(userTb.getUser({id: e.userid}))[0].username}: `;
  //           if (e.seen === 0) e.seenMsg = false;
  //         }
  //       }
  //       else {
  //         e.lastestMsg = "Nothing";
  //         e.lastestSender = "";
  //       }
  //     })
  //   }());
  //   return{
  //     fullList: fullList,
  //     historyChat: historyChat,
  //     allLastestMsg: allLastestMsg
  //   }
  // });
  // getHistory()
  // .then(rs => {
  //   // console.log(rs);
  //   res.render("app",{
  //     logged: req.session.logged,
  //     data: rs,
  //     myUsername: req.session.username,
  //     myID: req.session.userID
  //   })
  // })
  // .catch(err => err);
})

// Return a friend list to create a new group
app.post("/getfriendtoaddtogroup", (req, res) => {
  let getFriend = async(function(){
    let fList = await(friendTb.getFriends(req.session.userID));
    await(function(){
      fList.map(u => u.isAdd = false);
    }());
    return fList;
  });
  getFriend()
  .then(rs => res.send(rs))
  .catch(err => {throw err});
})

// When you close a group creation box
app.post("/cancelcreategroup", (req, res) => {
  req.session.group = [];
  res.send("Cancel create group");
})

// Find another friend to add to group chat
app.post("/searchfriendtoaddgroup", (req, res) => {
  let findFriend = async(function(){
    // Find friends
    let find = await(friendTb.find(req.session.userID, req.body.clue));
    // console.log(find);
    await(function(){
      // Check if a friend is added in the group list or not ?
      console.log(req.session.group);
      find.map(u => {
        if (req.session.group.find(e => e.id == u.id) === undefined) u.isAdd = false;
        else u.isAdd = true;
      });
    }());
    return find;
  });
  findFriend()
  .then(rs => res.send(rs))
  .catch(err => {throw err;});
})

// Select a friend and add to group chat
app.post("/addtogroup", (req, res) => {
  let isAdd = undefined;
  // Add user if that user isn't in list
  if (req.session.group.find(e => e === req.body.friendId) === undefined) {
    req.session.group.push({
      id: req.body.friendId,
      username: req.body.friendUsername
    });
    isAdd = true;
  }
  // Remove user if that user is in list
  else {
    // Find the position of that user in the list
    var p = req.session.group.findIndex(e => e.id == req.body.friendId);
    // Cut into 2 array to remove that user
    var arr1 = req.session.group.slice(0,p);
    var arr2 = req.session.group.slice(p+1,);
    // 
    req.session.group = arr1.concat(arr2);
    isAdd = false;
  }
  res.send(isAdd);
})

// Return a list of friends which is in group
app.post("/getlistfriendingroup", (req, res) => {
  res.send(req.session.group);
})

const server = app.listen(PORT,() => {
  console.log(`Server is running on PORT: ${PORT} !!!!`);
})

const io = socketIO(server);

io.on("connection",socket => {
  socket.on("CONNECT_TO_SERVER",d => {
    console.log(`${d.username} is connected to the server !`);
    socket.username = d.username;
    socket.userID = d.userID;
  });
  // ================================== FIND PEOPLE ======================================== //
  // 1. Typing to find friend with username, fullname, ....
  socket.on("FIND_PEOPLE", d => {
    let findFriend = async(function(){
      let target = await(userTb.find(d.keyName));
      await(function(){
        target.map(f => {
          // if there are some results. We will check if this account has a connection with
          // all account in the results or not 
          let row = await(friendTb.getChatID(socket.username, f.username));
          if (row.length == 0) f.connect = undefined;
          else if (row[0].accept == 1) f.connect = "friend";
          else if (row[0].accept == 0 && row[0].userId_1 == socket.userID) f.connect = "waiting";
          else if (row[0].accept == 0) f.connect = "answer";
          return f;
        })
      }());
      return target;
    });
    findFriend().then(rs => {
      console.log(rs);
      io.emit(`RETURN_PEOPLE_TO_${socket.username}`,{rsList: rs})
    });
  })

  // 2. Send and response the request to add friend
  socket.on("SEND_REQUEST", d => {
    userTb.getUser({username: d.toUsername})
    .then(rs => {
      friendTb.request(socket.userID, rs[0].id);
      // response for both who send and who rcv
      io.emit(`RESPONSE_REQUEST_${d.fromUsername}`,{
        isReq: true,
        fromUsername: d.fromUsername,
        toUsername: d.toUsername
      }); // me
      io.emit(`RESPONSE_REQUEST_${d.toUsername}`,{
        isReq: false,
        fromUsername: d.fromUsername,
        toUsername: d.toUsername
      }); // who I request to add friend
    })
    .catch(err => err)
  })

  // 3. Send and response the answer to decide be friend or not
  socket.on("SEND_ANSWER", d => {
    let accept = undefined;
    userTb.getUser({username: d.toUsername})
    .then(rs => {
      if (d.answer == "yes"){
        accept = true;
        friendTb.accept(socket.userID, rs[0].id);
      }
      else if (d.answer == "no"){
        accept = false;
        friendTb.decline(socket.userID, rs[0].id);
      }
      // response for both who answer and who rcv that answer
      io.emit(`RESPONSE_ANSWER_${d.fromUsername}`,{
        fromUsername: d.fromUsername,
        toUsername: d.toUsername,
        isAns: true,
        accept: accept
      }); // who answer my request
      io.emit(`RESPONSE_ANSWER_${d.toUsername}`,{
        fromUsername: d.fromUsername,
        toUsername: d.toUsername,
        isAns: false,
        accept: accept
      }); // me
    })
  })

  // ================================== USER TO USER ======================================= //
  // 1. Click on friend tag to connect to chat box 1 - 1
  socket.on("USER_CONNECT_USER",d => {
    // userTb.getUser(d.rcvUsername).then(user => {return user.id}).catch(err => {throw err});
    // socket.rcvUsername = d.rcvUsername;
    let getMsg = async(function(){
      // let friendID = await(userTb.getUser(d.rcvUsername));
      // let chatID = await(friendTb.getChatID(d.senderID,friendID[0].id));
      // Get the history chat between you and your friend
      let historyChat = await(userMsgDetail.getHistory(d.senderUsername, d.rcvUsername));
      // We make the msg is seen when sender is d.rcvUsername
      userMsgDetail.seenMsg(d.rcvUsername,socket.username);
      return historyChat;
    });
    getMsg().then(rs => {
      // console.log(rs);
      io.emit(`HISTORY_USER_USER_${d.senderUsername}`,{
        historyChat: rs
      });
    }).catch(err => {throw err});
  });
  // 2. When you click to connect to someone, all the msg which isn't seen from your friend
  // will be made "seen"
  socket.on("MAKE_MSG_SEEN",d => {
    userMsgDetail.seenMsg(socket.username,d.rcvUsername);
  });
  // 3. When you send to someone a msg, and that msg has to be send to specific user
  socket.on("MESSAGE_USER_TO_USER",d => {
    // Change the last texting time
    friendTb.getChatID(d.senderUsername, d.rcvUsername)
    .then(rs => friendTb.setTimeForLastestMsg(rs[0].id))
    .catch(err => {throw err;});
    // Save the msg in database
    userMsgDetail.addMsg({
      senderUsername: d.senderUsername,
      rcvUsername: d.rcvUsername,
      content: d.msg,
      type: "text"
    });
    console.log(d);
    let sendData = {
      senderUsername: d.senderUsername,
      rcvUsername: d.rcvUsername,
      msg: d.msg,
      type: "text"
    };
    // Send the msg to the receiver
    io.emit(`MESSAGE_TO_${d.rcvUsername}`,sendData);
    // Responce the msg to sender
    io.emit(`RESPONSE_TO_${d.senderUsername}`,sendData);
  });
  // 4. When you send an image or a file to specific user
  socket.on("FILE_USER_TO_USER",d => {
    // base64file is the data that sent from client-side
    let base64file = d.base64file.split(';base64,').pop();
    let isImg = ["jpg","png","jpeg"].includes(d.fileExt);
    let link = isImg ? "img":"others";
    let typeF = isImg ? "img":"file";
    // genName is a Promise that generate random name for that base64file
    let genName = Promise.resolve(
      // construct a array with length = 10. Then fill it with undifine value
      // After that, give every signle element in that array a char from ascii (122-97)(a-z)
      new Array(10).fill().map(c => c = String.fromCharCode(Math.floor(Math.random()*(122+1-97)+97)))
    );
    genName.then(rs => {
      let newName = rs.toString().replace(/,/g,"");
      // Create that base64file with the name that created above, then save it in folder "files"
      fs.writeFile(
        path.join(__dirname,"files",link,`${newName}.${d.fileExt}`), 
        base64file, 
        {encoding: 'base64'}, 
        function(err) {
          if (err) console.log(err);
          else{
            // We just need to save the link of that file which created above
            let sendData = undefined;
            if (typeF == "img"){
              userMsgDetail.addMsg({
                senderUsername: d.senderUsername,
                rcvUsername: d.rcvUsername,
                content: `${link}/${newName}.${d.fileExt}`,
                type: typeF
              });
              sendData = {
                senderUsername: d.senderUsername,
                rcvUsername: d.rcvUsername,
                msg: `${link}/${newName}.${d.fileExt}`,
                type: typeF
              }
            }
            else if (typeF == "file"){
              userMsgDetail.addMsg({
                senderUsername: d.senderUsername,
                rcvUsername: d.rcvUsername,
                content: `${link}/${newName}.${d.fileExt}:${d.realName}`,
                type: typeF
              });
              sendData = {
                senderUsername: d.senderUsername,
                rcvUsername: d.rcvUsername,
                msg: `${link}/${newName}.${d.fileExt}:${d.realName}`,
                type: typeF
              }
            }
            // Send the image to the receiver
            io.emit(`MESSAGE_TO_${d.rcvUsername}`, sendData);
            // Response the image to the sender
            io.emit(`RESPONSE_TO_${d.senderUsername}`, sendData);
          }
      });
    });
  })

  // =================================== USER TO GROUP ===================================== //
  // 1. Find my friend to add to new group
  socket.on("FIND_FRIEND", function(d){
    friendTb.find(d.userID, d.clue)
    .then(rs => {
      io.emit(`RETURN_FRIEND_TO_${socket.username}`,{friendList: rs});
    });
  });

  // 2. Create new group
  socket.on("CREATE_NEW_GROUP", function(d){
    console.log(d);
    let groupName = d.groupName.trim() == "" ? d.listUser.map(u => u.username).toString() : d.groupName.trim();
    console.log(groupName);
    let creatingGroup = async(function(){
      await(function(){
        groupTb.create({
          userId: socket.userID,
          groupName: groupName
        });
      }());
      let newGroup = await(groupTb.getNewestGroup());
      await(function(){
        console.log(newGroup);
        groupMembersDetail.add({
          groupId: newGroup[0].id, 
          userId: socket.userID,
          isAdmin: 1
        });
        d.listUser.forEach(u => {
          groupMembersDetail.add({
            groupId: newGroup[0].id,
            userId: u.id,
            isAdmin: 0
          });
        });
      }());
      // return 
    });
    creatingGroup()
    .then(() => {
      console.log("done");
    })
    .catch(err => err);
  });

  // 3. Send message to a group
  socket.on("MESSAGE_USER_TO_GROUP", function(d){
    console.log(d);
    let add2db = async(function(){
      groupTb.setTimeForLastestMsg(d.groupId);
      groupMsgDetail.add({
        groupId: d.groupId,
        senderId: d.senderId,
        content: d.msg,
        type: "text"
      });
      let user = await(userTb.getUser({id: d.senderId}));
      let listUsername = await(groupMembersDetail.get({groupId: d.groupId})).map(e => {
        let u = await(userTb.getUser({id: e.userid}));
        return u[0].username;
      })
      return {
        user: user,
        listUsername: listUsername
      };
    })
    add2db()
    .then(rs => {
      let sendData = {
        groupId: d.groupId,
        senderId: d.senderId,
        senderUsername: rs.user[0].username,
        msg: d.msg,
        type: "text",
        isGroup: true
      }
      console.log(sendData);
      io.emit(`RESPONSE_TO_${d.senderUsername}`, sendData);
      rs.listUsername.forEach(username => {
        if (username != socket.username) io.emit(`MESSAGE_TO_${username}`, sendData);
      })
    })
  });

  // 4. Click on group chat
  socket.on("USER_CONNECT_GROUP", function(d){
    let getHistory = async(function(){
      let history = await(groupMsgDetail.getHistory(d.groupId)).map(e => {
        e.sender_username = await(userTb.getUser({id: e.sender_id}))[0].username;
        return e;
      })
      groupMembersDetail.makeSeen({
        groupId: d.groupId,
        userId: socket.userID
      })
      return history;
    });
    getHistory()
    .then(rs => {
      // console.log(rs);
      io.emit(`HISTORY_USER_USER_${d.senderUsername}`,{
        historyChat: rs
      });
    })
    .catch(err => err);
  });

  // 5. User send a file to a group
  socket.on("FILE_USER_TO_GROUP", function(d){
    // base64file is the data that sent from client-side
    let base64file = d.base64file.split(';base64,').pop();
    let isImg = ["jpg","png","jpeg"].includes(d.fileExt);
    let link = isImg ? "img":"others";
    let typeF = isImg ? "img":"file";
    // console.log(d);
    // genName is a Promise that generate random name for that base64file
    let process = async(function(){
      let user = await(userTb.getUser({id: d.senderId}));
      let listUsername = await(groupMembersDetail.get({groupId: d.groupId})).map(e => {
        let u = await(userTb.getUser({id: e.userid}));
        return u[0].username;
      })
      return{
        sendUser: user,
        listUsername: listUsername,
        newName: new Array(10).fill().map(c => c = String.fromCharCode(Math.floor(Math.random()*(122+1-97)+97)))
      }
    })
    process().then(rs => {
      let newName = rs.newName.toString().replace(/,/g,"");
      let sendData = undefined;
      // Create that base64file with the name that created above, then save it in folder "files"
      fs.writeFile(
        path.join(__dirname,"files",link,`${newName}.${d.fileExt}`), 
        base64file, 
        {encoding: 'base64'}, 
        function(err) {
          if (err) console.log(err);
          else{
            // We just need to save the link of that file which created above
            if (typeF == "img"){
              groupMsgDetail.add({
                groupId: d.groupId,
                senderId: d.senderId,
                content: `${link}/${newName}.${d.fileExt}`,
                type: typeF
              })
              sendData = {
                senderUsername: rs.sendUser[0].username,
                senderId: d.senderId,
                isGroup: true,
                groupId: d.groupId,
                msg: `${link}/${newName}.${d.fileExt}`,
                type: typeF
              }
            }
            else if (typeF == "file"){
              groupMsgDetail.add({
                groupId: d.groupId,
                senderId: d.senderId,
                content: `${link}/${newName}.${d.fileExt}:${d.realName}`,
                type: typeF
              })
              sendData = {
                senderUsername: rs.sendUser[0].username,
                senderId: d.senderId,
                isGroup: true,
                groupId: d.groupId,
                msg: `${link}/${newName}.${d.fileExt}:${d.realName}`,
                type: typeF
              }
            }
            
            console.log(sendData);
            
            // Response the image to the sender
            io.emit(`RESPONSE_TO_${d.senderUsername}`, sendData);
            console.log(rs.listUsername);
            rs.listUsername.forEach(username => {
              if (username != socket.username){
                // Send the image to the receiver
                io.emit(`MESSAGE_TO_${username}`, sendData);
              }
            })
          }
      });
    });
  })
  socket.on("disconnect",() => console.log("Disconnect"))
});