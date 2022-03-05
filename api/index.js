const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const auth = require('./routes/auth');


dotenv.config();

/*
Run Server
*/
app.listen(8090,() => {
    console.log("backend server is working");
})
/*  
connect mongoose server
*/
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
})
.then(()=>console.log("DB Connection Successfull!!!!"))
.catch((err)=>console.log(err));
/*Accesp JSON*/
app.use(express.json());

/*
Router
*/
app.use("/api/auth",auth);


