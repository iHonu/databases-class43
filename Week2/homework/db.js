const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'week2',
});

connection.query = util.promisify(connection.query);

module.exports = connection;
