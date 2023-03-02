const express = require('express')
 const app = express()
 const port = 8080

const {faker} = require("@faker-js/faker");

const { MongoClient } = require("mongodb");
//
const uri = "mongodb://localhost:27017";
//const client = new MongoClient(uri);

//import { MongoClient } from "mongodb";
const client = new MongoClient(uri);

let conn;
let db;


 app.get('/', async (req, res) => {
   res.send('Hello World!')
     databasesList = await client.db().admin().listDatabases();
     console.log(databasesList)
 })


// Add a new document to the collection
app.post("/", async (req, res) => {
  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };


       var randomName = faker.name.fullName(); // Generates a random name
       var randomEmail = faker.internet.email();
       const doc = {
          title: randomName,
          content: randomEmail,
        }



    const movie = await movies.insertOne(doc);
    //console.log(movie);
    res.send(movie).status(204);
  } catch(e) {
  //console.log(e)

console.log(e)
          res.status(404).json({})
  }
//       finally {
//       console.log("finally")
//    // Ensures that the client will close when you finish/error
//
//    //await client.close();
//  }

});
 app.listen(port, async () => {

   try {
     conn = await client.connect();
     db = conn.db("sample_training");
   } catch(e) {
     console.error(e);
   }
   console.log(`Example app listening at http://localhost:${port}`)
 })