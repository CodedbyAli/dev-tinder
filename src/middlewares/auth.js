const User = require('../models/User')
const jwt = require('jsonwebtoken')

const userAuth = async (req,res, next) => {
    const {token} = req.cookies;

    try{
        
        const {_id} = jwt.verify(token, 'Private@Key');
        const user = await User.findById(_id);
        if(!user){
          throw new Error("Error occured while fetching user profile");
        }else{
            req.user = user;
            next();
        }

    }catch(err)
    {
        res.status(400).send("ERROR: " + err.message);
    }
}

module.exports = {userAuth};