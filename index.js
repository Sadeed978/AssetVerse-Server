const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhxscno.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});

app.get('/', (req, res) => {
      res.send('Hello World!');
});
async function run() {
      try {
            // await client.connect();
            const assetdb = client.db("assetverse");
            const assetsCollection = assetdb.collection("assets");
            const usersCollection = assetdb.collection("users");
            const requestsCollection = assetdb.collection("requests");
            const employeeAffiliationCollection = assetdb.collection("employeeAffiliation");
            
            app.post('/assets', async (req, res) => {
                  const assets = req.body;
                  const result = await assetsCollection.insertOne(assets);
                  res.send(result);
            });
            app.get('/assets', async (req, res) => {
                  const elements = assetsCollection.find({});
                  const result = await elements.toArray();
                  res.send(result);
            });

            app.get('/assets/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: new ObjectId(id) };
                  const result = await assetsCollection.findOne(query);
                  res.send(result)
            });

            app.get('/assets/hr/:hremail', async (req, res) => {
                  const email = req.params.hremail;
                  console.log(email);
                  const query = { hrEmail: email };
                  const elements = assetsCollection.find(query);
                  const result = await elements.toArray();
                  res.send(result);
            });

            app.post('/users', async (req, res) => {
                  const users = req.body;
                  const result = await usersCollection.insertOne(users);
                  res.send(result);
            });
            app.get('/users', async (req, res) => {
                  const users = usersCollection.find({});
                  const result = await users.toArray();
                  res.send(result);
            });
            app.patch('/users/:email', async (req, res) => {
                  const email = req.params.email;
                  const filter = { email: email };
                  const updatedUser = req.body;
                  console.log(updatedUser);
                  const options = { upsert: true };
                  const updateDoc = {
                        $set: {
                              packageLimit: updatedUser.packageLimit,
                              currentEmployees: updatedUser.currentEmployees,
                              subscription: updatedUser.subscription

                },
                  };
                  const result = await usersCollection.updateOne(filter, updateDoc, options);
                  res.send(result);
            });
      app.get('/users/:email', async (req, res) => {
                  const email = req.params.email;
                  const query = { email: email };
                  const user = await usersCollection.findOne(query);
                  res.send(user);
            });
            app.get('/pacages', async (req, res) => {
                  const pacages = assetdb.collection("Pacages");
                  const elements = pacages.find({});
                  const result = await elements.toArray();
                  res.send(result);
            });
            app.post('/requests', async (req, res) => {
                  const requests = req.body;
                  const result = await requestsCollection.insertOne(requests);
                  res.send(result);
            });

            
           app.get('/requests/:email', async (req, res) => {
                  const email = req.params.email;
                  const query = { hrEmail: email };
                  const elements = requestsCollection.find(query);
                  const result = await elements.toArray();
                  res.send(result);
            });
            app.patch('/requests/hrEmail/:id', async (req, res) => {
                  const id = req.params.id;
                  const filter = { _id: new ObjectId(id) };
                  const updatedRequest = req.body;
                  const options = { upsert: true };
                  const updateDoc = {
                        $set: {
                              status: updatedRequest.status

                },
                  };
                  const result = await requestsCollection.updateOne(filter, updateDoc, options);
                  res.send(result);
            });

            app.get('/requests/:email', async (req, res) => {
                  const email = req.params.email;
                  const query = { userEmail: email };
                  const elements = requestsCollection.find(query);
                  const result = await elements.toArray();
                  res.send(result);
            });

            app.post('/employeeAffiliation', async (req, res) => {
                  const affiliation = req.body;
                  const result = await employeeAffiliationCollection.insertOne(affiliation);
                  res.send(result);
            });
            app.get('/employeeAffiliation/:email', async (req, res) => {
                  const email = req.params.email;
                  const query = { employeeEmail: email };
                  const affiliation = await employeeAffiliationCollection.findOne(query);
                  res.send(affiliation);
            });            

            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");

      }
      finally {
      }

}
run().catch(console.dir)

app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
});
