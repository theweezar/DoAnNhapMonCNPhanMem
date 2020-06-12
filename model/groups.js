const mysql = require("mysql");
const tbName = require("./tableNames");

class Groups{
  constructor(connection = mysql.createConnection()){
    this.conn = connection;
  }

  create(d = {userId, groupName}){
    this.conn.query(`INSERT INTO ${tbName.groups} (creatorid, name, recent) VALUES
    ('${d.userId}','${d.groupName}',now())`, err => err);
  }

  getGroup(userId){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.groups} AS G JOIN ${tbName.groupMemberDetail} AS GM ON
      G.id = GM.id WHERE GM.userid = ${userId} ORDER BY G.recent DESC`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }

  getNewestGroup(){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.groups} ORDER BY id DESC`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }

  getLastestTextedGroup(userId){
    // Forget to set LIMIT 1 in this query
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.groups} AS G JOIN ${tbName.groupMemberDetail} AS GM ON
      G.id = GM.id WHERE GM.userid = ${userId} ORDER BY G.recent DESC LIMIT 1`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }

}

module.exports = Groups;