const csvGenerator = require('../utils/csvGenerator.js');

describe('CSV Generator', () => {
  test('should generate volunteer CSV with correct headers and data', async () => {
    const testData = [
      {
        fullName: 'John Doe',
        event_name: 'Test Event',
        event_date: '2025-01-01',
        event_urgency: 'High',
        status: 'completed',
        hours_worked: 120
      }
    ];

    const result = await csvGenerator.generateVolunteerCSV(testData);
    
    expect(result).toContain('Name,Event,Date,Urgency,Status,Assignment Duration(minutes)');
    expect(result).toContain('John Doe,Test Event,2025-01-01,High,completed,120');
  });

  test('should generate event CSV with correct headers and data', async () => {
    const testData = [
      {
        event_name: 'Test Event',
        event_location: 'Test Location',
        event_date: '2025-01-01',
        event_urgency: 'Medium',
        event_status: 'Active',
        fullName: 'Jane Doe',
        email: 'jane@example.com'
      }
    ];

    const result = await csvGenerator.generateEventCSV(testData);
    
    expect(result).toContain('Name,Location,Date,Urgency,Status,Volunteer,Email');
    expect(result).toContain('Test Event,Test Location,2025-01-01,Medium,Active,Jane Doe,jane@example.com');
  });

  test('should handle empty data arrays', async () => {
    const emptyData = [];

    const volunteerResult = await csvGenerator.generateVolunteerCSV(emptyData);
    const eventResult = await csvGenerator.generateEventCSV(emptyData);
    
    expect(volunteerResult).toContain('Name,Event,Date,Urgency,Status,Assignment Duration(minutes)');
    expect(eventResult).toContain('Name,Location,Date,Urgency,Status,Volunteer,Email');
  });
}); 