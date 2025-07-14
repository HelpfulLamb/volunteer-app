const express = require('express');
const matchController = require('../controllers/matchController.js');
const matchRouter = express();

matchRouter.post('/suggestions', matchController.getMatchingSuggestions);  // get event suggestions
//matchRouter.get('', );  // get events
//matchRouter.path('', )  // assign volunteers to events

module.exports = {
    matchRouter
};