require('dotenv/config');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './tmp',
  filename: (req, file, cb) => {
    const originalFileName = JSON.stringify(file.originalname);

    let newFileName = '';
    for (let i = 0; i < originalFileName.length; i++) {
      if (i !== originalFileName.length - 1) {
        newFileName += originalFileName.charAt(i) === '"' || originalFileName.charAt(i) === ' ' ? '-' : originalFileName.charAt(i);
      }
    }
    cb(null, Date.now() + '-' + newFileName);
  }
});

const uploadInvoiceCSV = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: (req, file, cb) => {
    sanitizeFile(file, cb);
  }
}).any();

function sanitizeFile(file, cb) {
  if (file.mimetype === process.env.INVOICE_CSV_FILE_TYPE) {
    cb(null, true);
  } else {
    cb({ errorType: 'INAPPROPRIATE_FILE_TYPE' });
  }
}

module.exports = uploadInvoiceCSV;
