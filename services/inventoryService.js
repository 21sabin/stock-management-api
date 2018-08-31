var inventoryService = (() => {

  const InventoryModel = require('../models/inventory');
  const SalesModel = require('../models/sales')
  const CategoryModel = require('../models/category');

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
      date: inventory.date,
      cid: inventory.productCategory
    })
    // return await InventoryModel.create(inventory)
  }

  // for sales
  async function addSales(sales) {
    console.log('inside add sales controller');
    return await SalesModel.create({
      productName: sales.productName,
      category: sales.category,
      date: sales.date,
      rate: sales.rate,
      quantity: sales.quantity,
      total: sales.total
    })
  }

  async function fetchAllInventory() {
    return await InventoryModel.find();
  }

  async function fetchInventoryById(inventoryId) {
    return await InventoryModel.findById(inventoryId);
  }

  // async function editInventory(body, inventoryId) {
  //   return await InventoryModel.findByIdAndUpdate(inventoryId, {
  //     $set: {
  //       productName: body.productName,
  //       quantity: body.quantity,
  //       measurement: body.measurement,
  //       originalPrice: body.originalPrice,
  //       sellingPrice: body.sellingPrice,
  //       profit: body.profit,
  //       supplier: body.supplier
  //     }
  //   });
  // }

  async function deleteCategory(categoryId) {
    return await CategoryModel.findByIdAndRemove(categoryId);
  }

  async function updateCategory(category) {
    return await CategoryModel.update(
      { _id: category._id },
      {
        $set: {
          category: category.category
        }
      }
    )
  }

  async function deleteInventory(id) {
    return await InventoryModel.findByIdAndRemove(id);
  }

  async function fetchProduct() {
    return await InventoryModel.find();
  }

  async function countProduct() {
    return await InventoryModel.aggregate([
      { $group: { _id: "$pname", count: { $sum: 1 } } }
    ])
  }

  async function updateProduct(product) {
    console.log(product, "product inside update porudiuct")
    return await InventoryModel.updateOne(
      { _id: product._id },
      {
        $set: {
          productName: product.productName,
          quantity: product.quantity,
          measurement: product.measurement,
          originalPrice: product.originalPrice,
          sellingPrice: product.sellingPrice,
          supplier: product.supplier,
          date: product.date
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
    deleteCategory: deleteCategory,
    updateCategory: updateCategory
  }
})();

module.exports = inventoryService;