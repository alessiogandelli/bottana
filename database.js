var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.DB_URL, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});