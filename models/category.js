const mongoose = require('mongoose');
let Schema = mongoose.Schema;


const CategorySchema = new Schema({
    category: {
        type: String,
        required: true
    }
})
let Category=mongoose.model("Category",CategorySchema)
module.exports = Category;