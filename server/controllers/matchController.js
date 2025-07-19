const { getMatchingSuggestions } = require('../utils/matchLogic.js');

exports.getMatchingSuggestions = async (req, res) => {
    try {
        const volunteers = req.body.volunteers;
        const events = req.body.events;
        const suggestions = await getMatchingSuggestions(volunteers, events);
        res.status(200).json({volunteers: suggestions, events});
    } catch (error) {
        //console.error('Failed to calculate distance. ', error.message);
        res.status(500).json({message: 'Internal Server Error'});
    }
};