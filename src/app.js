const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/User')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(cookieParser())

// SignUp
app.post('/signup', async(req,res) => {
  const data = req.body;

  try{

    data.password = await bcrypt.hash(data.password, 10);

    await User.create(data);
    res.send("User created successfuly");
  } catch(err) {
    res.status(400).send("Error while creating user: " + err.message);
  }
})

// Login
app.post('/login', async (req,res) => {
  const data = req.body;

  try{

    const user = await User.findOne({ email: data.email })
    if(!user){
      throw new Error("Invalid Credentials!");
    }

    const isPasswordCorrect = await bcrypt.compare(data.password, user.password);

    if(!isPasswordCorrect)
    {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign({ _id: user._id }, 'Private@Key', {expiresIn: '1d'});

    res.cookie("token", token);
    res.send("User is logged in successfully")

  }catch(err){
    res.status(400).send(err.message);
  }
  
})

app.get('/profile', userAuth, (req,res) => {

  try{

    const user = req.body;
    const data = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      gender: user.gender,
      skills: user.skills,
    }
    res.send(data);

  }catch(err){
    res.status(400).send(err.message);
  }

})

// Get Users
app.get('/users', async(req,res) => {
  try{
    const user = await User.find({});
    res.send(user);
  }catch(err){
    res.status(404).send(err.message);
  }
});

// Get User
app.get('/user', async (req,res) => {
  try{
    
    const user = await User.findOne({ email: 'ali2@example.com' });
    res.send(user);

  }catch(err){
    res.status(400).send("Error Occur while fetching a User")
  }
})

// Delete User
app.delete('/user/:userId', async (req,res) => {
  const {userId} = req.params;

  try{
    await User.deleteOne({ _id: userId });
    res.send("User Deleted Successfully");
  }catch(err){
    res.status(400).send("Error while deleting user: " + err.message);
  }
})


// Update User
app.patch('/user/:userId', async (req,res) => {
  const {userId} = req.params;
  const data = req.body;

  try{

    const ALLOWED_UPDATES = ['age', 'gender', 'skills'];

    const isUpdateAllow = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
    if(!isUpdateAllow)
    {
      throw new Error("Update is not Allowed");
    }

    if(data?.skills?.length > 10)
    {
      throw new Error("Skills cannot be more than 10");
    }

    await User.findByIdAndUpdate({_id:userId}, data, {
      returnDocument: "after",
    });

    res.send("User is updated successfully");

  }catch(err) {
    res.status(400).send("Error while updating user: " + err.message);
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
