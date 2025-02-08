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

connectionRouter.post('/review/request/:status/:connectionId', userAuth, async (req, res) => {
    try{
        const {status, connectionId} = req.params;
        const loggedInUser = req.user;

        // Validate status
        const allowedStatus = ['ACCEPTED', 'REJECTED'];
        if(!allowedStatus.includes(status))
        {
            return res.status(400).json({
                message: "Status can either be ACCEPTED or REJECTED"
            })
        }

        // Validate if cennectionId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(connectionId)) {
            return res.status(400).json({ message: "Invalid Connection ID" });
        }

        const findConnectionRequest = await Connection.findOne({
            _id: connectionId,
            toUserId: loggedInUser._id,
            status: 'INTERESTED'
        });
        if(!findConnectionRequest)
        {
            return res.status(404).json({
                message: "Connection not found with the requested Id"
            })
        }

        findConnectionRequest.status = status;
        await findConnectionRequest.save();

        return res.json({
            status: 200,
            message: "Request has been " + status
        });

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

// Get all the pending connection request for the loggedIn user
connectionRouter.get('/connections/recieved', userAuth, async (req,res) => {
    
    try{
        const user = req.user;

        const allConnections = await Connection.find({
            toUserId: user._id,
            status: 'INTERESTED'
        }).populate('fromUserId', ['firstName', 'lastName', 'age', 'gender', 'imageUrl']);

        if(!allConnections)
        {
            res.status(404).json({
                message: "No connections has been found!"
            })
        }

        res.json({
            data: allConnections
        })
    }catch(err)
    {
        res.status(400).send(err.message);
    }
})

connectionRouter.get('/connections/confirmed', userAuth, async (req,res)=>{
    const loggedInUser = req.user;

    try{

        const connectionRequests = await Connection.find({
            $or: [
                {toUserId: loggedInUser._id, status: 'ACCEPTED'},
                {fromUserId: loggedInUser._id, status: 'ACCEPTED'},
            ]
        })
        .populate('toUserId', ['firstName', 'lastName', 'age', 'gender', 'skills', 'imageUrl'])
        .populate('fromUserId', ['firstName', 'lastName', 'age', 'gender', 'skills', 'imageUrl']);
        if(!connectionRequests)
        {
            req.status(404).json({
                message: "No connections has found as of now"
            })
        }

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString())
            {
                return row.toUserId;
            }
            return row.fromUserId;
        })
        .filter(user => user !== undefined); //ensures you wouldn’t have undefined values in your final data

        res.json({
            data
        })

    }catch(err)
    {
        res.status(400).send("ERROR: " + err.message);
    }

})


module.exports = connectionRouter;