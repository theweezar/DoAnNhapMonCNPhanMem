
// This file just to test connection and query 

const mysql = require("mysql");
const conn = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"test"
});
conn.connect(err => {
  if (err) throw err;
  else console.log("Connected to database successfully !");
})
