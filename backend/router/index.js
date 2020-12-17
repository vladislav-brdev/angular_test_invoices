const express = require('express');
const router = express.Router();

const { invoiceController } = require('./controllers');
const { invoiceMiddleware } = require('./middleware');

router.post('/',
  invoiceMiddleware.uploadInvoiceCSV,
  invoiceController.saveInvoice,
);
router.get('/',
  invoiceController.getInvoices,
);

module.exports = router;