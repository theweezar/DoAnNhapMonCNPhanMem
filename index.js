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
  userMsgDetail: require("./model/user_messages_detail")
};
const mdW = require("./middleware.js");
const s = require("./validation");
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
});

app.get("/login",mdW.redirectApp,(req,res) => {
  res.render("login");
})

app.post("/login",(req,res) => {
  let username = s.validateString(req.body.username.trim());
  let password = s.validatePassword(req.body.password.trim());
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
  let gender = (req.body.gender === "0" || req.body.gender === "1" ? req.body.gender:"");
  let username = (req.body.username.length >= 9 && req.body.username.length <= 20 ? s.validateString(req.body.username.trim()):"");
  let email = s.validateEmail(req.body.email.trim());
  let password = s.validatePassword(req.body.password.trim());
  let rePassword = s.validatePassword(req.body.rePassword.trim());
  if (
    firstName !== "" && lastName !== "" && gender !== "" && username !== "" &&
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
      else if (rs.checkUsername.length !== 0) res.render("/register",{emailErr: true});
      else if (password !== rePassword) res.render("/register",{passwordErr: true});
      else{
        let fullname = `${firstName} ${lastName}`;
        userTb.addUser(username, password, email, fullname, gender);
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
  let getEverything = async (function(){
    // The lastest texted friend
    let tLTF = await(friendTb.getTheLastestTextedFriend(req.session.userID));
    return tLTF;
  });
  getEverything()
  .then(rs => {
    res.redirect(`/app/chat/${rs[0].username}`);
  })
  .catch(err => {throw err;});
})

app.get("/app/chat/:username",mdW.redirectLogin, (req, res) => {
  let getData = async (function(){
    // Find user's friend in database and display it in client side
    let friendList = await(friendTb.getFriends(req.session.userID));
    // Find your message history and the lasted person who texted to you - Sent msg and rcv msg
    let historyChat = await(userMsgDetail.getHistory(req.session.username, req.params.username)).map(row => {
      if (row.sender_username == req.session.username) row.isSender = true;
      else row.isSender = false;
      if (row.type == "text") row.text = true;
      else if (row.type == "img") row.img = true;
      return row;
    })
    // Find all the lastest unseen or seen messages of you and your friends then display it on screen
    let allLastestMsg = friendList.map(friend => {
      return await(userMsgDetail.getLastestMsg(req.session.username, friend.username));
    })
    return {
      friendList: friendList,
      historyChat: historyChat,
      allLastestMsg: allLastestMsg
    };
  });
  getData()
  .then(rs => {
    // console.log(rs.allLastestMsg);
    rs.friendList.map((friend, i) => {
      friend.seenMsg = true;
      if (rs.allLastestMsg[i][0] !== undefined){
        friend.lastestMsg = rs.allLastestMsg[i][0].type == "text" ? rs.allLastestMsg[i][0].content : "File";
        friend.lastestSender = `${rs.allLastestMsg[i][0].sender_username}: `;
        // if seen = false then css will highlight the message
        if (rs.allLastestMsg[i][0].sender_username !== req.session.username){
          friend.seenMsg = (rs.allLastestMsg[i][0].seen == 0 ? false:true);
        }
      }
      else{
        friend.lastestMsg = "Nothing";
        friend.lastestSender = "";
      }
    });
    res.render("app",{
      logged: req.session.logged,
      data: rs,
      myUsername: req.session.username,
      myID: req.session.userID
    })
  })
  .catch(err => {throw err;});
})

const server = app.listen(PORT,() => {
  console.log(`Server is running on PORT: ${PORT} !!!!`);
})

const io = socketIO(server);

io.on("connection",socket => {
  socket.on("CONNECT_TO_SERVER",d => {
    console.log(`${d.username} is connected to the server !`);
    socket.username = d.username;
  });

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
            userMsgDetail.addMsg({
              senderUsername: d.senderUsername,
              rcvUsername: d.rcvUsername,
              content: `${link}/${newName}.${d.fileExt}`,
              type:"img"
            });
            let sendData = {
              senderUsername: d.senderUsername,
              rcvUsername: d.rcvUsername,
              msg: `${link}/${newName}.${d.fileExt}`,
              type: "img"
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

  socket.on("disconnect",() => console.log("Disconnect"))
});