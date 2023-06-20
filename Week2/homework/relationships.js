const connection = require('./db');
const { createTableAuthors, addMentorToAuthors } = require('./keys');

const createTableResearchPapers = async () => {
  const researchPapersTableQuery = `
    CREATE TABLE research_papers (
      paper_id INT AUTO_INCREMENT,
      paper_title VARCHAR(255),
      conference VARCHAR(255),
      published_date DATE,
      PRIMARY KEY(paper_id)
    );
  `;

  await connection.query(researchPapersTableQuery);
  console.log('Research papers table created');
};

const createTableRelationships = async () => {
  const createRelationshipsQuery = `
    CREATE TABLE author_papers (
      author_id INT,
      paper_id INT,
      PRIMARY KEY (author_id, paper_id),
      FOREIGN KEY (author_id) REFERENCES authors(author_id),
      FOREIGN KEY (paper_id) REFERENCES research_papers(paper_id)
    );
  `;

  await connection.query(createRelationshipsQuery);
  console.log('Author-papers table created');
};

const populateAuthors = async () => {
  await connection.query('SET foreign_key_checks = 0');

  const insertAuthorsQuery = `
  INSERT INTO authors 
  (author_name, university, date_of_birth, h_index, gender, mentor) 
  VALUES 
  ('Alice Johnson', 'University of Oxford', '1976-01-01', 52, 'Female', 3),
  ('Bob Smith', 'Stanford University', '1965-02-20', 67, 'Male', 1),
  ('Charlie Brown', 'Harvard University', '1972-03-10', 71, 'Male', 10),
  ('David Wilson', 'University of Cambridge', '1980-04-15', 61, 'Male', 2),
  ('Elizabeth Davis', 'University of Oxford', '1985-05-25', 55, 'Female', 12),
  ('Frank Miller', 'University of Chicago', '1975-06-05', 68, 'Male', 3),
  ('Grace Thomas', 'University of Cambridge', '1987-07-15', 59, 'Female', 3),
  ('Henry White', 'Stanford University', '1982-08-20', 70, 'Male', 4),
  ('Irene Garcia', 'Harvard University', '1978-09-10', 60, 'Female', 6),
  ('Jack Martinez', 'University of Oxford', '1984-10-15', 64, 'Male', 14),
  ('Karen Anderson', 'University of Cambridge', '1981-11-05', 56, 'Female', 5),
  ('Louis Hernandez', 'Stanford University', '1977-12-20', 72, 'Male', 13),
  ('Mary Lee', 'University of Cambridge', '1986-01-10', 57, 'Female', 6),
  ('Norman King', 'Harvard University', '1983-02-15', 65, 'Male', 14),
  ('Olivia Green', 'Stanford University', '1988-03-05', 58, 'Female', 7);
  `;

  await connection.query(insertAuthorsQuery);
  console.log('Authors inserted');

  await connection.query('SET foreign_key_checks = 1');
};

const populatePapers = async () => {
  const insertPapersQuery = `
  INSERT INTO research_papers
  (paper_title, conference, published_date)
  VALUES
  ('The modern London', 'IEAE', '2023-05-23'),
  ('The future of Paris', 'IKE', '2023-01-01'),
  ('The history of London', 'IEEE', '2023-02-01'),
  ('The future of Paris', 'IEEE', '2023-01-11'),
  ('The history of Rome', 'IEEE', '2023-05-05'),
  ('The modern Berlin', 'IEEE', '2023-01-19'),
  ('The history of Madrid', 'IKE', '2023-01-01'),
  ('The future of Lisbon', 'IEEE', '2023-02-21'),
  ('The history of Amsterdam', 'IEEE', '2023-05-04'),
  ('The history of Vienna', 'IEEE', '2023-02-24'),
  ('The future of Budapest', 'IEEE', '2023-04-06'),
  ('The history of Prague', 'IEEE', '2022-12-10'),
  ('The future of Warsaw', 'IKE', '2023-05-21'),
  ('The history of Kiev', 'IEEE', '2023-04-16'),
  ('The modern Moscow', 'IKE', '2022-08-01'),
  ('The history of Athens', 'IEEE', '2022-11-21'),
  ('The future of Istanbul', 'IEEE', '2022-09-11'),
  ('The history of Cairo', 'IEEE', '2023-02-03'),
  ('The future of Jerusalem', 'IEEE', '2023-06-18'),
  ('The modern Beirut', 'IEEE', '2023-02-13'),
  ('The history of Baghdad', 'IEEE', '2022-11-15'),
  ('The future of Tehran', 'IEEE', '2023-01-21'),
  ('The history of Riyadh', 'IEEE', '2022-12-21'),
  ('The modern Dubai', 'IEEE', '2023-03-27'),
  ('The history of Mumbai', 'IEEE', '2022-10-24'),
  ('The future of Karachi', 'IKE', '2022-09-27'),
  ('The history of Dhaka', 'IEEE', '2023-04-17'),
  ('The future of Kolkata', 'IEEE', '2023-01-12'),
  ('The history of Bangkok', 'IEEE', '2022-11-21'),
  ('The modern Singapore', 'IEEE', '2023-05-01');
  `;
  await connection.query(insertPapersQuery);
  console.log('Papers inserted');
};

const linkAuthorsAndPapers = () => {
  const linkAuthorsAndPapersQuery = `
    INSERT INTO author_papers 
    (author_id, paper_id) 
    VALUES 
    (4, 1), (2, 2), (7, 3), (3, 4),  (13, 4),(1, 5), (13, 6), (3, 7), (6, 8), (8, 9), (14, 10),
    (9, 11), (11, 12), (15, 13), (11, 13), (5, 14), (3, 15),(9, 15),(14, 15), (15, 16), (11, 17), (1, 18), (7, 19),
    (9, 20), (15, 21), (8, 22), (3, 23), (13, 24), (9, 25), (4, 26), (12, 27), (2, 27),(15, 28),
    (11, 29), (2, 30);
  `;

  connection.query(linkAuthorsAndPapersQuery, (error, result) => {
    if (error) throw error;
    console.log('Author-paper links created');
  });
};

const makeDatabase = async () => {
  try {
    await createTableAuthors();
    await addMentorToAuthors();
    await createTableResearchPapers();
    await createTableRelationships();
    await populateAuthors();
    await populatePapers();
    await linkAuthorsAndPapers();
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
};

makeDatabase();
