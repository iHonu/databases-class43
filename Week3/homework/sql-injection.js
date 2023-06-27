// 1. To exploit SQL injection and fetch all records in the database, you can pass the following values as name and code parameters:

// name: "Netherlands' OR 'a'='a"
// code: 'NLD OR '1'='1"

function getPopulation(Country, name, code, cb) {
  // assuming that connection to the database is established and stored as conn
  const query = 'SELECT Population FROM ?? WHERE Name = ? and code = ?';
  const params = [Country, name, code];

  conn.query(query, params, function (err, result) {
    if (err) {
      cb(err);
    } else {
      if (result.length === 0) {
        cb(new Error('Not found'));
      } else {
        cb(null, result[0].Population);
      }
    }
  });
}
