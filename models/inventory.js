const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const InventorySchema = new Schema({
  productName: {
    type: String,
    require: true
  },
  quantity: {
    type: Number,
    require: true
  },
  measurement: {
    type: String,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  profit: {
    type: Number,
    require: true
  },
  supplier: {
    type: String,
    required: true
  },
  date:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model("Inventory", InventorySchema);