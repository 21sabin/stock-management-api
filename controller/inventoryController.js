// const router = require('express').Router();
const Router = require('express').Router;
let router = Router();

const jwt = require('jsonwebtoken');
const config = require('../config');
const Inventory = require("../models/inventory");
const Category = require('../models/category');
let ObjectId = require('mongodb').ObjectID;
const SalesModel = require('./../models/sales');
const moment = require('moment');

const inventoryService = require('../services/inventoryService');

router.get('/', (req, res) => {
  inventoryService.fetchProduct().then(response => res.status(200).json({
    success: true,
    message: "Product list",
    data: response
  }))
    .catch(err => {
      res.status(500).json({
        success: false,
        err: err
      })
    })
});

// router.get('/',()=>{
//   SalesModel.find().populate("pid").then(salesList=>{
//     res.json({
//       data:salesList
//     })
//   }).catch(err=>{
//     err
//   })
// })

router.get('/category', (req, res) => {
  console.log("category")
  Category.find().then(result => {
    console.log(result, "result")
    res.json({
      // data:result?result:[]
      data: result
    })
  });
})

router.get('/report', (req, res) => {
  Inventory.find().populate("cid").exec((err, products) => {
    if (!err) {
      res.json({
        data: products
      })
    } else {
      res.json({
        data: []
      })
    }
  });
})

router.get("/summary", (req, res) => {
  console.log("inventory summary");
  Inventory.aggregate([{
    $group: {
      _id: {
        day: {
          $dayOfYear: "$date"
        },
        month: {
          $month: "$date"
        },
        totalAmount: {
          $sum: {
            $multiply: ["$quantity", "$sellingPrice"]
          }
        }
      },

    }
  }]).then(result => {
    res.json({
      data: result
    })
  }).catch(err => {
    res.status(404).json({
      err
    })
  })

})

router.get("/summary/day", (req, res) => {
  Inventory.aggregate([{
    $group: {
      _id: "$productName",
      totalAmount: {
        $sum: {
          $multiply: ["$quantity", "$sellingPrice"]
        }
      }
    },

  }]).then(result => {
    res.json({
      data: result
    })
  }).catch(err => {
    res.status(404).json({
      err
    })
  })
})

router.get("/outOfStock", (req, res) => {
  Inventory.find({
    quantity: {
      $lte: 20
    }
  }).then(result => {
    console.log(result, "result");
    res.json({
      data: result
    })
  }).catch(err => {
    console.log(err, "erro")
  })
})

router.get("/winterProducts", (req, res) => {
  let startMonth = 12;
  let endMonth = 3
  SalesModel.find().populate("pid").then(result => {
    //  console.log(moment(result[0].date).format("MM"),"lt dateresu");
    let winterProdudcts = result.filter(sales => {
      let month = moment(sales.date).format("MM");
      if (month == 12 || month >= 1 && month <= endMonth) {
        return true;
      }
    })
    console.log(winterProdudcts, "winterproductes")
    res.json({
      data: winterProdudcts
    })
  })
})

// {
//   _ouotalAmount: { $sum: { $multiply: [ "$price", "$quantity" ] } },
//   count: { $sum: 1 }
// }
router.get('/totalInventoryValue', (req, res) => {
  console.log("fjd");
  let totalValue = 0;
  let newResult;
  Inventory.aggregate([{
    $group: {
      _id: "$_id",
      totalSum: {
        $sum: {
          $multiply: ["$quantity", "$originalPrice"]
        }
      }
    }
  }]).then(result => {
    result.map(value => {
      console.log(value, "value")
      totalValue = value.totalSum + totalValue;
    });
    Inventory.count().then(counts => {
      res.json({
        inventoryValue: totalValue,
        counts
      })
    })
  });

})

router.get('/totalNoProduct', (req, res) => {
  let total = 0;
  console.log("inventory track");
  Inventory.aggregate([{
    $match: {}
  },
  {
    $group: {
      _id: "$productName",
      count: {
        $sum: 1
      }
    }
  }
  ]).then((result) => {
    console.log(result, "inventory track")
    result.map(data => {
      total = total + data.count;
    })
    res.json({
      count: total
    })
  })
});

router.get('/totalInventoryValue', (req, res) => {
  let totalValue = 0;
  Inventory.aggregate([{
    $match: {}
  },
  {
    $group: {
      _id: "$productName",
      quantity: {
        $sum: "$quantity"
      },
      cost: {
        $sum: "$originalPrice"
      }
    }
  }
  ]).then((result) => {
    result.map(product => {
      let quantity = parseInt(product.quantity);
      let cost = parseInt(product.cost);
      console.log(quantity * cost)
      totalValue = quantity * cost + totalValue;
      console.log(totalValue, "total");
      res.json({
        message: "Total inventory value",
        value: totalValue
      })
    })
  }).catch(err => {
    console.log(err)
  });
})

