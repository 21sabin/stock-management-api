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

 

  return {
    createInventory: createInventory,
    deleteInventory: deleteInventory,
    fetchProduct:fetchProduct,
    countProduct:countProduct
  }
})();

module.exports = inventoryService;