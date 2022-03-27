// Required to test
const request = require('supertest');
const queryString = require('query-string');
const sinon = require('sinon');
const app = require('../app');
const scheduleService = require('../service/schedule');

describe('tourneys routes', () => {
    const mockError = new Error('BOOM!');

    beforeAll(() => {
        sinon.stub(scheduleService, 'getSchedules');
    });

    afterAll(sinon.restore);

    describe('/v1/tourneys/schedule', () => {
        let queryParams;
        let responseMock;

        beforeEach(() => {
            queryParams = {
                month: 'january',
                year: 2022,
                utcOffset: 60
            };
            responseMock = [
                { name: 'My tourney' }
            ];
            scheduleService.getSchedules.resolves(responseMock);
        });

        describe('when request has an invalid query parameter', () => {
            test('it should respond with 400 status code', async() => {
                queryParams.month = 'invalid month';
                const response = await request(app).get(`/v1/tourneys/schedule?${queryString.stringify(queryParams)}`);
                expect(response.statusCode).toBe(400);
            });
        });

        describe('when getting schedules throws an error', () => {
            test('it should respond with 500 status code', async() => {
                scheduleService.getSchedules.rejects(mockError);
                const response = await request(app).get(`/v1/tourneys/schedule?${queryString.stringify(queryParams)}`);
                expect(response.statusCode).toBe(500);
            });
        });

        describe('when everything is OK', () => {
            test('it should respond with 200 status code', async() => {
                const response = await request(app).get(`/v1/tourneys/schedule?${queryString.stringify(queryParams)}`);
                expect(response.statusCode).toBe(200);
            });
        });
    });
});
