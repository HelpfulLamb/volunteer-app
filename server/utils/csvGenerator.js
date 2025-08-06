const { createObjectCsvStringifier } = require('csv-writer');

async function generateVolunteerCSV(data){
  const csvStringifier = createObjectCsvStringifier({
    header: [
      {id: 'u_id', title: 'ID'},
      {id: 'fullName', title: 'Name'},
      {id: 'event_name', title: 'Event'},
      {id: 'status', title: 'Status'},
      {id: 'hours_worked', title: 'Hours Worked'},
    ],
  });
  const header = csvStringifier.getHeaderString();
  const records = csvStringifier.stringifyRecords(data);
  return header + records;
}

async function generateEventCSV(data){
  const csvStringifier = createObjectCsvStringifier({
    header: [
      {id: 'e_id', title: 'ID'},
      {id: 'event_name', title: 'Name'},
      {id: 'event_description', title: 'Description'},
      {id: 'event_location', title: 'Location'},
      {id: 'event_skills', title: 'Skils'},
      {id: 'event_date', title: 'Date'},
      {id: 'event_urgency', title: 'Urgency'},
      {id: 'event_status', title: 'Status'},
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