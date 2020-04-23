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
  getUser(d = {username, email}){
    if (d.username != undefined){
      return new Promise((resolve,reject) => {
        this.conn.query(`SELECT * FROM ${tbName.users} WHERE username='${d.username}'`, (err, rs) => {
          if (err) reject(err);
          else resolve(rs);
        });
      });
    }
    else if (d.email != undefined){
      return new Promise((resolve,reject) => {
        this.conn.query(`SELECT * FROM ${tbName.users} WHERE email='${d.email}'`, (err, rs) => {
          if (err) reject(err);
          else resolve(rs);
        });
      });
    }
    else{
      return new Promise((resolve,reject) => {
        this.conn.query(`SELECT * FROM ${tbName.users} WHERE username='${d.username}'
        AND email='${d.email}'`, (err, rs) => {
          if (err) reject(err);
          else resolve(rs);
        });
      });
    }
  }
  find(clue){
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ${tbName.users} WHERE LOCATE('${clue}',fullname) > 0 OR
      LOCATE('${clue}',username) > 0 OR LOCATE('${clue}',email) > 0`, (err, rs) => {
        if (err) reject(err);
        else resolve(rs);
      });
    });
  }
}


module.exports = Users;