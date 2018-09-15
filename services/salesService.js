var salesService = (() => {
    const SalesModel = require('./../models/sales')
    async function salesReport() {
          SalesModel.find().populate('productName').exec((err, sales) => {
            return sales;
        })
    }

    return {
        salesReport: salesReport
    }

})();

module.exports = salesService;