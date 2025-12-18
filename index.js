const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT||3000;

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
async function run(){
    try{ 
     // await client.connect();
      const assetdb = client.db("assetverse");
      const assetsCollection = assetdb.collection("assets");
      const usersCollection = assetdb.collection("users");

      app.post ('/assets',async(req,res)=>{
            const assets=req.body;
            const result=await assetsCollection.insertOne(assets);
            res.send(result);});
      app.get ('/assets',async(req,res)=>{
            const elements=assetsCollection.find({});
            const result=await elements.toArray();
            res.send(result);});
      app.post ('/users',async(req,res)=>{
            const users=req.body;
            console.log(users);
            const result=await usersCollection.insertOne(users);
            console.log(result);
            res.send(result);});
      app.get('/users',async(req,res)=>{
            const users=usersCollection.find({});
            const result=await users.toArray();
            res.send(result);});
      app.get('/users/:email',async(req,res)=>{
            const email=req.params.email;
            const query={email:email};
            const user=await usersCollection.findOne(query);
            res.send(user);});
        
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
            
    }
    finally{
    }
   
}
run().catch(console.dir)
      
app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
