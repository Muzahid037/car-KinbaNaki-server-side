const { MongoClient } = require('mongodb');
const express = require('express')
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;

// use: dbCarKinbaNaki
// pass: 4tp6REsHbFbmrvYg

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0x5od.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carKinbaNaki");
        const carCollection = database.collection("products");
        const orderCollection = database.collection("orders");
        const usersCollection = database.collection("users");
        const reviewsCollection= database.collection("reviews");

        // find products get api 
        app.get('/products', async (req, res) => {

            const cursor = carCollection.find({});
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                // console.log("No documents found!");
            }
            // replace console.dir with your callback to access individual elements
            const products = await cursor.toArray();
            res.send(products);
        })


        // get one specific product 
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            // console.log("id: ", id);
            const query = { _id: ObjectId(id) };
            const product = await carCollection.findOne(query);
            res.send(product)
        })

        // add product post api 
        app.post('/products', async (req, res) => {
            const product = req.body;
            // console.log("hitting post", product);

            const result = await carCollection.insertOne(product);
            //console.log(result);
            res.json(result);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        })

        // delete a product api 
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            // console.log("hitting delete ", ObjectId(id));

            const query = { _id: ObjectId(id) };
            const result = await carCollection.deleteOne(query);
            // if (result.deletedCount === 1) {
            //     console.log("Successfully deleted one document.");
            // } else {
            //     console.log("No documents matched the query. Deleted 0 documents.");
            // }
            res.json(result);
        })



        // find orders get api 
        app.get('/orders', async (req, res) => {

            const cursor = orderCollection.find({});
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                // console.log("No documents found!");
            }
            // replace console.dir with your callback to access individual elements
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // get one users order 
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            // console.log("email: ", email);
            const query = { email: email };

            const cursor = orderCollection.find(query);
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                // console.log("No documents found!");
            }
            const orders = await cursor.toArray();

            res.send(orders)
        })


        // add oder post api 
        app.post('/orders', async (req, res) => {
            const order = req.body;
            // console.log("hitting post", product);

            const result = await orderCollection.insertOne(order);
            //console.log(result);
            res.json(result);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        })

        // delete an order api 
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            // console.log("hitting delete ", ObjectId(id));

            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            // if (result.deletedCount === 1) {
            //     console.log("Successfully deleted one document.");
            // } else {
            //     console.log("No documents matched the query. Deleted 0 documents.");
            // }
            res.json(result);
        })



        // update/put api for product status change
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('Hitting user', id);
            const updatedOrders = req.body;
            console.log('Updated user', updatedOrders);
            const filter = { _id: ObjectId(id) };
            // // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            // // create a document that sets the plot of the movie
            const updateDoc = {
                $set: {
                    status: updatedOrders.status
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })



        // add user to database
        app.post('/users', async (req, res) => {
            const user = req.body;
            user.isAdmin = false;
            console.log("user:", user);
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        // get one specific user 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            // console.log("id: ", id);
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.send(user)
        })

        // update/put api for user role change
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            // console.log('Hitting user', id);
            const updatedUser = req.body;
            console.log('Updated user', updatedUser);
            const filter =  { email: email };
            // // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            // // create a document that sets the plot of the movie
            const updateDoc = {
                $set: {
                    isAdmin: updatedUser.isAdmin
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })


        // find all users
        app.get('/users', async (req, res) => {

            const cursor = usersCollection.find({});
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                // console.log("No documents found!");
            }
            // replace console.dir with your callback to access individual elements
            const users = await cursor.toArray();
            res.send(users);
        })


        // find all review
        app.get('/reviews', async (req, res) => {

            const cursor = reviewsCollection.find({});
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                // console.log("No documents found!");
            }
            // replace console.dir with your callback to access individual elements
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // add review post api 
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log("hitting post", review);

            const result = await reviewsCollection.insertOne(review);
            //console.log(result);
            res.json(result);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        })

        /*
        
              // create a document to insert
              const doc = {
                name: "Smoky bbq beef burger",
                img:"https://image.freepik.com/free-photo/front-view-burger-stand_141793-15542.jpg",
                des: "A hamburger is a food, typically considered a sandwich, consisting of one or more cooked patties—usually ground meat, typically beef—placed inside a sliced bread roll or bun."
              }
              const result = await carCollection.insertOne(doc);
              console.log(`A document was inserted with the _id: ${result.insertedId}`);
              */
    } finally {
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('car-KinbaNaki World!')
})

app.listen(port, () => {
    console.log(`Car-KinbaNaki listening at http://localhost:${port}`)
})