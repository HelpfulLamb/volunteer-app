const request = require('supertest');
const app = require('../server.js');
const reportService = require('../services/reportService.js');
const csvGenerator = require('../utils/csvGenerator.js');
const pdfGenerator = require('../utils/pdfGenerator.js');

// Mock the dependencies
jest.mock('../services/reportService.js');
jest.mock('../utils/csvGenerator.js');
jest.mock('../utils/pdfGenerator.js');

describe('Report Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('History Report', () => {
    test('should generate CSV history report', async () => {
      const mockData = [{ fullName: 'John Doe', event_name: 'Test Event' }];
      const mockCsv = 'Name,Event\nJohn Doe,Test Event';
      
      reportService.getVolunteerParticipationDataCSV.mockResolvedValue(mockData);
      csvGenerator.generateVolunteerCSV.mockResolvedValue(mockCsv);

      const res = await request(app)
        .get('/api/reports/volunteer-history?format=csv');

      expect(res.statusCode).toEqual(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.headers['content-disposition']).toContain('volunteer_report.csv');
    });

    test('should generate PDF history report', async () => {
      const mockData = [{ fullName: 'John Doe', event_name: 'Test Event' }];
      const mockPdf = Buffer.from('PDF content');
      
      reportService.getVolunteerParticipationDataPDF.mockResolvedValue(mockData);
      pdfGenerator.generateVolunteerPDF.mockResolvedValue(mockPdf);

      const res = await request(app)
        .get('/api/reports/volunteer-history?format=pdf');

      expect(res.statusCode).toEqual(200);
      expect(res.headers['content-type']).toContain('application/pdf');
      expect(res.headers['content-disposition']).toContain('volunteer_report.pdf');
    });

    test('should handle errors in history report generation', async () => {
      reportService.getVolunteerParticipationDataCSV.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .get('/api/reports/volunteer-history?format=csv');

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Internal Server Error');
    });
  });

  describe('Event Report', () => {
    test('should generate CSV event report', async () => {
      const mockData = [{ event_name: 'Test Event', event_location: 'Test Location' }];
      const mockCsv = 'Name,Location\nTest Event,Test Location';
      
      reportService.getEventDataCSV.mockResolvedValue(mockData);
      csvGenerator.generateEventCSV.mockResolvedValue(mockCsv);

      const res = await request(app)
        .get('/api/reports/event-summary?format=csv');

      expect(res.statusCode).toEqual(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.headers['content-disposition']).toContain('event_report.csv');
    });

    test('should generate PDF event report', async () => {
      const mockData = [{ event_name: 'Test Event', event_location: 'Test Location' }];
      const mockPdf = Buffer.from('PDF content');
      
      reportService.getEventDataPDF.mockResolvedValue(mockData);
      pdfGenerator.generateEventPDF.mockResolvedValue(mockPdf);

      const res = await request(app)
        .get('/api/reports/event-summary?format=pdf');

      expect(res.statusCode).toEqual(200);
      expect(res.headers['content-type']).toContain('application/pdf');
      expect(res.headers['content-disposition']).toContain('event_report.pdf');
    });

    test('should handle errors in event report generation', async () => {
      reportService.getEventDataCSV.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .get('/api/reports/event-summary?format=csv');

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Internal Server Error');
    });
  });
}); 