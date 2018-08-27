const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Category", CategorySchema);