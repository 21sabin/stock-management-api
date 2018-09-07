const moment = require('moment');
var inventoryService = (() => {

  const InventoryModel = require('../models/inventory');
  const SalesModel = require('../models/sales')
  const Category = require('./../models/category')

  async function createInventory(inventory) {
    console.log(inventory, 'casdasd');
    return await InventoryModel.create({
      productName: inventory.productName,
      quantity: inventory.quantity,
      measurement: inventory.measurement,
      originalPrice: inventory.originalPrice,
      sellingPrice: inventory.sellingPrice,
      profit: inventory.profit,
      supplier: inventory.supplier,
      date: new Date(inventory.date),
      cid: inventory.productCategory
    })
    // return await InventoryModel.create(inventory)
  }

  // for sales
  async function addSales(sales) {
    console.log(sales.date,'inside add sales controller');
    return await SalesModel.create({
      pid: sales.productName,
      category: sales.category,
      date:sales.date,
      rate: sales.rate,
      quantity: sales.quantity
    })
  }



  async function fetchAllInventory() {
    return await InventoryModel.find();
  }

  async function fetchInventoryById(inventoryId) {
    return await InventoryModel.findById(inventoryId);
  }

  async function deleteInventory(id) {
    return await InventoryModel.findByIdAndRemove(id);
  }

  async function fetchProduct() {
    return await InventoryModel.find();
  }

  async function countProduct() {
    return await InventoryModel.aggregate([{
      $group: {
        _id: "$pname",
        count: {
          $sum: 1
        }
      }
    }])
  }

  async function updateProduct(product) {
    console.log(product, "product inside update porudiuct")
    return await InventoryModel.updateOne({
      _id: product._id
    }, {
      $set: {
        productName: product.productName,
        quantity: product.quantity,
        measurement: product.measurement,
        originalPrice: product.originalPrice,
        sellingPrice: product.sellingPrice,
        supplier: product.supplier,
        date: product.date
      }
    })
  }

  async function getCategoryById(cid) {
    return Category.findById(cid);
  }

  async function deductProductFromInventory(sales) {
    console.log(sales,"update salaes")
      return InventoryModel.updateOne(
        {
          _id:sales.productName
        },
        {
          $set:{
            quantity:sales.quantity
          }
        }
      )
  }

  return {
    createInventory: createInventory,
    deleteInventory: deleteInventory,
    fetchProduct: fetchProduct,
    countProduct: countProduct,
    updateProduct: updateProduct,
    addSales: addSales,
    getCategoryById: getCategoryById,
    deductProductFromInventory: deductProductFromInventory
  }
})();

module.exports = inventoryService;