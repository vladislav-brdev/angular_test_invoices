const {
  saveInvoice,
  getInvoices,
} = require('./invoice');

const invoiceController = {
  saveInvoice,
  getInvoices,
};

module.exports = { invoiceController };