const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT||3000;

app.use(cors());
app.use(express.json());


const uri= `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhxscno.mongodb.net/?appName=Cluster0`

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
async function run(){
    try{ await client.connect();
        const database = client.db("assetverse");
        const assetsCollection = database.collection("assets");
        const usersCollection = database.collection("users");

        app.post ('/assets',async(req,res)=>{
            const assets=req.body;
            const result=await assetsCollection.insertOne(assets);
            res.send(result);});
        app.get ('/assets',async(req,res)=>{
            const elements=assetsCollection.find({});
            const result=await elements.toAraay();
            res.send(result);});
        app.post ('/users',async(req,res)=>{
            const users=req.body;
            const result=await usersCollection.insertOne(users);
            res.send(result);});
          app.get('/users',async(req,res)=>{
            const users=usersCollection.find({});
            const result=await users.toArray();
            res.send(result);});
        
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{
    }
}
run().catch(console.dir);


client.connect()
 .then(() => {
    app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`);
})})
    .catch(console.dir);