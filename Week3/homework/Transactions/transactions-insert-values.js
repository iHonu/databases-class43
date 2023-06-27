const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'week3',
});

connection.connect();

const insertIntoAccount = `INSERT INTO accounts(account_number, balance) 
VALUES (101, 5000), (102, 3000), (103, 2000);`;

const insertIntoAccountChanges = `INSERT INTO account_changes(account_number, amount, remark)
VALUES (101, 500.00, 'Deposit'), (102, 1500.00, 'Deposit'), (103, 500.00, 'Withdraw');`;

connection.query(insertIntoAccount, (error, results, fields) => {
  if (error) throw error;
  console.log('Inserted data into accounts table');
});

connection.query(insertIntoAccountChanges, (error, results, fields) => {
  if (error) throw error;
  console.log('Inserted data into account_changes table');
});

connection.end();
