const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGODB_URL;

async function transfer(fromAcc, toAcc, amount, remark) {
  const client = new MongoClient(url);
  let session;

  try {
    await client.connect();
    session = client.startSession();
    session.startTransaction();

    const db = client.db('databaseWeek4').collection('accounts');

    const fromAccount = await db.findOne({ account_number: fromAcc });
    const toAccount = await db.findOne({ account_number: toAcc });

    if (!fromAccount || !toAccount) {
      throw new Error('Both accounts must exist to perform a transfer.');
    }

    if (fromAccount.balance < amount) {
      throw new Error('Insufficient balance in the source account.');
    }

    const fromNewBalance = fromAccount.balance - amount;
    const fromNewChangeNumber = fromAccount.account_changes.length + 1;
    await db.updateOne(
      { account_number: fromAcc },
      {
        $set: { balance: fromNewBalance },
        $push: {
          account_changes: {
            change_number: fromNewChangeNumber,
            amount: -amount,
            changed_date: new Date(),
            remark,
          },
        },
      },
    );

    const toNewBalance = toAccount.balance + amount;
    const toNewChangeNumber = toAccount.account_changes.length + 1;
    await db.updateOne(
      { account_number: toAcc },
      {
        $set: { balance: toNewBalance },
        $push: {
          account_changes: {
            change_number: toNewChangeNumber,
            amount,
            changed_date: new Date(),
            remark,
          },
        },
      },
    );

    await session.commitTransaction();
    console.log('Transfer completed successfully.');
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    console.log(error);
  } finally {
    if (session) {
      session.endSession();
    }
    await client.close();
  }
}

module.exports = transfer;
