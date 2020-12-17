const lineByLine = require('n-readlines');
const yup = require('yup');
const moment = require('moment');

const parseFormats = ['YYYY-MM-DD'];
const invalidDate = new Date('');

function numberValidation() {
  return yup.number().min(1).required();
}
function amountValidation() {
  return yup.number().min(1).required();
}
function dueDateValidation() {
  return yup.date().max(new Date()).transform((value, originalValue) => {
   value = moment(originalValue, parseFormats);
   return value.isValid() ? value.toDate() : invalidDate;
  }).required();
}

const schema = yup.object().shape({
  number: numberValidation(),
  amount: amountValidation(),
  dueDate: dueDateValidation(),
});

class InvoiceCSVRow {
  constructor(line, invoiceId) {
    this.invoiceId = invoiceId;
    this.line = line;
  }

  async getRow() {
    const csvRowArray = this.line.split(',');
    const csvRowData = {
      number: csvRowArray[0] ? csvRowArray[0] : '',
      amount: csvRowArray[1] ? csvRowArray[1] : '',
      dueDate: csvRowArray[2] ? csvRowArray[2] : '',
    };

    try {
      await schema.validate(csvRowData);
      return { ...csvRowData, invoiceId: this.invoiceId }
    } catch (e) {
      return {
        ...csvRowData,
        errors: [
          {
            field: 'number',
            isValid: await numberValidation().isValid(csvRowData.number),
          },
          {
            field: 'amount',
            isValid: await amountValidation().isValid(csvRowData.amount),
          },
          {
            field: 'dueDate',
            isValid: await dueDateValidation().isValid(csvRowData.dueDate),
          },
        ]
      }
    }
  }
}

class InvoiceCSVProcessing {
  constructor(fileName, invoiceId) {
    this.invoiceId = invoiceId;
    this.liner = new lineByLine(`./tmp/${fileName}`);
  }

  async fileProcessing(cb) {
    const lines = [];

    try {
      let line;
      while (line = this.liner.next()) {
        const invoiceCSVRow = new InvoiceCSVRow(
          line.toString().replace('\r', ''),
          this.invoiceId,
        );
        lines.push(await invoiceCSVRow.getRow());

        if (lines.length === 100) {
          await cb([...lines]);
          lines.length = 0;
        }
      }

      if (lines.length) {
        await cb([...lines]);
      }
    } catch (e) {
      throw e;
    }
  }
}

module.exports = InvoiceCSVProcessing;