const express = require("express");
// const mongoDB_URL = require("./DbCon.js");
// const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// 
app.use(express.json());
app.use(cors());


// connection
/* mongoose.connect(mongoDB_URL).then(()=> {
    console.log("Database Connected Successfully...")
}).catch((error)=> console.log(error));
 */

const { MongoClient, ObjectId } = require("mongodb");

// Replace the uri string with your connection string.
const uri = 'mongodb+srv://SucaadSalaadcis:Sucaad@book-store-mern.aprflqg.mongodb.net/book_store_project?retryWrites=true&w=majority&appName=Book-Store-MERN';

const client = new MongoClient(uri);

async function run() {
  try {
    // connect client to the server 
    await client.connect();
     // create a db and collection of documents 
    const bookCollections = client.db("BookInventory").collection("books");
      

    // insert a book to the database 
    app.post("/upload_book", async (req, res)=> {
        try {
            const data = req.body;
            const result = await bookCollections.insertOne(data);
            res.send(result);
        } catch (error) {
            console.log(error)
        }
    });

    // get all books from a data base
    app.get("/all_books", async (req, res)=> {
        try {
            const books = await bookCollections.find();
            const result = await books.toArray();
            res.send(result);
        } catch (error) {
            console.log(error);
        }
    });

    // update book 
    app.patch("/book/:id", async (req, res)=> {
       try {
        const id = req.params.id;
        const updateBook = req.body;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updateDoc = {
            $set: {
                ...updateBook
            }
        }
        // update
        const result = await bookCollections.updateOne(filter,updateDoc,options);
        res.send(result);
       } catch (error) {
        console.log(error);
       }
    });

    // delete book 
     app.delete("/book/:id", async (req, res)=> {
        try {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const result = await bookCollections.deleteOne(filter);
            res.send(result);
        } catch (error) {
            console.log(error);
        }
     })

     // find by category
     app.get("/all_books", async (req, res)=> {
        let query = {}
        if(req.query?.category){
            query= {category: req.query.category}
        }
        const result = await bookCollections.find(query).toArray()
        res.send(result);
     })

     // to get single book data
     app.get("/book/:id", async (req, res)=> {
       const id = req.params.id;
       const filter = {_id: new ObjectId(id)};
    //    const options = {upsert: true};
       const result = await bookCollections.findOne(filter);
       res.send(result);
     })

    await client.db("Book_Store").command({ping: 1})

    console.log("Database Connected Successfully...");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(3000,()=> console.log("Server Is Running..."))