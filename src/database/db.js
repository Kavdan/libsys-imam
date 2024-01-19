const sqlite3 = require("sqlite3").verbose();
const path = require("node:path");

const uid = function(){
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const getConnection = () => {
  return new Promise((resolve, reject) => {
    const connection = new sqlite3.Database(
      path.join(__dirname, "schoolLibrary.db"),
      (err) => {
        if (err) {
          reject(err);
        }
        console.log('Connected to the SQlite database.');
        resolve(connection);
      }
    );
  });
}




module.exports = {
  uid,
  getConnection
}




