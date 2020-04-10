const mysql = require("mysql");

class Friends{
  constructor(connection = mysql.createConnection()){
    this.conn = connection;
    this.tableName = "friends";
  }
  addFriend(userID1,userID2){
    this.conn.query(`INSERT INTO ${this.tableName} (userId_1,userId_2) VALUES
    (${userID1},${userID2})`, err => {
      if (err) throw err;
    })
  }
  getFriends(userID){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${this.tableName} JOIN users ON 
      users.id = IF(friends.userId_1 = ${userID},friends.userId_2,friends.userId_1) 
      WHERE friends.userId_1 = ${userID} OR friends.userId_2 = ${userID}
      `, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }
}


module.exports = Friends;