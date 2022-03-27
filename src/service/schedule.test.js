// Required to test
const sinon = require('sinon');
const stagesData = require('../data/stages');
const timeData = require('../data/time');
const tourneysData = require('../data/tourneys');

// Unit under test
const scheduleService = require('./schedule');

describe('schedule service', () => {
    beforeAll(() => {
        sinon.stub(stagesData, 'getStagesByDate');
        sinon.stub(timeData, 'getPeriodDates');
        sinon.stub(tourneysData, 'getTourneys');
    });

    afterAll(sinon.restore);

    describe('.getSchedulesByMonth()', () => {
        let stagesMock;
        let tourneysMock;
        beforeEach(() => {
            stagesMock = [
                {
                    _id: '1s',
                    tourney: '1t',
                    name: 'SIGN UP',
                    begin: '2022-01-08T00:00:00.000Z',
                    end: '2022-01-17T23:59:00.000Z'
                },
                {
                    _id: '2s',
                    tourney: '1t',
                    name: 'QUALIFIERS',
                    begin: '2022-01-18T00:00:00.000Z',
                    end: '2022-01-20T23:59:00.000Z'
                },
                {
                    _id: '3s',
                    tourney: '2t',
                    name: 'SIGN UP',
                    begin: '2022-02-08T00:00:00.000Z',
                    end: '2022-02-17T23:59:00.000Z'
                },
            ];
            tourneysMock = [
                {
                    _id: '1t',
                    maxRank: 100,
                    minRank: 1,
                    mode: 'STD',
                    name: 'Awesome tournament'
                },
                {
                    _id: '2t',
                    maxRank: 300,
                    minRank: 500,
                    mode: 'STD',
                    name: 'Cool tournament'
                }
            ];

            stagesData.getStagesByDate.returns({
                lean: async() => stagesMock
            });
            timeData.getPeriodDates.returns({
                start: '2022-01-01T00:00:00.000Z',
                end: '2022-01-31T59:59:59.000Z'
            });
            tourneysData.getTourneys.returns({
                lean: async() => tourneysMock
            });
        });

        describe('when no stages are found for the given month', () => {
            test('should return an empty array', async() => {
                stagesData.getStagesByDate.returns({
                    lean: async() => []
                });
                const schedule = await scheduleService.getSchedules('january', 2022, 0);
                expect(schedule).toEqual([]);
            });
        });

        describe('when no tourneys data is found', () => {
            test('should return an empty array', async() => {
                tourneysData.getTourneys.returns({
                    lean: async() => []
                });
                const schedule = await scheduleService.getSchedules('january', 2022, 0);
                expect(schedule).toEqual([]);
            });
        });

        describe('when partial tourneys data is found', () => {
            test('should return the stages only for the tourneys found', async() => {
                tourneysData.getTourneys.returns({
                    lean: async() => tourneysMock.slice(0, 1)
                });
                const schedule = await scheduleService.getSchedules('january', 2022, 0);
                expect(schedule).toEqual([
                    {
                        _id: '1t',
                        maxRank: 100,
                        minRank: 1,
                        mode: 'STD',
                        name: 'Awesome tournament',
                        stages: [
                            {
                                _id: '1s',
                                name: 'SIGN UP',
                                begin: '2022-01-08T00:00:00.000Z',
                                end: '2022-01-17T23:59:00.000Z'
                            },
                            {
                                _id: '2s',
                                name: 'QUALIFIERS',
                                begin: '2022-01-18T00:00:00.000Z',
                                end: '2022-01-20T23:59:00.000Z'
                            }
                        ]
                    }
                ]);
            });
        });

        test('should return an array of tourneys with their stages', async() => {
            const schedule = await scheduleService.getSchedules('january', 2022, 0);
            expect(schedule).toEqual([
                {
                    _id: '1t',
                    maxRank: 100,
                    minRank: 1,
                    mode: 'STD',
                    name: 'Awesome tournament',
                    stages: [
                        {
                            _id: '1s',
                            name: 'SIGN UP',
                            begin: '2022-01-08T00:00:00.000Z',
                            end: '2022-01-17T23:59:00.000Z'
                        },
                        {
                            _id: '2s',
                            name: 'QUALIFIERS',
                            begin: '2022-01-18T00:00:00.000Z',
                            end: '2022-01-20T23:59:00.000Z'
                        }
                    ]
                },
                {
                    _id: '2t',
                    maxRank: 300,
                    minRank: 500,
                    mode: 'STD',
                    name: 'Cool tournament',
                    stages: [
                        {
                            _id: '3s',
                            name: 'SIGN UP',
                            begin: '2022-02-08T00:00:00.000Z',
                            end: '2022-02-17T23:59:00.000Z'
                        }
                    ]
                }
            ]);
        });
    });
});
