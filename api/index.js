const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const auth = require('./routes/auth'); //Register and login authontication
const usersRouter = require('./routes/users'); // update and delete and getAll and find
const moviesRouter = require('./routes/movies'); //create movies add,delete,
const listRouter = require('./routes/list'); //list crud

const cors = require('cors');
//Enable CORE
app.use(cors());
dotenv.config();

/*
Run Server
*/
app.listen(8091,() => {
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
Routers
*/
app.use("/api/auth",auth);
app.use("/api/users",usersRouter);
app.use("/api/movies",moviesRouter);
app.use("/api/list",listRouter);

