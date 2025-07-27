const express = require('express');
const matchController = require('../controllers/matchController.js');
const matchRouter = express();

matchRouter.post('/suggestions', matchController.getMatchingSuggestions);

module.exports = {
    matchRouter
};