const express = require('express');
const reportController = require('../controllers/reportController.js');
const reportRouter = express();

reportRouter.get('/volunteer-history', reportController.historyReport);
reportRouter.get('/event-summary', reportController.eventReport);

module.exports = {
  reportRouter
};