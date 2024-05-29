var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "quanlytask"
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = db;