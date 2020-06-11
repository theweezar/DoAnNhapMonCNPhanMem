const mysql = require("mysql");
const tbName = require("./tableNames");

class GroupsMembersDetail{
  constructor(connection = mysql.createConnection()){
    this.conn = connection;
  }

  add(d = {groupId, userId, isAdmin}){
    this.conn.query(`INSERT INTO ${tbName.groupMemberDetail} (id, userid, isAdmin) VALUES
    (${d.groupId},${d.userId}, ${d.isAdmin})`, err => err);
  }
}

module.exports = GroupsMembersDetail;