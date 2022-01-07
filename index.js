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
    const usersCollection = database.collection("users");
    const bloodRequestsCollection = database.collection("bloodRequests");
    const bloodsCollection = database.collection("bloods");

    //  bloods POST API
    app.post("/bloods", async (req, res) => {
      const blood = req.body;
      const result = await bloodsCollection.insertOne(blood);
      res.json(result);
    });

    // donate blood POST API
    app.post("/donateBlood", async (req, res) => {
      const blood = req.body;
      const result = await donateBloodsCollection.insertOne(blood);
      res.json(result);
    });

    // blood request POST API
    app.post("/bloodRequest", async (req, res) => {
      const blood = req.body;
      const result = await bloodRequestsCollection.insertOne(blood);
      res.json(result);
    });

    // users post api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // bloods GET API
    app.get("/bloods", async (req, res) => {
      const cursor = bloodsCollection.find({});
      const bloods = await cursor.toArray();
      res.json(bloods);
    });

    // donate blood GET API
    app.get("/donateBlood", async (req, res) => {
      const cursor = donateBloodsCollection.find({});
      const bloods = await cursor.toArray();
      res.json(bloods);
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
      const blood = await donateBloodsCollection.findOne(query);
      res.json(blood);
    });

    // get filtered donation
    app.get("/:email/donateBlood", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = donateBloodsCollection.find(query);
      const users = await cursor.toArray();
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

    // put users
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // put admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      console.log("put", user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // get admin user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // UPDATE API
    app.put("/donateBlood/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const query = { _id: ObjectId(id) };

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedData.status,
        },
      };
      const result = await donateBloodsCollection.updateOne(
        query,
        updateDoc,
        options
      );
      // console.log('updating user with id', result);
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the Blood Bank !!!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
