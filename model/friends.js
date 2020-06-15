const mysql = require("mysql");
const tbName = require("./tableNames");

class Friends{
  constructor(connection = mysql.createConnection()){
    this.conn = connection;
  }
  request(userID1, userID2){
    this.conn.query(`INSERT INTO ${tbName.friends} (userId_1,userId_2,accept,recent) VALUES
    (${userID1},${userID2},0,now())`, err => {
      if (err) throw err;
    });
  }
  accept(userID1, userID2){
    this.conn.query(`UPDATE ${tbName.friends} SET accept = 1, recent = now() WHERE
    userId_1 = ${userID1} AND userId_2 = ${userID2} OR
    userId_1 = ${userID2} AND userId_2 = ${userID1}`, err => err);
  }
  decline(userID1, userID2){
    this.conn.query(`DELETE FROM ${tbName.friends} WHERE 
    userId_1 = ${userID1} AND userId_2 = ${userID2} OR
    userId_1 = ${userID2} AND userId_2 = ${userID1} `, err => err);
  }
  getTheLastestTextedFriend(userID){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.friends} JOIN ${tbName.users} ON 
      ${tbName.users}.id = IF(${tbName.friends}.userId_1 = ${userID},${tbName.friends}.userId_2,
      ${tbName.friends}.userId_1) WHERE ${tbName.friends}.userId_1 = ${userID} AND 
      ${tbName.friends}.accept = 1 OR ${tbName.friends}.userId_2 = ${userID} AND
      ${tbName.friends}.accept = 1 ORDER BY
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
      ${tbName.friends}.userId_1) WHERE ${tbName.friends}.userId_1 = ${userID} AND 
      ${tbName.friends}.accept = 1 OR 
      ${tbName.friends}.userId_2 = ${userID} AND ${tbName.friends}.accept = 1 ORDER BY
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
    this.conn.query(`UPDATE ${tbName.friends} SET recent = now() WHERE ${tbName.friends}.id = ${chatID}`, err => err);
  }
  find(userID,clue){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT *, LOCATE('${clue}', ${tbName.users}.fullname) AS location FROM ${tbName.friends} JOIN ${tbName.users} ON 
      ${tbName.users}.id = IF(${tbName.friends}.userId_1 = ${userID},${tbName.friends}.userId_2,
      ${tbName.friends}.userId_1) WHERE ${tbName.friends}.userId_1 = ${userID} AND 
      ${tbName.friends}.accept = 1 OR ${tbName.friends}.userId_2 = ${userID} AND ${tbName.friends}.accept = 1 ORDER BY
      location DESC`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }
}


module.exports = Friends;