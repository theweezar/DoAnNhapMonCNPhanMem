const mysql = require("mysql");

class Users{
  constructor(connection = mysql.createConnection()){
    this.conn = connection;
    this.tableName = "users";
  }
  addUser(username,password,email,fullname,gender){
    this.conn.query(`INSERT INTO ${this.tableName} (username,password,email,fullname,gender) VALUES
    ('${username}','${password}','${email}','${fullname}',${gender})`, err => {
      if (err) throw err;
    });
  }
  getAll(){
    return new Promise((resolve,reject) => {
      this.conn.query(`SELECT * FROM ${this.tableName}`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }
  getUser(username){
    return new Promise((resolve,reject) => {
      this.conn.query(`SELECT * FROM ${this.tableName} WHERE username='${username}'`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }
}


module.exports = Users;