const mysql = require("mysql");
const tbName = require("./tableNames");

class GroupsMsgDetail{
  constructor(connection = mysql.createConnection()){
    this.conn = connection;
  }

  getHistory(groupId){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.groupMsgDetail} AS GMSG WHERE GMSG.groupId = ${groupId}
      ORDER BY GMSG.sent_at ASC`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      })
    });
  }

  getLastestMsg(groupId){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.groupMsgDetail} AS GMSG WHERE GMSG.groupId = ${groupId}
      ORDER BY GMSG.sent_at DESC LIMIT 1`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      })
    });
  }
}

module.exports = GroupsMsgDetail;