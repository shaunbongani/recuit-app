const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const jobs = require('./data/jobs.json');

// Routes
app.get('/jobs', (req, res) => res.json(jobs));

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
