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
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("bloodBank");
    const donateBloodsCollection = database.collection("donateBloods");
    // const donateBloodsHistoryCollection = database.collection(
    //   "donateBloodsHistory"
    // );
    const bloodRequestsCollection = database.collection("bloodRequests");
    // const bloodRequestsHistoryCollection = database.collection(
    //   "bloodRequestsHistory"
    // );

    // donate blood POST API
    app.post("/donateBlood", async (req, res) => {
      const blood = req.body;
      const result = await donateBloodsCollection.insertOne(blood);
      res.json(result);
    });

    // donate blood GET API
    app.get("/donateBlood", async (req, res) => {
      const cursor = donateBloodsCollection.find({});
      const bloods = await cursor.toArray();
      res.json(bloods);
    });

    // blood request POST API
    app.post("/bloodRequest", async (req, res) => {
      const blood = req.body;
      const result = await bloodRequestsCollection.insertOne(blood);
      res.json(result);
    });

    // blood request GET API
    app.get("/bloodRequest", async (req, res) => {
      const cursor = bloodRequestsCollection.find({});
      const requests = await cursor.toArray();
      res.json(requests);
    });

    // get single donation
    app.get("/donateBlood/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await donateBloodsCollection.findOne(query);
      res.json(products);
    });

    // get filtered donation
    // app.get("/donateBlood/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email: email };
    //   const cursor = donateBloodsCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.json(result);
    // });

    // get filtered donation
    app.get("/:email/donateBlood", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = donateBloodsCollection.find(query);
      const users = await cursor.toArray();
      console.log(users);
      res.json(users);
    });

    // get filtered request
    app.get("/:email/bloodRequest", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = bloodRequestsCollection.find(query);
      const users = await cursor.toArray();
      res.json(users);
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
