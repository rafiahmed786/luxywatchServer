const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId= require('mongodb').ObjectId

const cors = require('cors')
const app= express();


const port= process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.16pzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
       await client.connect()
       const database = client.db('Watch');
       const watchCollection = database.collection('watches')
       const ordersCollection= database.collection('orders')
       const reviewsCollection= database.collection('Reviews')
       const usersCollection= database.collection('Users')
       

       // Watches POST Api
        app.post('/watches',async(req,res)=>{
            const watch = req.body;
            const result = await watchCollection.insertOne(watch)
            res.json(result)
        }) 

        //GET watches API
        app.get('/watches',async(req,res)=>{
            const cursor = watchCollection.find({});
            const watches = await cursor.toArray();
            res.send(watches);
       })

       // GET Single Watch 
       app.get('/watches/:id', async(req , res)=>{
        const id= req.params.id;
        const query = {_id:ObjectId(id)}
        const watch = await watchCollection.findOne(query)
        res.json(watch)
    });
       // DELETE Single Watch 
       app.delete('/watches/:id', async(req , res)=>{
        const id= req.params.id;
        const query = {_id:ObjectId(id)}
        const result =await watchCollection.deleteOne(query)
         res.json(result)
    });

    // PlaceOrder POST API 
    app.post('/orders',async(req,res)=>{
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders)
            res.json(result)
    })

    // GET PlaceOrder API 
    app.get('/orders',async(req, res)=>{
        const cursor= ordersCollection.find({})
        const orders = await cursor.toArray();
        res.send(orders)
    })

    // GET Single Users orders APi
    app.get('/orders/:email', async(req, res)=>{
        const id= req.params.email;
        const query= {email:id};
        const cursor = ordersCollection.find(query);
        const orders= await cursor.toArray()
        res.json(orders)

    })
      
    // DELETE Single Order API
    app.delete('/orders/:id', async(req,res)=>{
        const id = req.params.id;
        const query={_id:ObjectId(id)};
        const result =await ordersCollection.deleteOne(query)
        res.json(result)
        
    })

    // Reviews POST API 
    app.post('/reviews',async(req,res)=>{
            const reviews = req.body;
            const result = await reviewsCollection.insertOne(reviews)
            res.json(result)
    })
    // GET Reviews API 
     app.get('/reviews',async(req, res)=>{
        const cursor= reviewsCollection.find({})
        const reviews = await cursor.toArray();
        res.send(reviews)
    })
    //Delete single reviews
     app.delete('/reviews/:id', async(req , res)=>{
        const id= req.params.id;
        const query = {_id:ObjectId(id)}
        const result =await reviewsCollection.deleteOne(query)
         res.json(result)
    });

    // Users POST API 
    app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result)
    })

    // Users GET Api
     app.get('/users',async(req, res)=>{
        const cursor= usersCollection.find({})
        const users = await cursor.toArray();
        res.send(users)
    })

    // Users PUT Api
    app.put('/users',async(req,res)=>{
        const user= req.body;
        const filter = {email: user.email};
        const options = {upsert: true};
        const updateDoc = {$set: user};
        const result = await usersCollection.updateOne(filter,updateDoc,options);
        res.json(result)
    })

    // Make Admin
    app.put('/users/admin', async(req,res)=>{
        const user= req.body;
        const filter= {email: user.email};
        const updateDoc= {$set: {role:'admin'}};
        const result= await usersCollection.updateOne(filter,updateDoc);
        res.json(result)
    })

    // Get Single Users
    app.get('/users/:email',async(req,res)=>{
        const email= req.params.email;
        const query = {email};
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if(user?.role === "admin"){
            isAdmin=true;
        }
        res.json({admin: isAdmin})
    })




    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send("welcome to node server")
})
app.listen(port,()=>{
    console.log("listening ",port)
})