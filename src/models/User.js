const mongoose = require('mongoose')
const validator = require('validator');


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min:3,
        max:4
    },
    lastName: {
        type: String,
        required: true,
        min:3,
        max:4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v){
                return validator.isEmail(v);
            },
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        validate(value){
            if(!validator.isStrongPassword(value))
            {
                throw new Error("Password is not valid: " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 15,
        max: 50
    },
    gender: {
        type: String,
        required: true,
        // validate: {
        //     validator: function(v){
        //         return ['Male','Female','Other'].includes(v);
        //     },
        //     message: "Gender cannot be other than Male, Female and Other"
        // }
        validate(value){
            if(!['Male','Female','Other'].includes(value))
            {
                throw new Error("Gender cannot be other than Male, Female and Other")
            }
        }
    },
    skills: {
        type: Array,
        required: true
    }
},
{
    strict: true,
    timestamps: true
});


module.exports = mongoose.model('User', userSchema);