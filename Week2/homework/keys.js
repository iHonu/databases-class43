const connection = require('./db');

const createTableAuthors = async () => {
  const authorsTableQuery = `
    CREATE TABLE authors (
      author_id INT AUTO_INCREMENT,
      author_name VARCHAR(255),
      university VARCHAR(255),
      date_of_birth DATE,
      h_index INT,
      gender ENUM('Female', 'Male', 'Other'),
      PRIMARY KEY(author_id)
    );
  `;

  await connection.query(authorsTableQuery);
  console.log('Authors table created');
};

const addMentorToAuthors = async () => {
  const addMentorColumn = `
    ALTER TABLE authors
    ADD mentor INT,
    ADD FOREIGN KEY (mentor) REFERENCES authors(author_id);
  `;

  await connection.query(addMentorColumn);
  console.log('Mentor column added');
};

module.exports = { createTableAuthors, addMentorToAuthors };
