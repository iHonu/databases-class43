const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'week3',
});

connection.connect();

const createAccountsTable = `CREATE TABLE IF NOT EXISTS accounts (
  account_number INT NOT NULL PRIMARY KEY,
  balance INT
);`;

const createAccountChanges = `CREATE TABLE IF NOT EXISTS account_changes (
  change_number INT AUTO_INCREMENT PRIMARY KEY,
  account_number INT,
  amount INT,
  changed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remark TEXT,
  FOREIGN KEY (account_number) REFERENCES accounts(account_number)
);`;

connection.query(createAccountsTable, (error, results, fields) => {
  if (error) throw error;
  console.log('Created accounts table');
});

connection.query(createAccountChanges, (error, results, fields) => {
  if (error) throw error;
  console.log('Created account_changes table');
});

connection.end();
