const mysql = require("mysql");
const tbName = require("./tableNames");

class GroupsMembersDetail{
  constructor(connection = mysql.createConnection()){
    this.conn = connection;
  }

  add(d = {groupId, userId, isAdmin}){
    this.conn.query(`INSERT INTO ${tbName.groupMemberDetail} (id, userid, isAdmin, seen) VALUES
    (${d.groupId},${d.userId}, ${d.isAdmin}, 0)`, err => err);
  }

  get(d = {groupId, userId}){
    if (d.groupId != undefined && d.userId == undefined){
      return new Promise((resolve, reject) => {
        this.conn.query(`SELECT * FROM ${tbName.groupMemberDetail} AS GM WHERE GM.id = ${d.groupId}`, (err, rs) => {
          if (err) reject(err);
          else resolve(rs);
        })
      });  
    }
    else if (d.groupId == undefined && d.userId != undefined){
      return new Promise((resolve, reject) => {
        this.conn.query(`SELECT * FROM ${tbName.groupMemberDetail} AS GM WHERE GM.userid = ${d.userId}`, (err, rs) => {
          if (err) reject(err);
          else resolve(rs);
        })
      });
    }
    else if (d.groupId != undefined && d.userId != undefined){
      return new Promise((resolve, reject) => {
        this.conn.query(`SELECT * FROM ${tbName.groupMemberDetail} AS GM WHERE GM.id = ${d.groupId} AND
        GM.userid = ${d.userId}`, (err, rs) => {
          if (err) reject(err);
          else resolve(rs);
        })
      });
    }
  }

  makeSeen(d = {groupId, userId}){
    this.conn.query(`UPDATE ${tbName.groupMemberDetail} SET seen = 1 WHERE id = ${d.groupId} AND
    userid = ${d.userId}`, err => err);
  }

  
}

module.exports = GroupsMembersDetail;