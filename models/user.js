const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const AdminSchema = new Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: Boolean,
    role: String
});

module.exports = mongoose.model("Admin", AdminSchema);