router.post('/create', (req, res) => {
  console.log(req.body, "product")
  Inventory.findOne({ productName: req.body.productName }).then(duplicateProduct => {
    if (duplicateProduct) {
      console.log("update stock")
      let newStock = parseInt(req.body.quantity) + parseInt(duplicateProduct.quantity);
      Inventory.updateOne({ productName: req.body.productName }, {
        $set: {
          productName: duplicateProduct.productName,
          quantity: newStock,
          measurement: duplicateProduct.measurement,
          originalPrice: duplicateProduct.originalPrice,
          sellingPrice: duplicateProduct.sellingPrice,
          supplier: duplicateProduct.supplier,
          date: duplicateProduct.date
        }
      }).then(result => {
        console.log(result, "update sucessfully")
        res.status(201).json({
          message: "Inventory stock update successfully",
          updateStock: true,
          data: result
        })
      })
    } else {
      console.log("new proudct")
      inventoryService.createInventory(req.body)
        .then(result => {
          res.status(201).json({
            message: "Inventory update successfully",
            updateStock: false,
            data: result
          })

        })
    }
  })
});

router.post('/addSales', (req, res) => {
  console.log(req.body,"req.body")
  inventoryService.addSales(req.body)
    .then(data => {
      console.log(data,"data")
      Inventory.findById(data.pid).then(product=>{
        console.log(product,"product");
        let salesQuantity=parseInt(req.body.quantity)
          if(salesQuantity>product.quantity){
            res.json({
              success:false,
              message:"The quantity you have entered is more than the actual stock."
            })
          }else{
            Inventory.updateOne(
              {
                _id: data.pid
              },
              {
                $set: {
                  quantity: product.quantity - data.quantity
                }
              }).then(success=>{
                res.json({
                  success:true,
                  message:"sales added successfully."
                })
              })
          }
      }).catch(err=>{
        console.log(err,"product err")
      })
    })
    .catch(err => {
      res.json({
        message: 'Can\'t add sales',
        err
      })
    })
});



router.post("/category", (req, res) => {
  console.log(req.body, "categories");
  Category.create(req.body)
    .then(result => {
      res.json({
        message: "Category created successfully",
        data: result
      })
     })
});

router.delete('/category/:categoryId', (req, res) => {
  inventoryService.deleteCategory(req.params.categoryId)
    .then(data => {
      console.log(data,"categpru deleted")
      res.json({
        message: 'Category deleted successfully',
        success: true,
        data
      })
    })
    .catch(err => {
      res.json({
        message: 'Category delete failed!',
        err
      })
    })
});



router.put('/category', (req, res) => {
  inventoryService.updateCategory(req.body)
    .then(data => {
      Category.findById(req.body._id)
        .then(result => {
          data: result
        })
    })
})


router.delete('/:inventoryID', (req, res) => {
  console.log('inside delete inventory', req.params.inventoryID);
  inventoryService.deleteInventory(req.params.inventoryID)
    .then(data => {
      SalesModel.remove({pid:req.params.inventoryID}).then(salesDelete=>{
        console.log(salesDelete,"salesDelete")
        res.json({
          message: "Inventory deleted successfully",
          success: true,
          data: data
        })
      })
     
    })
    .catch(err => {
      res.json({
        message: "Couldn't delete inventroy with the specified ID",
        success: false
      })
    })
});


















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


router.get('/report', (req, res) => {
  console.log("report")
  Inventory.aggregate([{
    $group: {
      _id: "$cid"
    }
  }]).then(result => {
    res.json({
      data: result
    })
  })
})

router.put("/update", (req, res) => {
  console.log(req.body, "update product");
  inventoryService.updateProduct(req.body)
    .then(result => {
      console.log(result, "updated sucessfully")
    })
    .catch(err => {
      console.log(err, "error occured")
    })
});

router.get('/:inventoryId', (req, res) => {
  Inventory.findById(req.params.inventoryId).populate("cid").then(result => {
    res.json({
      data: result
    })
  })
})

router.get('/category/:productId', (req, res) => {
  console.log(req.params, 'asdasd');
  inventoryService.fetchInventoryById(req.params.productId)
    .then(result => {
      console.log(result, 'category/:productId');
      inventoryService.getCategoryById(result.cid)
        .then(data => {
          console.log(result.cid, 'categoryid');
          res.json({
            data: data
          })
        })
        .catch(error => {
          res.json({
            error: error
          })
        })
    })
    .catch(err => {
      res.json({
        error: err
      })
    })
})

module.exports = router;