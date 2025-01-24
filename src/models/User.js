const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    firstName: {
        type: string
    },
    lastName: {
        type: string
    },
    email: {
        type: string
    },
    password: {
        type: string
    },
    age: {
        type: number
    },
    gender: {
        type: string
    }
});


module.exports = mongoose.model('User', userSchema);