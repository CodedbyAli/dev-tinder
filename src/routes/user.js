const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const Connection = require('../models/connection');
const User = require('../models/User');

userRouter.get('/feed', userAuth, async (req,res) => {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    try{
        const connectionRequests = await Connection.find({
            $or: [
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id}
            ]
        }).select('toUserId fromUserId');

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}},
            ]
        })
        .select('firstName lastName age gender skills')
        .skip(skip)
        .limit(limit);

        res.json({ data: users });

        }
    catch(err){
        res.status(400).json({message: err.message});
    }
    
})


module.exports = userRouter;