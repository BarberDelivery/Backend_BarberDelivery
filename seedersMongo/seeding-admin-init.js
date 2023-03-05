const { MongoClient } = require("mongodb");
const docs = require("./admin-init.json");
const PASSWORD_MONGO = process.env.PASSWORD_MONGO;

const uri = `mongodb+srv://barber:JGZS6z4gIi5JhhAK@cluster0.7o8upof.mongodb.net/test`;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("dexbarber");

    const users = database.collection("Admins");

    const option = { ordered: true };
    const result = await users.insertMany(docs, option);

    console.log(result);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
