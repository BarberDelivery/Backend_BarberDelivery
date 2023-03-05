const { MongoClient } = require("mongodb");

// const connectionString = process.env.MONGO_STRING;
const connectionString = "mongodb+srv://barber:JGZS6z4gIi5JhhAK@cluster0.7o8upof.mongodb.net/test";

let db = null;

const mongoConnect = async () => {
  const client = new MongoClient(connectionString);

  try {
    const database = client.db("dexbarber");

    db = database;

    return database;
  } catch (err) {
    await client.close();
  }
};

const getDatabase = () => db;

module.exports = {
  mongoConnect,

  getDatabase,
};
