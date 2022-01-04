const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qu1uq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("bloodBank");
    const donateBloodsCollection = database.collection("donateBloods");
    const donateBloodsHistoryCollection = database.collection(
      "donateBloodsHistory"
    );
    const bloodRequestsCollection = database.collection("bloodRequests");
    const bloodRequestsHistoryCollection = database.collection(
      "bloodRequestsHistory"
    );

    // POST API
    app.post("/donateBlood", async (req, res) => {
      const blood = req.body;
      const result = await donateBloodsCollection.insertOne(blood);
      res.json(result);
    });

    // GET API
    app.get("/donateBlood", async (req, res) => {
      const cursor = donateBloodsCollection.find({});
      const bloods = await cursor.toArray();
      res.json(bloods);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the Blood Bank!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
