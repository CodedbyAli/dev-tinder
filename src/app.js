const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/User')

const app = express();

app.post('/signup', async(req,res) => {
  const user = new User ({
    firstName: "Ali",
    lastName: "Hamza",
    email: "ali2@example.com",
    password: "Ali123456"
  });

  try{
    await user.save();
    res.send("User created successfuly");
  } catch(err) {
    res.status(400).send("Error while creating user");
  }
})

connectDB()
 .then(() => {

   console.log("Database connection established successfully")   

    app.listen(7777, () => {
        console.log("Server is successfully running on port 7777....")
    });

 }).catch((err) => {
    console.error("Error occurred while connecting to the database"); 
  })
