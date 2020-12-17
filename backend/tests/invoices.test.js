const request = require('supertest');
const app = require('../');

describe('Get Endpoints', () => {
	it('should return all invoices', async () => {
		const res = await request(app).get('/');
		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body.data)).toBeTruthy();
	});
});

describe('Post Endpoints', () => {
	it('should create new invoice', async () => {
		const res = await request(app)
			.post('/')
			.attach('invoice_csv', `../example.csv`);

		expect(res.statusCode).toEqual(201);
		expect(typeof res.body.data.id).toBe('number');
	});

	it('should not create new invoice due to invalid values', async () => {
		const res = await request(app)
			.post('/')
			.attach('invoice_csv', `../example_error.csv`);

        const errorConfig = JSON.parse(res.error.text)

        expect(res.statusCode).toEqual(400);
		expect(errorConfig[0].errors.find((item) => item.field === 'number' && !item.isValid)).toBeTruthy();
		expect(errorConfig[0].errors.find((item) => item.field === 'amount' && !item.isValid)).toBeTruthy();
		expect(errorConfig[0].errors.find((item) => item.field === 'dueDate' && !item.isValid)).toBeTruthy();
	});
});
