const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.listen(8900,() => {
    console.log("backend server is working");
})