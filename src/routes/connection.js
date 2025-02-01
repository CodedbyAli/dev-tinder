const express = require('express');
const connectionRouter = express.Router();
const mongoose = require('mongoose');
const Connection = require('../models/connection')
const User = require('../models/User');
const {userAuth} = require('../middlewares/auth');


connectionRouter.post('/send/request/:status/:userId', userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ['INTERESTED','IGNORED'];
        if(!allowedStatus.includes(status))
        {
            return res.status(400).json({message: "Invalid status type: " + status});
        }

         // Validate if toUser is a valid ObjectId
         if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const toUserExist = await User.findById(toUserId);
        if(!toUserExist)
        {
            return res.status(400).json({ message: "User not found" });
        }

        const existingConnectionRequest = await Connection.findOne({
            $or: [
                {fromUserId,toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}                
            ]
        });
        if(existingConnectionRequest)
        {
            return res.status(400).json({message: "Connection request already exist"});
        }

        const connectionData = await Connection.create({
            fromUserId,
            status,
            toUserId
        })

        let message;
        if (status === 'INTERESTED') {
        message = `${req.user.firstName} ${req.user.lastName} is interested in ${toUserExist.firstName} ${toUserExist.lastName}`;
        } else if (status === 'IGNORED') {
        message = `${req.user.firstName} ${req.user.lastName} has ignored ${toUserExist.firstName} ${toUserExist.lastName}`;
        }

        res.status(200).json({message, data: connectionData });

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})


module.exports = connectionRouter;