const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGODB_URL;

async function setup() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db('databaseWeek4').collection('accounts');

    await db.deleteMany({});

    const sampleAccounts = [
      {
        account_number: 101,
        balance: 7000,
        account_changes: [
          {
            change_number: 1,
            amount: 500,
            changed_date: new Date(),
            remark: 'Deposit',
          },
        ],
      },
      {
        account_number: 102,
        balance: 4000,
        account_changes: [
          {
            change_number: 1,
            amount: 3000,
            changed_date: new Date(),
            remark: 'Deposit',
          },
        ],
      },
    ];

    await db.insertMany(sampleAccounts);
    console.log('Sample accounts inserted');
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

module.exports = setup;
