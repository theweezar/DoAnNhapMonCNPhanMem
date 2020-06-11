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

  getLastestGroup(){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.groups} ORDER BY id DESC`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }
}

module.exports = Groups;