const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});


// import the routers
const { eventRouter } = require('./routes/eventRoute.js');
const { userRouter } = require('./routes/userRoute.js');
const { matchRouter } = require('./routes/matchRoute.js');
const { notificationRouter } = require('./routes/notificationRoute.js');
const { volunteerHistoryRouter } = require('./routes/volunteerHistoryRoute.js');

const PORT = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// using the routers
app.use('/api/events', eventRouter);
app.use('/api/users', userRouter);
app.use('/api/matching', matchRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/volunteer-history', volunteerHistoryRouter);

app.get('/', (req, res) => {
    res.send('Server Active')
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!')
});

if(require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;