const mongoose=require('mongoose');


var supplierService=(()=>{
    const SupplierModel=require('./../models/supplier');

    async function addSupplier(supplier){
        return await SupplierModel.create({
            name:supplier.name,
            address:supplier.address,
            contact:supplier.contact
        })
    }

    async function fetchSupplier(){
        return await SupplierModel.find();
    }

    async function deleteSupplier(supplierId){
       return await SupplierModel.findByIdAndRemove(supplierId);
    }

    async function updateSupplier(supplier){
        let options={new :true};
        return await SupplierModel.findByIdAndUpdate(
            {_id:supplier._id},
            { $set: { name:supplier.name,address:supplier.address,contact:supplier.contact}}
        )
    }

    async function fetchSupplierById(supplierId){
        return await SupplierModel.findById({_id:supplierId});
    }
    async function checkDuplicateSupplier(contact){
        return await SupplierModel.find({contact:contact});
    }

    return {
        addSupplier:addSupplier,
        fetchSupplier:fetchSupplier,
        deleteSupplier:deleteSupplier,
        updateSupplier:updateSupplier,
        fetchSupplierById:fetchSupplierById,
        checkDuplicateSupplier:checkDuplicateSupplier
    }

})();

module.exports=supplierService;