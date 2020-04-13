const mysql = require("mysql");
const tbName = require("./tableNames");

class Users{
  constructor(connection = mysql.createConnection()){
    this.conn = connection;
  }
  addUser(username,password,email,fullname,gender){
    this.conn.query(`INSERT INTO ${tbName.users} (username,password,email,fullname,gender) VALUES
    ('${username}','${password}','${email}','${fullname}',${gender})`, err => {
      if (err) throw err;
    });
  }
  getAll(){
    return new Promise((resolve,reject) => {
      this.conn.query(`SELECT * FROM ${tbName.users}`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }
  getUser(username){
    return new Promise((resolve,reject) => {
      this.conn.query(`SELECT * FROM ${tbName.users} WHERE username='${username}'`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }
}


module.exports = Users;