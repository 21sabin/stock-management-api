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
router.get('/daily', (req, res) => {
  
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
    Sales.find({
        'pid': req.params.id
    }).populate('pid').populate('cid').exec((err, sales) => {
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