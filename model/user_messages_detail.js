const mysql = require("mysql");
const tbName = require("./tableNames");

class UserMessagesDetail{
  constructor(connection = mysql.createConnection()){
    this.conn = connection;
  }
  getHistory(chatID){

  }
}