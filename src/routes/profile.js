const express = require('express');
const {userAuth} = require('../middlewares/auth');
const profileRouter = express.Router();
const {validateProfileUpdate} = require('../utils/validation');

// Get User Profile
profileRouter.get('/profile/view', userAuth, (req,res) => {

  try{

    const user = req.user;
    const data = {
      _id: user._id,
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

// Update User Profile
profileRouter.patch('/profile/edit', userAuth, async (req,res) => {
  const reqData = req.body;
  const loggedInUser = req.user;
  
try{

    if(!validateProfileUpdate(reqData))
    {
      throw new Error("Update is not Allowed");
    }

    if(reqData?.skills?.length > 10)
    {
      throw new Error("Skills cannot be more than 10");
    }

    Object.keys(reqData).forEach((key) => (loggedInUser[key] = reqData[key]));
    await loggedInUser.save();

    res.send("User is updated successfully");

}catch(err) {
    res.status(400).send("Error while updating user: " + err.message);
}
})

module.exports = profileRouter;