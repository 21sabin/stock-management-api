// const router = require('express').Router();
const Router = require('express').Router;
let router = Router();

const jwt = require('jsonwebtoken');
const config = require('../config');
const Inventory=require("../models/inventory");

const inventoryService = require('../services/inventoryService');

router.post('/create', (req, res) => {
  console.log('inside dashboard');
  console.log(req.body);
  inventoryService.createInventory(req.body)
    .then(data => {
      res.status(201).json({
        message: "Inventory created successfully",
        success: true,
        data
      })
    })
    .catch(err => {
      res.json({
        message: "Can't create Inventory",
        success: false
      })
    })
});

router.get('/',(req,res)=>{
  inventoryService.fetchProduct().then(response=>res.status(200).json({
    success:true,
    message:"Product list",
    data:response
  }))
  .catch(err=>{
    res.status(500).json({
      success:false,
      err:err
    })
  })
});

router.delete('/:inventoryID', (req, res) => {
  console.log('inside delete inventory',req.params.inventoryID);
  inventoryService.deleteInventory(req.params.inventoryID)
    .then(data => {
      res.json({
        message: "Inventory deleted successfully",
        success: true,
        data:data
      })
    })
    .catch(err => {
      res.json({
        message: "Couldn't delete inventroy with the specified ID",
        success: false
      })
    })
});

router.get('/totalNoProduct',(req,res)=>{
  let total=0;
  console.log("inventory track");
    Inventory.aggregate([
    { $match:{} },
    { $group:{ _id:"$productName",count:{$sum:1}}}
    
    ]).then((result)=>{
      console.log(result,"inventory track")
      result.map(data=>{
       
        total=total+data.count;

      })
      res.json({
        count:total
      })
    })

    router.get('/totalInventoryValue',(req,res)=>{
      console.log("inventory value")
      let totalValue=0;
      Inventory.aggregate([
        { $match:{}},
        { $group:{_id:"$productName",quantity:{ $sum:"$quantity"},cost:{$sum:"$originalPrice"}}}
      ]).then((result)=>{
          result.map(product=>{
            console.log(product)
            let quantity=parseInt(product.quantity);
            let cost=parseInt(product.cost);
            console.log(quantity*cost)
              totalValue=quantity*cost+totalValue;
              res.status(200).json({
                message:"Total Inventory value",
                value:totalValue
              })
              
          })
      });
      console.log(totalValue,"totalvalue")
      
    })
  
    // inventoryService.countProduct().then((err,count)=>{
    //   console.log(count,"count")
    //   res.json({
    //     message: "Total inventory product",
    //     success: true,
    //     data:count
    //   })
    // })
    // .catch(err => {
    //   res.json({
    //     message: "Couldn't count inventroy.",
    //     success: false
    //   })
    // })
    
});

module.exports = router;