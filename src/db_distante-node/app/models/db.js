const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");


const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

connection.connect(error => {
  if (error) throw error;
  console.log("Tu es bien connecté à la BDD gros BG");
});

module.exports = connection;