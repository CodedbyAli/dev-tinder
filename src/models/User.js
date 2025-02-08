const mongoose = require('mongoose')
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:3,
        maxLength: 25
    },
    lastName: {
        type: String,
        required: true,
        minLength:3,
        maxLength: 25
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
        validate(value){
            if(!validator.isStrongPassword(value))
            {
                throw new Error("Password is not valid: " + value);
            }
        }
    },
    imageUrl: {
        type: String,
        validate(value){
            if(!validator.isURL(value))
            {
                throw new Error("Invalid Url: " + value);
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
    about: {
        type: String,
        maxLength: 255,
    },
    skills: {
        type: [String],
        validate: {
            validator: function (skills) {
                return Array.isArray(skills) && skills.length <= 100;
            },
            message: "Skills cannot be more than 10"
        }
    }
},
{
    strict: true,
    timestamps: true
});

userSchema.methods.getJwt = async function ()
{
    const user = this;
    const token = await jwt.sign({ _id: user._id }, 'Private@Key', {
        expiresIn: '1d'});

    return token;
}

userSchema.methods.validPassword = async function (passwordInputByUser) 
{
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );

    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);