const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const SalesSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date:{
    type: Date,
    required:true
  },
  rate: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Sales", SalesSchema);