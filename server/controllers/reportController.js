const generateCSV = require('../utils/csvGenerator.js');
const generatePDF = require('../utils/pdfGenerator.js');
const reportService = require('../services/reportService.js');

exports.historyReport = async (req, res) => {
  const format = req.query.format;
  try {
    const data = await reportService.getVolunteerParticipationData();
    if(format === 'csv'){
      const csv = await generateCSV.generateVolunteerCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=volunteer_report.csv');
      return res.send(csv);
    }
    if(format === 'pdf'){
      const pdf = await generatePDF.generateVolunteerPDF(data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=volunteer_report.pdf');
      return res.send(pdf);
    }
  } catch (error) {
    console.error('historyReport controller catch:', error.message);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

exports.eventReport = async (req, res) => {
  const format = req.query.format;
  try {
    const data = await reportService.getEventData();
    if(format === 'csv'){
      const csv = await generateCSV.generateEventCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=event_report.csv');
      return res.send(csv);
    }
    if(format === 'pdf'){
      const pdf = await generatePDF.generateEventPDF(data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=event_report.pdf');
      return res.send(pdf);
    }
  } catch (error) {
    console.error('eventReport controller catch:', error.message);
    res.status(500).json({message: 'Internal Server Error'});
  }
};