const Router = require('express').Router;
let router = Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authService = require('../services/authService');
const userService=require('../services/userService');
const config=require('../config');

const CreateUser = require('../models/user');


router.post('/login', (req, res) => {
    console.log(req.body,"login route")
    let email=req.body.email;
    let password=req.body.password;
    console.log(email, password, 'asdasdas');
    authService.singIn(email,password)
    .then(user=>{
        console.log(user)
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found !"
            })
        }
        if(password!==user.password){
            console.log('password', password, 'user.password', user.password);
           return res.json({
                success:false,
                message:"Ohh snap ! username and password didnot matched"
            })
        }
    var token=jwt.sign({email:user.email,id:user.id},config.signature,{"expiresIn":7200})
        res.status(200).json({
            success:true,
            message:"Enjoy your token ! Token expires in a day",
            token:token
        })
    })
    .catch(error=>{
        console.log(error)
    })
 
   
});

router.post('/signup', (req, res) => {
    authService.createUser(req.body)
        .then(data => {
            res.status(201).json({
                success: "true",
                message: "User created Sucessfully",
                data: data
            })
        })
})


module.exports = router;


