const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema({
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    status: {
        type: String,
        enum: {
            values: ['INTERESTED', 'IGNORED', 'ACCEPTED', 'REJECTED'],
            message: `{VALUE} is not accepted`
        },
        required: true
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }
}, {timestamps: true})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre('save', function (next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
    {
        throw new Error("Cannot send connection request to yourself");
    }
    next();

})

module.exports = mongoose.model('connections', connectionRequestSchema);