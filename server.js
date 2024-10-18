const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const volunteerMatchingRoutes = require('./routes/volunteerMatching');
const eventRoutes = require('./routes/event');

app.use('/volunteerMatching', volunteerMatchingRoutes);
app.use('/event', eventRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});