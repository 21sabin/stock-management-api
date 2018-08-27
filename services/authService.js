let userService=require('./userService');
var authService=(()=>{

    let CreateUser=require('../models/user');

    async function createUser(user){
        console.log(user,"user")
        return await CreateUser.create({
            email:user.email,
            password:user.password,
            active:true,
            role:"admin"
        })
    }



    async function singIn(email,password){
        console.log(email,password,"checklogin");
        return new Promise((resolve,reject)=>{
            userService.fetchByEmail(email)
            .then((data)=>{
                resolve(data);
            },(err)=>{
                reject(err);
            })
        })
      
    }

    return {
        createUser:createUser,
        singIn:singIn
    }

})();

module.exports=authService;