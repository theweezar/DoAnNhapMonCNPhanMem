const mysql = require("mysql");
const tbName = require("./tableNames");

class Friends{
  constructor(connection = mysql.createConnection()){
    this.conn = connection;
  }
  addFriend(userID1, userID2){
    this.conn.query(`INSERT INTO ${tbName.friends} (userId_1,userId_2) VALUES
    (${userID1},${userID2})`, err => {
      if (err) throw err;
    })
  }
  getTheLastestTextedFriend(userID){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.friends} JOIN ${tbName.users} ON 
      ${tbName.users}.id = IF(${tbName.friends}.userId_1 = ${userID},${tbName.friends}.userId_2,
      ${tbName.friends}.userId_1) WHERE ${tbName.friends}.userId_1 = ${userID} OR 
      ${tbName.friends}.userId_2 = ${userID} ORDER BY
      ${tbName.friends}.recent DESC LIMIT 1`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }
  getFriends(userID){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.friends} JOIN ${tbName.users} ON 
      ${tbName.users}.id = IF(${tbName.friends}.userId_1 = ${userID},${tbName.friends}.userId_2,
      ${tbName.friends}.userId_1) WHERE ${tbName.friends}.userId_1 = ${userID} OR 
      ${tbName.friends}.userId_2 = ${userID} ORDER BY
      ${tbName.friends}.recent DESC`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }
  // getChatID(userID1, userID2){
  //   return new Promise((resolve, reject) => {
  //     this.conn.query(`SELECT * FROM ${tbName.friends} WHERE userId_1 = ${userID1} 
  //     AND userId_2 = ${userID2} OR userId_1 = ${userID2} AND userId_2 = ${userID1}`, (err ,rs) => {
  //       if (err) reject(err);
  //       else resolve(rs);
  //     });
  //   });
  // }
  getChatID(username_1, username_2){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.friends} WHERE userId_1 = (SELECT id 
      FROM ${tbName.users} WHERE ${tbName.users}.username = '${username_1}') AND userId_2 = (SELECT id 
      FROM ${tbName.users} WHERE ${tbName.users}.username = '${username_2}') OR userId_1 = (SELECT id 
      FROM ${tbName.users} WHERE ${tbName.users}.username = '${username_2}') AND userId_2 = (SELECT id 
      FROM ${tbName.users} WHERE ${tbName.users}.username = '${username_1}')`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      })
    })
  }
  setTimeForLastestMsg(chatID){
    this.conn.query(`UPDATE ${tbName.friends} SET recent = now() WHERE id = ${chatID}`, err => err);
  }
  
}


module.exports = Friends;