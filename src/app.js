const express = require('express');
const connectDB = require('./config/database');

const app = express();

connectDB()
 .then(() => {

   console.log("Database connection established successfully")   

    app.listen(7777, () => {
        console.log("Server is successfully running on port 7777....")
    });

 })
  .catch((err) => {
    console.error("Error occurred while connecting to the database"); 
  })
