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
  doc.text('Name', 50, doc.y, { continued: true, width: 150 });
  doc.text('Event', 200, doc.y, { continued: true, width: 150 });
  doc.text('Status', 350, doc.y, { continued: true, width: 150 });
  doc.text('Hours', 450, doc.y);
  // separate header from content
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);
  // rows
  data.forEach((entry) => {
    doc.text(entry.fullName || '', 50, doc.y, { continued: true, width: 150 });
    doc.text(entry.event_name || '', 200, doc.y, { continued: true, width: 150 });
    doc.text(entry.status || '', 350, doc.y, { continued: true, width: 100 });
    doc.text(String(entry.hours_worked ?? ''), 450, doc.y);
    doc.moveDown(0.5);
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

async function generateEventPDF(data){
  const doc = new PDFDocument({ margin: 50 });
  const stream = new PassThrough();

  doc.pipe(stream);
  // this is for the title
  doc.fontSize(18).text('Event Report', { align: 'center' });
  doc.moveDown();
  // this is for the headers
  doc.fontSize(12);
  doc.text('Name', 50, doc.y, { continued: true, width: 150 });
  doc.text('Location', 200, doc.y, { continued: true, width: 150 });
  doc.text('Status', 350, doc.y, { continued: true, width: 150 });
  doc.text('Date', 450, doc.y);
  // separate header from content
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);
  // rows
  data.forEach((entry) => {
    doc.text(entry.event_name || '', 50, doc.y, { continued: true, width: 100 });
    doc.text(entry.event_location || '', 200, doc.y, { continued: true, width: 100 });
    doc.text(entry.event_status || '', 350, doc.y, { continued: true, width: 100 });
    doc.text(entry.event_date || '', 350, doc.y, { continued: true, width: 100 });
    doc.moveDown(0.5);
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