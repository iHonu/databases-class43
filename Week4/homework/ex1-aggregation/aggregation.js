const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

async function totalPopulation(country) {
  try {
    await client.connect();
    const query = [
      { $match: { Country: country } },
      {
        $group: {
          _id: '$Year',
          countPopulation: { $sum: { $add: ['$M', '$F'] } },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const result = await client
      .db('databaseWeek4')
      .collection('Aggregation')
      .aggregate(query)
      .toArray();

    return result;
  } catch (error) {
    console.log(error);
  }
}

async function getPopulationYearAge(year, age) {
  try {
    const continents = [
      'AFRICA',
      'ASIA',
      'EUROPE',
      'LATIN AMERICA AND THE CARIBBEAN',
      'NORTHERN AMERICA',
      'OCEANIA',
    ];
    const query = [
      { $match: { Country: { $in: continents }, Year: year, Age: age } },
      {
        $addFields: {
          TotalPopulation: { $add: ['$M', '$F'] },
        },
      },
    ];

    const result = await client
      .db('databaseWeek4')
      .collection('Aggregation')
      .aggregate(query)
      .toArray();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Execute functions and close the connection
async function executeFunctionsAndCloseConnection() {
  try {
    await client.connect();
    const totalPopResult = await totalPopulation('Netherlands');
    console.log(totalPopResult);

    const popYearAgeResult = await getPopulationYearAge(2020, '100+');
    console.log(popYearAgeResult);
  } catch (error) {
    console.error('Error executing functions:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

executeFunctionsAndCloseConnection();
