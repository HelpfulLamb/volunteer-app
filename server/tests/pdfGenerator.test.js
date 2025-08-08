const pdfGenerator = require('../utils/pdfGenerator.js');

// Mock PDFDocument
jest.mock('pdfkit', () => {
  return jest.fn().mockImplementation(() => ({
    pipe: jest.fn(),
    fontSize: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    moveDown: jest.fn().mockReturnThis(),
    font: jest.fn().mockReturnThis(),
    moveTo: jest.fn().mockReturnThis(),
    lineTo: jest.fn().mockReturnThis(),
    stroke: jest.fn().mockReturnThis(),
    y: 100,
    end: jest.fn(),
    on: jest.fn((event, callback) => {
      if (event === 'end') {
        setTimeout(callback, 100);
      }
    })
  }));
});

jest.mock('stream', () => ({
  PassThrough: jest.fn().mockImplementation(() => ({
    on: jest.fn((event, callback) => {
      if (event === 'end') {
        setTimeout(callback, 100);
      }
    }),
    data: Buffer.from('PDF content')
  }))
}));

describe('PDF Generator', () => {
  test('should generate volunteer PDF with data', async () => {
    const testData = [
      {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        skills: ['Communication', 'Leadership'],
        events: [
          {
            event_name: 'Test Event',
            event_date: '2025-01-01',
            event_urgency: 'High',
            status: 'completed'
          }
        ]
      }
    ];

    const result = await pdfGenerator.generateVolunteerPDF(testData);
    expect(result).toBeInstanceOf(Buffer);
  });

  test('should generate volunteer PDF with empty skills', async () => {
    const testData = [
      {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '987-654-3210',
        skills: [],
        events: []
      }
    ];

    const result = await pdfGenerator.generateVolunteerPDF(testData);
    expect(result).toBeInstanceOf(Buffer);
  });

  test('should generate event PDF with data', async () => {
    const testData = [
      {
        event_name: 'Test Event',
        event_location: 'Test Location',
        event_date: '2025-01-01',
        event_urgency: 'Medium',
        event_status: 'Active',
        volunteers: [
          {
            name: 'John Doe',
            email: 'john@example.com'
          }
        ]
      }
    ];

    const result = await pdfGenerator.generateEventPDF(testData);
    expect(result).toBeInstanceOf(Buffer);
  });

  test('should generate event PDF with no participants', async () => {
    const testData = [
      {
        event_name: 'Test Event',
        event_location: 'Test Location',
        event_date: '2025-01-01',
        event_urgency: 'Low',
        event_status: 'Active',
        volunteers: []
      }
    ];

    const result = await pdfGenerator.generateEventPDF(testData);
    expect(result).toBeInstanceOf(Buffer);
  });
}); 