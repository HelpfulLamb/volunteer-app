const { createObjectCsvStringifier } = require('csv-writer');

async function generateVolunteerCSV(data){
  const csvStringifier = createObjectCsvStringifier({
    header: [
      {id: 'fullName', title: 'Name'},
      {id: 'event_name', title: 'Event'},
      {id: 'event_date', title: 'Date'},
      {id: 'event_urgency', title: 'Urgency'},
      {id: 'status', title: 'Status'},
      {id: 'hours_worked', title: 'Assignment Duration(minutes)'},
    ],
  });
  const header = csvStringifier.getHeaderString();
  const records = csvStringifier.stringifyRecords(data);
  return header + records;
}

async function generateEventCSV(data){
  const csvStringifier = createObjectCsvStringifier({
    header: [
      {id: 'event_name', title: 'Name'},
      {id: 'event_location', title: 'Location'},
      {id: 'event_date', title: 'Date'},
      {id: 'event_urgency', title: 'Urgency'},
      {id: 'event_status', title: 'Status'},
      {id: 'fullName', title: 'Volunteer'},
      {id: 'email', title: 'Email'},
    ],
  });
  const header = csvStringifier.getHeaderString();
  const records = csvStringifier.stringifyRecords(data);
  return header + records;
}

module.exports = {
  generateVolunteerCSV,
  generateEventCSV
};