const express = require('express');
const router = express.Router();

const supplierService = require('./../services/supplierService');

router.get("/", (req, res) => {
    supplierService.fetchSupplier()
        .then(data => {
            res.status(200).json({
                message: "List of supplier ",
                success: true,
                data: data
            })
        })
})

router.post('/', (req, res) => {
    console.log("addSupplier", req.headers);
    supplierService.addSupplier(req.body)
        .then(data => {
            res.status(201).json({
                success: true,
                message: "Supplier added sucessfully!",
                data: data
            })
        }).catch(err => {
            res.json({
                sucess: false,
                message: "Error in creating supplier",
                err
            })
        })
});

router.delete('/:supplierId', (req, res) => {
    console.log("delte", req.params.supplierId)
    console.log(req.params.supplierId, "delete request")
    supplierService.deleteSupplier(req.params.supplierId)
        .then(data => {
            res.json({
                data: data,
                sucess: true
            })
        })
});

router.put('/',(req,res)=>{
    supplierService.updateSupplier(req.body)
    .then((response)=>{
        res.json({
            success:true,
            data:response
        })
    })
})





module.exports = router;