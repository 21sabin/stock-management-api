const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Category = require('./category');
let Sales = require('./sales');


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
  date: {
    type: Date,
    required: true
  },
  type: { type: Schema.Types.ObjectId },
  cid: { type: Schema.Types.ObjectId, ref: 'Category' }
});
let Inventory = mongoose.model("Inventory", InventorySchema);

module.exports = Inventory;