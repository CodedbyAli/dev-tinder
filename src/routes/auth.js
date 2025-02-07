const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User')
const authRouter = express.Router();


// SignUp
authRouter.post('/signup', async(req,res) => {
    const data = req.body;
  
    try{
  
      data.password = await bcrypt.hash(data.password, 10);
  
      const savedUser = await User.create(data);

      const token = await savedUser.getJwt();

      const resData = {
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
      }

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // 8 Hours
      });

      res.json({message: "User created successfully", data: resData});
    } catch(err) {
      res.status(400).send("Error while creating user: " + err.message);
    }
  })
  
  // Login
authRouter.post('/login', async (req,res) => {
const data = req.body;

try{

    const user = await User.findOne({ email: data.email })
    if(!user){
    throw new Error("Invalid Credentials!");
    }

    const isPasswordCorrect = await user.validPassword(data.password);

    if(!isPasswordCorrect)
    {
    throw new Error("Invalid Credentials");
    }

    const token = await user.getJwt();

    const resData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      imageUrl: user.imageUrl,
      gender: user.gender,
      skills: user.skills,
    }

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // 8 Hours
    });
    res.json({
      message: 'User Logged In successfully',
      data: resData
    })

}catch(err){
    res.status(400).send(err.message);
}

})

// Logout
authRouter.post('/logout', async (req,res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  })
  res.send("User Logout Sucessfully");
})

module.exports = authRouter;