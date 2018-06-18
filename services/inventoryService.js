var inventoryService = (() => {

  const InventoryModel = require('../models/inventory');

  async function createInventory(inventory) {
    return await InventoryModel.create({
      productName: inventory.productName,
      quantity: inventory.quantity,
      measurement: inventory.measurement,
      originalPrice: inventory.originalPrice,
      sellingPrice: inventory.sellingPrice,
      profit: inventory.profit,
      supplier: inventory.supplier,
      date:inventory.date
    })
  }

  async function deleteInventory(id) {
    return await InventoryModel.findByIdAndRemove(id);
  }

  async function fetchProduct(){
    return await InventoryModel.find();
  }

  async function countProduct(){
    return await InventoryModel.aggregate([
      { $group:{_id:"$pname",count:{$sum:1}} }
    ])
  }

  async function updateProduct(product){
    console.log(product,"product inside update porudiuct")
    return await InventoryModel.updateOne(
      {_id:product._id},
      {$set:{
      productName:product.productName,
      quantity:product.quantity,
      measurement:product.measurement,
      originalPrice:product.originalPrice,
      sellingPrice:product.sellingPrice,
      supplier:product.supplier,
      date:product.date
      }
    },
    
  )
  // return await InventoryModel.findByIdAndUpdate(
  //   {_id:product._id},
  //   { $set:{}}
  // )
  }

 

  return {
    createInventory: createInventory,
    deleteInventory: deleteInventory,
    fetchProduct:fetchProduct,
    countProduct:countProduct,
    updateProduct:updateProduct
  }
})();

module.exports = inventoryService;