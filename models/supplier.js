const mongoose=require('mongoose');
let Schema=mongoose.Schema;

const SupplierSchema=new Schema({
    name:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    contact:{
        type:String,
        required:true
    },
   
});

module.exports=mongoose.model("Supplier",SupplierSchema);