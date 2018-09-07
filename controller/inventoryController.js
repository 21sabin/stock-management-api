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

router.post('/create', (req, res) => {
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

router.post('/addSales', (req, res) => {
  inventoryService.addSales(req.body)
    .then(data => {
      inventoryService.deductProductFromInventory(req.body).then(result => {
        console.log(result, "upate success")
      }).catch(err => {
        console.log(err, "udpate failed")
      });
      res.status(201).json({
        message: 'Sales added successfully!',
        success: true,
        data
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

router.delete('/:inventoryID', (req, res) => {
  console.log('inside delete inventory', req.params.inventoryID);
  inventoryService.deleteInventory(req.params.inventoryID)
    .then(data => {
      res.json({
        message: "Inventory deleted successfully",
        success: true,
        data: data
      })
    })
    .catch(err => {
      res.json({
        message: "Couldn't delete inventroy with the specified ID",
        success: false
      })
    })
});

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
    Inventory.count().then(counts=>{
      res.json({
        inventoryValue:totalValue,
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