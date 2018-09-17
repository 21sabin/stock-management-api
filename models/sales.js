const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Inventory=require('./inventory');
let Category=require('./category');

const SalesSchema = new Schema({
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
  },
  pid:{type:Schema.Types.ObjectId,ref:'Inventory'},
  cid:{type:Schema.Types.ObjectId,ref:"Category"}
});

module.exports = mongoose.model("Sales", SalesSchema);