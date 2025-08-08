const reportService = require('../services/reportService.js');
const db = require('../db.js');

// Mock the database module
jest.mock('../db.js');

describe('Report Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getVolunteerParticipationDataPDF', () => {
    test('should return grouped volunteer data for PDF', async () => {
      const mockRows = [
        {
          u_id: 1,
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          skills: ['Communication', 'Leadership'],
          event_name: 'Test Event',
          event_date: '2025-01-01',
          event_urgency: 'High',
          status: 'completed',
          hours_worked: 120
        }
      ];

      db.query.mockResolvedValue([mockRows]);

      const result = await reportService.getVolunteerParticipationDataPDF();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        u_id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        skills: ['Communication', 'Leadership']
      });
      expect(result[0].events).toHaveLength(1);
    });

    test('should handle multiple events for same volunteer', async () => {
      const mockRows = [
        {
          u_id: 1,
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          skills: ['Communication'],
          event_name: 'Event 1',
          event_date: '2025-01-01',
          event_urgency: 'High',
          status: 'completed',
          hours_worked: 120
        },
        {
          u_id: 1,
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          skills: ['Communication'],
          event_name: 'Event 2',
          event_date: '2025-01-02',
          event_urgency: 'Medium',
          status: 'scheduled',
          hours_worked: 90
        }
      ];

      db.query.mockResolvedValue([mockRows]);

      const result = await reportService.getVolunteerParticipationDataPDF();

      expect(result).toHaveLength(1);
      expect(result[0].events).toHaveLength(2);
    });
  });

  describe('getVolunteerParticipationDataCSV', () => {
    test('should return flat volunteer data for CSV', async () => {
      const mockRows = [
        {
          u_id: 1,
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          event_name: 'Test Event',
          event_date: '2025-01-01',
          event_urgency: 'High',
          status: 'completed',
          hours_worked: 120
        }
      ];

      db.query.mockResolvedValue([mockRows]);

      const result = await reportService.getVolunteerParticipationDataCSV();

      expect(result).toEqual(mockRows);
    });
  });

  describe('getEventDataPDF', () => {
    test('should return grouped event data for PDF', async () => {
      const mockRows = [
        {
          e_id: 1,
          event_name: 'Test Event',
          event_location: 'Test Location',
          event_date: '2025-01-01',
          event_urgency: 'High',
          event_status: 'Active',
          u_id: 1,
          fullName: 'John Doe',
          email: 'john@example.com'
        }
      ];

      db.query.mockResolvedValue([mockRows]);

      const result = await reportService.getEventDataPDF();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        e_id: 1,
        event_name: 'Test Event',
        event_location: 'Test Location',
        event_date: '2025-01-01',
        event_urgency: 'High',
        event_status: 'Active'
      });
      expect(result[0].volunteers).toHaveLength(1);
    });
  });

  describe('getEventDataCSV', () => {
    test('should return flat event data for CSV', async () => {
      const mockRows = [
        {
          e_id: 1,
          event_name: 'Test Event',
          event_location: 'Test Location',
          event_date: '2025-01-01',
          event_urgency: 'High',
          event_status: 'Active',
          fullName: 'John Doe',
          email: 'john@example.com'
        }
      ];

      db.query.mockResolvedValue([mockRows]);

      const result = await reportService.getEventDataCSV();

      expect(result).toEqual(mockRows);
    });
  });
}); 