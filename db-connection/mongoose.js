<<<<<<< HEAD
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/stock-management');

mongoose.Promise = global.Promise;

mongoose.connection.on('connect',()=>{
    console.log("mongodb connected sucessfully !")
});

mongoose.connection.on('error',(err)=>{
    console.log(`Error in db connection ${err}`)
});

=======
const mongoose=require('mongoose');
// mongoose.connect('mongodb://localhost:27017/stock-management');
mongoose.connect('mongodb://admin:P4ssw0rd@cluster0-shard-00-00-8meox.mongodb.net:27017,cluster0-shard-00-01-8meox.mongodb.net:27017,cluster0-shard-00-02-8meox.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');

mongoose.Promise = global.Promise;

mongoose.connection.on('connect',()=>{
    console.log("mongodb connected sucessfully !")
});

mongoose.connection.on('error',(err)=>{
    console.log(`Error in db connection ${err}`)
});

>>>>>>> 1888b25a86157732d250364213af4b6ba3054688
module.exports=mongoose;