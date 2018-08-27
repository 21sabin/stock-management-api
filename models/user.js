const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const UserSchema = new Schema({
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

module.exports = mongoose.model("CreateUser", UserSchema);