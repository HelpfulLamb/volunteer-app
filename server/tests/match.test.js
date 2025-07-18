const request = require('supertest');
const app = require('../server.js');

describe('Match Routes', () => {
    // success testing
    test('should fetch all suggestions', async () => {
        const res = await request(app).post('/api/matching/suggestions').send({
            volunteers: [{
                id: 999,
                name: 'Peter Parker',
                skills: ['First Aid', 'Heavy Lifting', 'Communication', 'Patient', 'Pet Friendly'],
                availability: 'Everyday',
                location: '3509 Elgin St, Houston, TX',
                assigned: false
            }],
            events: [{
                id: 105,
                event_name: 'Forever Homes',
                event_description: 'Help find homes for rescue animals.',
                event_location: '2020 Hermann Dr, Houston, TX',
                event_skills: ['Pet Friendly', 'Patient', 'Communication', 'Translation'],
                event_urgency: 'Low',
                event_data: '2025-07-14'
            }]
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('volunteers');
        expect(res.body).toHaveProperty('events');
        expect(Array.isArray(res.body.volunteers)).toBe(true);
        expect(Array.isArray(res.body.events)).toBe(true);
    });
    test('should fetch all suggestions when volunteer has no matching skills', async () => {
        const res = await request(app).post('/api/matching/suggestions').send({
            volunteers: [{
                id: 999,
                name: 'Norman Osborne',
                skills: ['First Aid', 'Science'],
                availability: 'Everyday',
                location: '3509 Elgin St, Houston, TX',
                assigned: false
            }],
            events: [{
                id: 105,
                event_name: 'Feeding Frenzy',
                event_description: 'Come assist the local communities feed stray animals.',
                event_location: '2020 Hermann Dr, Houston, TX',
                event_skills: ['Pet Friendly', 'Patient', 'Communication', 'Translation'],
                event_urgency: 'Low',
                event_data: '2025-07-14'
            }]
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('volunteers');
        expect(res.body).toHaveProperty('events');
        expect(Array.isArray(res.body.volunteers)).toBe(true);
        expect(Array.isArray(res.body.events)).toBe(true);
    });

    //failure testing


    // internal server error testing
    test('should return status 500 when address or location is invalid', async () => {
        const res = await request(app).post('/api/matching/suggestions').send({
            volunteers: [{
                id: 680,
                name: 'David Morillon',
                skills: ['Translation', 'Driving', 'Patient'],
                availability: 'Weekdays',
                location: '123bbaudf89asdf',
                assigned: true
            }],
            events: [{
                id: 66,
                event_name: 'Gamerhood',
                event_description: 'Help teach youngsters how to play minecraft.',
                event_location: 'ajhdbf8723y4jds',
                event_skills: ['Patient', 'Communication', 'Translation'],
                event_urgency: 'Low',
                event_data: '2025-07-14'
            }]
        });
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Internal Server Error');
    });

});