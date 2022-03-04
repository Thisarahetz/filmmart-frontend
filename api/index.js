const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

/*
Run Server
*/
app.listen(8900,() => {
    console.log("backend server is working");
})
/*
connect mongoose server
*/
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(()=>console.log("DB Connection Successfull!!!!"))
.catch((err)=>console.log(err));
