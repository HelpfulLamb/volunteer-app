const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});