const express = require("express");
const app = express();
const path = require("path");
const socketIO = require("socket.io");
const exphbs = require("express-handlebars");
const PORT = process.env.PORT | 8080;
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
app.engine('handlebars', exphbs({defaultLayout:'main'})); 
app.set('view engine', 'handlebars');

// use public resources such as css, js client side
app.use(express.static(path.join(__dirname,"public")));
// use socket module for client side 
app.use(express.static(path.join(__dirname,"node_modules","socket.io-client","dist")));
// 
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
  userTb.getUser(username)
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
    if (password === rePassword){
      let fullname = `${firstName} ${lastName}`;
      userTb.addUser(username,password,email,fullname,gender);
      res.redirect("/login");
    }
  }
  else res.redirect("/register");
})

app.get("/logout",(req,res) => {
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
  // Find user's friend in database and display it in client side
  // Find your message history and the lasted person who texted to you - Sent msg and rcv msg
  let getEverything = async (function(){
    let friendList = await(friendTb.getFriends(req.session.userID));
    return {friendList:friendList};
  });
  getEverything()
  .then(rs => {
    res.render("app",{
      logged:true,
      data:rs,
      myUsername:req.session.username,
      myID:req.session.userID
    });
  })
  .catch(err => {throw err;})
})

app.get("/app/chat/:username",mdW.redirectLogin,(req,res) => {

})

const server = app.listen(PORT,() => {
  console.log(`Server is running on PORT: ${PORT} !!!!`);
})

const io = socketIO(server);

io.on("connection",socket => {
  socket.on("CONNECT_TO_SERVER",d => {
    console.log(`${d.username} is connected to the server !`);
  });

  // ================================== USER TO USER ======================================= //

  socket.on("USER_CONNECT_USER",d => {
    // userTb.getUser(d.rcvUsername).then(user => {return user.id}).catch(err => {throw err});
    let getMsg = async(function(){
      // let friendID = await(userTb.getUser(d.rcvUsername));
      // let chatID = await(friendTb.getChatID(d.senderID,friendID[0].id));
      let historyChat = await(userMsgDetail.getHistory(d.senderUsername,d.rcvUsername));
      return historyChat;
    });
    getMsg().then(rs => {
      io.emit("HISTORY_DATA_USER_TO_USER",{
        historyChat:rs
      });
    }).catch(err => {throw err});
  });
  socket.on("MESSAGE_USER_TO_USER",d => {
    // userMsgDetail.addMsg({
      // senderUsername:d.senderUsername,
      // rcvUsername:d.rcvUsername,
      // content:d.msg
    // });
    console.log(d);
    io.emit(`MESSAGE_TO_${d.rcvUsername}`,{
      senderUsername:d.senderUsername,
      rcvUsername:d.rcvUsername,
      content:d.msg
    });
  })

  // =================================== USER TO GROUP ===================================== //

  socket.on("disconnect",() => console.log("Disconnect"))
})