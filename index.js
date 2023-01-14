const express = require('express');
const cors= require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


// middleware

app.use(cors())
app.use(express.json());
// mongodb connection

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u3hia.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u3hia.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
try{
    await client.connect();
    const collection = client.db("content").collection("contents");
    // http://localhost:5000/posts
    app.get('/contents', async(req, res)=> {
        const query = {}
        const cursor = collection.find(query);
        const posts = await cursor.toArray();
        res.send(posts)
    })
    // http://localhost:5000/contents
    app.post('/post', async(req, res) =>{
        const newPost = req.body;
        const result = await collection.insertOne(newPost)
        res.send(result)
      });
    //   http://localhost:5000/post/6390b5399e0d78aae8e9f56f
     app.put('/contents/:id', async(req, res)=>{
        const id = req.params.id
        const data = req.body;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                title: data.title,
                category: data.category,
                image: data.image,
                date: data.date,
                description: data.description,
            },
        }
        const result = await collection.updateOne(filter, updateDoc, options);
        res.send(result);
        // console.log(data)
     })
    //  http://localhost:5000/post/6390b5399e0d78aae8e9f56f
     // delete
     app.delete('/contents/:id', async(req, res)=> {
        const id=req.params.id
        const filter = {_id: ObjectId(id)};
        const result = await collection.deleteOne(filter);
        res.send(result);
     })
}
finally{
}
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running The Node CRAD Server')
});
app.listen(port, () => {
    console.log("CRAD Server is running")
})