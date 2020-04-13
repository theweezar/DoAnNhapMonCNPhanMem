const mysql = require("mysql");
const tbName = require("./tableNames");

class Friends{
  constructor(connection = mysql.createConnection()){
    this.conn = connection;
  }
  addFriend(userID1,userID2){
    this.conn.query(`INSERT INTO ${tbName.friends} (userId_1,userId_2) VALUES
    (${userID1},${userID2})`, err => {
      if (err) throw err;
    })
  }
  getFriends(userID){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.friends} JOIN ${tbName.users} ON 
      ${tbName.users}.id = IF(${tbName.friends}.userId_1 = ${userID},${tbName.friends}.userId_2,${tbName.friends}.userId_1) 
      WHERE ${tbName.friends}.userId_1 = ${userID} OR ${tbName.friends}.userId_2 = ${userID}
      `, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }
}


module.exports = Friends;