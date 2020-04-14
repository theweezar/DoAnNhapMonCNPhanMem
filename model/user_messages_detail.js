const mysql = require("mysql");
const tbName = require("./tableNames");

class UserMessagesDetail{
  constructor(connection = mysql.createConnection()){
    this.conn = connection;
  }
  getHistory(username_1, username_2){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.userMsgDetail} WHERE sender_username = '${username_1}'
      AND rcv_username = '${username_2}' OR sender_username = '${username_2}'
      AND rcv_username = '${username_1}'`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      })
    });
  }
  addMsg(p = {senderUsername, rcvUsername, content, type:"text"}){
    this.conn.query(`INSERT INTO ${tbName.userMsgDetail} (sender_username, content, rcv_username, type)
    VALUES('${p.senderUsername}','${p.content}','${p.rcvUsername}','${p.type}')`, err => {
      if (err) throw err;
    })
  }
}

module.exports = UserMessagesDetail;