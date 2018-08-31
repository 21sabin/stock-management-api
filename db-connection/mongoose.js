const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/stock-management');

// mongoose.Promise = global.Promise;

mongoose.connection.on('connect',()=>{
    console.log("mongodb connected sucessfully !")
});

mongoose.connection.on('error',(err)=>{
    console.log(`Error in db connection ${err}`)
});

module.exports=mongoose;