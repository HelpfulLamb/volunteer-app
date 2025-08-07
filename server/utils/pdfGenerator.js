const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

async function generateVolunteerPDF(data){
  const doc = new PDFDocument({ margin: 50 });
  const stream = new PassThrough();

  doc.pipe(stream);
  // this is for the title
  doc.fontSize(18).text('Volunteer Participation Report', { align: 'center' });
  doc.moveDown();
  // this is for the headers
  doc.fontSize(12);
  data.forEach((vol, index) => {
    doc.font('Helvetica-Bold').fontSize(14).text(`${index + 1}. ${vol.fullName}`);
    doc.moveDown(0.3);
    //details
    doc.font('Helvetica').fontSize(12);
    doc.text(`Email: ${vol.email}`);
    doc.text(`Phone: ${vol.phone}`);
    doc.moveDown(0.5);
    // skills
    if(vol.skills.length > 0){
      doc.font('Helvetica-Bold').text('Skills');
      vol.skills.forEach((skill) => {
        doc.font('Helvetica').text(` - ${skill}`)
      });
    } else {
      doc.font('Helvetica-Oblique').text('No skills available.');
    }
    doc.moveDown(0.5);
    if(vol.events.length > 0){
      doc.font('Helvetica-Bold').text('Events Participated');
      vol.events.forEach((event) => {
        doc.font('Helvetica').text(` - ${event.event_name} (${new Date(event.event_date).toDateString()}) - ${event.status}, ${`${Math.floor(event.hours_worked / 60)} hr ${event.hours_worked % 60} min`}`);
      });
    } else {
      doc.font('Helvetica-Oblique').text('No history available.');
    }
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

  })
  // finalize pdf file
  doc.end();
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

async function generateEventPDF(data){
  const doc = new PDFDocument({ margin: 50 });
  const stream = new PassThrough();

  doc.pipe(stream);
  // this is for the title
  doc.fontSize(18).text('Event Report', { align: 'center' });
  doc.moveDown();
  // this is for the headers
  doc.fontSize(12);
  data.forEach((event, index) => {
    doc.font('Helvetica-Bold').fontSize(14).text(`${index + 1}. ${event.event_name}`);
    doc.moveDown(0.3);
    // details
    doc.font('Helvetica').fontSize(12);
    doc.text(`Date: ${new Date(event.event_date).toDateString()}`);
    doc.text(`Location: ${event.event_location}`);
    doc.text(`Status: ${event.event_status}`);
    doc.text(`Urgency: ${event.event_urgency}`);
    doc.moveDown(0.5);
    // volunteer list
    if(event.volunteers.length > 0){
      doc.font('Helvetica-Bold').text('Volunteers Assigned');
      event.volunteers.forEach((vol) => {
        doc.font('Helvetica').text(` - ${vol.name} (${vol.email})`);
      })
    } else {
      doc.font('Helvetica-Oblique').text('No volunteers assigned.');
    }
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);
  });
  // finalize pdf file
  doc.end();
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

module.exports = {
  generateVolunteerPDF,
  generateEventPDF
};