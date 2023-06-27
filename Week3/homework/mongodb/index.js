const { MongoClient, ServerApiVersion } = require('mongodb');

const { seedDatabase } = require('./seedDatabase.js');

require('dotenv').config();

async function createEpisodeExercise(client) {
  const result = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .insertOne({
      episode: 'S09E13',
      title: 'MOUNTAIN HIDE-AWAY',
      elements: [
        'CIRRUS',
        'CLOUDS',
        'CONIFER',
        'DECIDIOUS',
        'GRASS',
        'MOUNTAIN',
        'MOUNTAINS',
        'RIVER',
        'SNOWY_MOUNTAIN',
        'TREE',
        'TREES',
      ],
    });
  console.log(
    `Created season 9 episode 13 and the document got the id ${result.insertedId}`,
  );
}

async function findEpisodesExercises(client) {
  const titleS02E02 = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .findOne({ episode: 'S02E02' });

  console.log(`The title of episode 2 in season 2 is ${titleS02E02.title}`);

  const seasonBlackRiver = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .findOne({ title: 'BLACK RIVER' });

  console.log(
    `The season and episode number of the "BLACK RIVER" episode is ${seasonBlackRiver.episode}`,
  );

  const episodesWithCliff = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .find({ elements: 'CLIFF' })
    .toArray();

  const episodeWithCliffTitles = episodesWithCliff.map(
    (episode) => episode.title,
  );

  console.log(
    `The episodes that Bob Ross painted a CLIFF are ${episodeWithCliffTitles.join(
      ',',
    )}`,
  );

  const episodesWithCliffLighthouse = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .find({ elements: { $all: ['CLIFF', 'LIGHTHOUSE'] } })
    .toArray();

  const episodesWithCliffLighthouseTitle = episodesWithCliffLighthouse.map(
    (episode) => episode.title,
  );

  console.log(
    `The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are ${episodesWithCliffLighthouseTitle}`,
  );
}

async function updateEpisodeExercises(client) {
  const updateS30E13 = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .updateOne({ episode: 'S30E13' }, { $set: { title: 'BLUE RIDGE FALLS' } });

  console.log(
    `Ran a command to update episode 13 in season 30 and it updated ${updateS30E13.modifiedCount} episodes`,
  );

  const updateBush = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .updateMany(
      {
        elements: 'BUSHES',
      },
      { $set: { elements: 'BUSH' } },
    );

  console.log(
    `Ran a command to update all the BUSHES to BUSH and it updated ${updateBush.modifiedCount} episodes`,
  );
}

async function deleteEpisodeExercise(client) {
  const deleteS31E14 = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .deleteOne({ episode: 'S31E14' });

  console.log(
    `Ran a command to delete episode and it deleted ${deleteS31E14.deletedCount} episodes`,
  );
}

async function main() {
  if (process.env.MONGODB_URL == null) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to create it?`,
    );
  }
  const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();

    // Seed our database
    await seedDatabase(client);

    // CREATE
    await createEpisodeExercise(client);

    // READ
    await findEpisodesExercises(client);

    // UPDATE
    await updateEpisodeExercises(client);

    // DELETE
    await deleteEpisodeExercise(client);
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
}

main();
