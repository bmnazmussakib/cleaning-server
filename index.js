require('dotenv').config()
const express = require("express");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

const cors = require('cors');
const PORT = process.env.PORT || 1010;


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://eco-clean-admin:eco-clean-admin@cluster0.pkxrx.mongodb.net/retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





app.use(cors());





client.connect(err => {

    const orderListCollection = client.db("ecoDB").collection("orderList");
    const serviceCollection = client.db("ecoDB").collection("allServices");
    const reviewCollection = client.db("ecoDB").collection("review");
    const adminEmailCollection = client.db("ecoDB").collection("adminEmail");

    if (err) {
        console.log(err);
        console.log("Database Connection Failed🔴");

    } else {
        console.log("Database Connection Success🟢");


        // =================================== Admin ===================================

        // Insert Service for admin
        // app.post('/add-service', (req, res) => {

        //     const service = req.body;
        //     serviceCollection.insertOne(service)
        //     .then(result => {
        //         console.log('Data Insert Success✅');
        //         res.send('/add-service')
        //     })


        // })


        app.post('/add-service', (req, res) => {

            const service = req.body;
            console.log(service);

            insertData(serviceCollection, service)
            .then(result => {
                // res.redirect('/add-service')
                console.log(result);
            })

        })


        // Order List
        readData(orderListCollection, '/order-list');


        // All Services
        readData(serviceCollection, '/service-list');



        // Load Single Service
        app.get('/manage-services/update-service/:id', (req, res) => {
            serviceCollection.find({ _id: ObjectId(req.params.id) })
                .toArray((err, documents) => {
                    res.send(documents[0])
                })
        })


        // Update Single Service
        app.put('/manage-services/update-service/:id', (req, res) => {
            console.log(req.params.id);
            console.log(req.body);

            serviceCollection.updateOne(
                {_id: ObjectId(req.params.id)},
                { 
                    $set: { name: req.body.name, description: req.body.description, imgURL: req.body.imgURL } 
                })
                .then(result => {
                    console.log(result);
                    res.send('/manage-services')
                })

        })


        // Delete Service
        app.delete('/delete-service/:id', (req, res) => {
            console.log(req.params.id);
            serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
                .then(result => {
                    console.log(result);
                    res.send('/manage-services');
                })
        })



        // Make admin
        app.post('/make-admin', (req, res) => {
            const email = req.body;
            console.log(email);

            insertData(adminEmailCollection, email)
        })

        // Get Admin Email
        readData(adminEmailCollection, '/admin-email');

        // =================================== Admin ===================================
        
        
        
        // =================================== User ===================================


        // Book a Service
        app.post('/book-service', (req, res) => {

            const order = req.body.selectService;
            console.log("Order is Received");
            console.log(order);

            insertData(orderListCollection, order)
        })



        // User Review
        app.post('/add-review', (req, res) => {
            const review = req.body.review;
            console.log(review);

            insertData(reviewCollection, review);
        })


        // Read Review Data
        readData(reviewCollection, '/review');



        // =================================== User ===================================
    }


});




// ------------Insert One Data Function------------
const insertData = (myCollection, data) => {

    myCollection.insertOne(data, (err) => {
        if (err) {
            console.log("Data Insert Failed❌");
        } else {
            console.log("Data Insert Success✅")
        }
    })
}


// ---------------Read Data Function---------------
const readData = (myCollection, url) => {

    app.get(url, (req, res) => {
        myCollection.find({}).toArray((err, document) => {
            res.send(document)
        })
    })

}


// --------------------Delete Service-------------------------
const deleteData = () => {

}




app.get('/', (req, res) => {
    res.send("<h1>Eco Clean Server</h1>")
})


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})