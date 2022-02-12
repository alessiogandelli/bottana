var MongoClient = require('mongodb').MongoClient;

let connection;

async function connect(){
  connection = await (new MongoClient(process.env.CONNECTION_STRING , { useUnifiedTopology: true }).connect());

  return connection
}

function getConnection() {
  if (connection === null) {
      throw new Error('Connection not found');
  }
  return connection;
}

function closeConnection() {
  connection?.close();
  connection = null;
}

function getDb(){
  if (connection === null) {
      throw new Error('Connection not found');
  }
  return connection?.db(process.env.DEFAULT_DB);
}

function getCollection(collection){
  return getDb().collection(collection);
}

function cleanCollection(collection){
  getCollection(collection).remove({}) // deprecato 
}


module.exports = {
  connect: connect,
  getConnection: getConnection,
  closeConnection: closeConnection,
  getCollection: getCollection,
  cleanCollection: cleanCollection
};