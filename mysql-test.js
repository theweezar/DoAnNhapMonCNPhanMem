
// This file just to test connection and query 

const mysql = require("mysql");
const async = require("asyncawait/async");
const await = require("asyncawait/await");

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

const table = {
  users: require("./model/users"),
  friends: require("./model/friends"),
  userMsgDetail: require("./model/user_messages_detail")
};

const userTb = new table.users(conn);
const friendTb = new table.friends(conn);
const userMsgDetail = new table.userMsgDetail(conn);
// userTb.addUser("admin","Adminpro3010","minhduc@gmail.com","Minh Duc",1);
// userTb.addUser("dai_ga_vl","Dai_ga_vl3008","Dai@gmail.com","Phan Dai",1);
// userTb.addUser("ngoctrinhsexy","Ngoctrinhsexy90","ngoctrinh@gmail.com","Ngoc Trinh",0);

// userTb.getUser("admin").then(rs => console.log(rs)).catch(err => err);
// userTb.getAll().then(rs => console.log(rs)).catch(err => err);

// friendTb.getFriends(1).then(rs => console.log(rs)).catch(err => err);
// friendTb.getChatID('dai_ga_vl','admin').then(rs => console.log(rs)).catch(err => err);

let allLastestMsg = async (function(){
  let friendList = await (friendTb.getFriends(1));
  let allLastestMsg = friendList.map(friend => {
    return await(userMsgDetail.getLastestMsg('admin', friend.username));
  });
  return allLastestMsg;
});

allLastestMsg().then(rs => console.log(rs)).catch(err => {throw err;});