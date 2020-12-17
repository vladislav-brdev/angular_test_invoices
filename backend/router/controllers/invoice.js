const InvoiceCSVProcessing = require('../../utils/csvProcessing');
const { Invoice } = require('../../models');
const { Row } = require('../../models');
const db = require('../../models');

module.exports.saveInvoice = async (req, res, next) => {
	let transaction;
	let rows = [];
	let newInvoice;

	try {
		transaction = await db.sequelize.transaction();

    let isHaveInvalidRow = false;
		const invoice = new Invoice();
		newInvoice = await invoice.save({ transaction });

		const filename = (req.file && req.file.filename) || (req.files && req.files[0].filename);
		const csvParts = new InvoiceCSVProcessing(filename, newInvoice.id);
		await csvParts.fileProcessing(async (part) => {
      if (!isHaveInvalidRow && part.length && part.every((p) => p.hasOwnProperty('invoiceId'))) {
        try {
          await Row.bulkCreate(part, { transaction });
        } catch (e) {
          throw e;
        }
      } else {
        if (!isHaveInvalidRow) {
          isHaveInvalidRow = true;
        }

        rows = rows.concat(part.filter((p) => !p.hasOwnProperty('invoiceId')));

        if (!transaction.finished) {
          await transaction.rollback();
        }
      }
		});

		if (!transaction.finished) {
			await transaction.commit();
		}
		if (rows.length) {
			res.status(400).send(rows);
		} else {
			const result = await getInvoiceById(newInvoice.dataValues.id);
			const total = countTotalSellPrice(result.dataValues);
			res.status(201).send({ data: { ...result.get(), total } });
		}
	} catch (e) {
		if (!transaction.finished) {
			await transaction.rollback();
		}
	}
};

module.exports.getInvoices = async (req, res, next) => {
	let invoices = [];
	try {
		invoices = await Invoice.findAll({
			attributes: ['id', 'createdAt'],
			include: [
				{
					model: Row,
					attributes: ['number', 'amount', 'dueDate', 'sellPrice'],
				},
			],
			group: ['id', 'Rows.id'],
		});
	} catch (e) {
		console.log(e);
		res.send(e);
	} finally {
		const result = invoices.map((invoice) => {
			const total = countTotalSellPrice(invoice.dataValues);

			return {
				...invoice.get(),
				total,
			};
		});
		res.send({ data: result });
	}
};

async function getInvoiceById(id) {
	return await Invoice.findOne({
		where: { id },
		attributes: ['id', 'createdAt'],
		include: [
			{
				model: Row,
				attributes: ['number', 'amount', 'dueDate', 'sellPrice'],
			},
		],
		group: ['id', 'Rows.id'],
	});
}

function countTotalSellPrice(invoice) {
	return invoice.Rows.reduce((prev, next) => {
		return prev + next.get().amount;
	}, 0).toFixed(2);
}
