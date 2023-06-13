const express = require('express');
const mysql = require('mysql');

const app = express();

const PORT = 3001;

const CONNECTION_CONFIG = {
  host: '127.0.0.1',
  user: 'hyfuser',
  password: 'hyfpassword',
};

const db = mysql.createConnection(CONNECTION_CONFIG);

app.get('/createDB', (req, res) => {
  db.query(`DROP DATABASE IF EXISTS meetup`, (error, result) => {
    if (error) {
      console.log(`Error while dropping database: `, error);
      res.status(500).send(`Error while dropping database`);
      return;
    }
    console.log(`Database dropped successfully`);

    db.query(`CREATE DATABASE IF NOT EXISTS meetup`, (error, result) => {
      if (error) {
        console.log(`Error while creating database: `, error);
        res.status(500).send(`Error while creating database`);
        return;
      }
      console.log(`Database created successfully`);

      db.changeUser({ database: 'meetup' }, function (err) {
        if (err) {
          console.log('Error in changing database', err);
          res.status(500).send('Error in changing database');
          return;
        }
      });

      res.status(200).send(result);
    });
  });
});

const CREATE_INVITEE_TABLE = `
  CREATE TABLE IF NOT EXISTS invitees (
    invitee_no INT AUTO_INCREMENT,
    invitee_name VARCHAR(50),
    invited_by VARCHAR(50),
    PRIMARY KEY (invitee_no)
  )`;

const CREATE_ROOM_TABLE = `
    CREATE TABLE IF NOT EXISTS rooms (
      room_no INT AUTO_INCREMENT,
      room_name VARCHAR(50),
      floor_number INT,
      PRIMARY KEY (room_no)
    )`;

const CREATE_MEETING_TABLE = `
  CREATE TABLE IF NOT EXISTS meeting (
    meeting_no INT AUTO_INCREMENT,
    meeting_title VARCHAR(50),
    starting_time DATE,
    ending_time TIME,
    room_no INT,
    PRIMARY KEY (meeting_no)
  )`;

app.get('/createTables', (req, res) => {
  db.query(CREATE_INVITEE_TABLE, (error, result) => {
    if (error) {
      console.log('Error while creating invitee table:', error);
      return res.status(500).send('Error while creating invitee table');
    }
    console.log('Invitee table created successfully');

    db.query(CREATE_ROOM_TABLE, (error, result) => {
      if (error) {
        console.log('Error while creating room table:', error);
        return res.status(500).send('Error while creating room table');
      }
      console.log('Room table created successfully');

      db.query(CREATE_MEETING_TABLE, (error, result) => {
        if (error) {
          console.log('Error while creating meeting table:', error);
          return res.status(500).send('Error while creating meeting table');
        }
        console.log('Meeting table created successfully');
        return res.status(201).send('All tables created successfully');
      });
    });
  });
});

const inviteeValues = `INSERT INTO invitees (invitee_name, invited_by) VALUES ('John', 'Alex'), ('Jane', 'Peter'), ('Nick', 'Sarah')`;
const roomValues = `INSERT INTO rooms (room_name, floor_number) VALUES ('Room 1', 2), ('Room 2', 4), ('Room 3', 9)`;
const meetingValues = `INSERT INTO meeting (meeting_title, starting_time, ending_time, room_no) VALUES 
('Meeting One', '2023-06-12', '10:00:00', 1), ('Meeting Two', '2023-06-12', '11:00:00', 2), ('Meeting Three', '2023-06-12', '12:00:00', 3)`;

app.get('/seedValues', (req, res) => {
  db.query(inviteeValues, (error, result) => {
    if (error) {
      console.log('Error while seeding invitee table');
      return res.status(500).send('Error while seeding invitee table');
    }
    console.log('Invitee table seeded successfully');

    db.query(roomValues, (error, result) => {
      if (error) {
        console.log('Error while seeding room table');
        return res.status(500).send('Error while seeding room table');
      }
      console.log('Room table seeded successfully');

      db.query(meetingValues, (error, result) => {
        if (error) {
          console.log('Error while seeding meeting table');
          return res.status(500).send('Error while seeding meeting table');
        }
        console.log('Meeting table seeded successfully');
        return res.status(201).send('All tables seeded successfully');
      });
    });
  });
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
