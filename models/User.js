const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({ //schema
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    date: {
        type:Date,
        default: Date.now
    }
});

//export

const User = mongoose.model('User', UserSchema); //model name and schema name

module.exports= User;
