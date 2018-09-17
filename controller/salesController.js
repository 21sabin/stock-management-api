const router = require('express').Router();
const salesService = require('./../services/salesService');
const Sales = require('./../models/sales');
const Inventory = require('./../models/inventory');
const moment = require('moment');


router.get('/report', (req, res) => {
    Sales.find().populate('pid').populate('cid').exec((err, sales) => {
        res.status(200).json({
            data: sales
        })
    })
});

/*api for chartjs implementatioon */
router.get('/summary', (req, res) => {
    console.log("summary");
    Sales.aggregate([{
            $match: {
                quantity: "quantity"
            },
            $group: {
                _id: "$category",
                quantity: "$quantity",
                totalSales: {
                    $sum: "$rate"
                }
            }


        }

    ]).then(result => {
        res.json({
            data: result
        })
    })
    // Sales.aggregate([
    //     {
    //         $lookup:{
    //             from:"Inventory",
    //             localField:"category",
    //             foreignField:"cid",
    //             as:"category_list"
    //         }
    //     }
    // ]).then(result=>{
    //     res.json({
    //         data:result
    //     })
    // })

})

router.get("/mostSold", (req, res) => {

    Sales.aggregate([{
        $group: {
            _id: "$pid",
            toalSales: {
                $sum: {
                    $multiply: ["$rate", "$quantity"]
                }
            }
        }
    }]).then(result => {
        let data = [];
        result.forEach(sales => {
            InventoryModel.findById(sales._id).then(product => {
                let obj = Object.assign({}, sales, {
                    product: product
                });
                console.log(obj, "object")
                data.push(obj)
            }).catch(err => {
                console.log(err, "err in inventory model")
            })
            console.log(data, "testing data")
        });

        res.json({
            data: data
        })
    }).catch(err => {
        console.log(err, "erro in aggregate")
    })

})
// Invite.aggregate(
//     { $match: {interview: req.params.interview}},
//     { $lookup: {from: 'users', localField: 'email', foreignField: 'email', as: 'user'} }
//   ).exec( function (err, invites) {
//     if (err) {
//       next(err);
//     }

//     res.json(invites);
//   }
// );
router.get('/daily', (req, res) => {
    // Sales.aggregate([
    //     {
    //         $group:{
    //             _id:{day:{$dayOfMonth:"$date"},id:"$_id",totalSales:{$sum:{$multiply:["$rate","$quantity"]}}}
    //         }
    //     },{
    //         $lookup:{
    //             from:"Inventory",
    //             localField:"pid",
    //             foreignField:"_id",
    //             as:"products"
    //         }
    //     }
    // ]).then(data=>{
    //     console.log(data);
    //     let product=[]
    //     data.forEach(p=>{
    //        Inventory.findById(p._id.id).then(result=>{
    //            console.log(result,"inventory resul")
    //        })
    //     })
    //     res.json({
    //         result:data
    //     })
    // })


    // Sales.aggregate([{
    //         $group: {
    //             _id: {
    //                 day: {
    //                     $dayOfMonth: "$date"
    //                 },
    //                 totalSales: {
    //                     $sum: {
    //                         $multiply: ["$rate", "$quantity"]
    //                     }
    //                 }
    //             },
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: 'InventoryModel',
    //             localField: 'product',
    //             foreignField: '_id',
    //             as: 'product'
    //         }
    //     }
    // ]).exec(function (err, result) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log(result, "result")
    //     res.json(result);
    // });
})

router.get("/monthly", (req, res) => {
    let monthlySales = [];
    Sales.find().populate('pid', 'productName').then(result => {
        result.map(data=>{
            console.log(data,"data")
            let date=moment(data.date).format('MMM')
           let obj={
            month:date,
            productName:data.pid.productName,
            quantity:data.quantity,
            rate:data.rate
           }
          monthlySales.push(obj)
        })
        res.json(monthlySales)

    })
})
router.get('/report/:id', (req, res) => {
    let id = req.params.id;
    //    var query=Sales.find({});
    //    query.where('pid',"5b88d7e01b5ef713c2caf4e8");
    //    query.exec((err,result)=>{
    //     res.json({
    //         data:result
    //     })
    //    })
    Sales.find({
        'pid': req.params.id
    }).populate('pid').populate('category').exec((err, sales) => {
        if (sales) {
            res.json({
                data: sales
            })
        } else {
            res.json({
                message: "No sales for this item"
            })
        }
    })
})

router.get('/salesReports', (req, res) => {
    Sales.aggregate([{
        $group: {
            _id: "$pid",
            totalSales: {
                $sum: {
                    $multiply: ["$quantity", "$rate"]
                }
            }
        },

    }]).then(result => {
        result.forEach(sales => {

        })
        res.status(200).json({
            data: result
        })
    })
})

module.exports = router;