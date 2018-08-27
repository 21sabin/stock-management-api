
let userService=(()=>{
    let CreateUser=require('../models/user');

    let Users = require('../models/user');
   
    async function fetchByEmail(email){
        return CreateUser.findOne({email:email});    
    }

    function checkPassword(userPwd,dbPwd){
        return new Promise((resolve,reject)=>{
            if(userPwd!==dbPwd){
                let msg={
                    success:false,
                    message:"Ohh snaps ! username and password didnot matched."
                }
               return reject(msg);
            }  
            let msg={
                success:true,
                message:"Username and password matched"
            }
            return resolve(msg);
        })
        
    }

    async function getAllUsers() {
        return await Users.find();
    }

  
    return {
        fetchByEmail:fetchByEmail,
        checkPassword:checkPassword,
        getAllUsers: getAllUsers
    }

})();

module.exports=userService;