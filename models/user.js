const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
},{
    // if the user updates something the timestamp will be noted.
    timestamp:true
});

const User = mongoose.model('User',userSchema);

module.exports =  User;