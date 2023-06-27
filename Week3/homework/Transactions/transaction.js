const mysql = require('mysql2/promise');

async function transfer() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'hyfuser',
    password: 'hyfpassword',
    database: 'week3',
  });

  try {
    await connection.beginTransaction();

    const query1 =
      'UPDATE accounts SET balance = balance - 1000 WHERE account_number = 101';
    await connection.query(query1);

    const query2 =
      'UPDATE accounts SET balance = balance + 1000 WHERE account_number = 102';
    await connection.query(query2);

    const logChanges = `INSERT INTO account_changes(account_number, amount, remark) VALUES (101, -1000, 'Transferred to 102'), (102, 1000, 'Received from 101')`;
    await connection.query(logChanges);

    await connection.commit();
    console.log('Transaction Completed Successfully.');
  } catch (error) {
    await connection.rollback();
    console.error('Transaction Failed.', error);
  } finally {
    await connection.end();
  }
}

transfer();
