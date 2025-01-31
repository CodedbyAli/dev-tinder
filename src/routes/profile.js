const express = require('express');
const {userAuth} = require('../middlewares/auth');
const User = require('../models/User')
const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, (req,res) => {

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
profileRouter.get('/users', async(req,res) => {
    try{
      const user = await User.find({});
      res.send(user);
    }catch(err){
      res.status(404).send(err.message);
    }
  });
  
// Get User
profileRouter.get('/user', async (req,res) => {
try{
    
    const user = await User.findOne({ email: 'ali2@example.com' });
    res.send(user);

}catch(err){
    res.status(400).send("Error Occur while fetching a User")
}
})

// Delete User
profileRouter.delete('/user/:userId', async (req,res) => {
const {userId} = req.params;

try{
    await User.deleteOne({ _id: userId });
    res.send("User Deleted Successfully");
}catch(err){
    res.status(400).send("Error while deleting user: " + err.message);
}
})


// Update User
profileRouter.patch('/user/:userId', async (req,res) => {
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

module.exports = profileRouter;