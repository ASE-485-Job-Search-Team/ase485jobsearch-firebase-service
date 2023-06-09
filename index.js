var express = require('express');
const cors = require('cors');
var app = express();
const user = require('./routes/user')
const resume = require('./routes/resume')
const company = require('./routes/company')
const job = require('./routes/job')
const statistics = require('./routes/statistics')
var bodyParser = require('body-parser');

const PORT = process.env.PORT || 5050

app.use(cors());
app.use('/api/users', user)
app.use('/api/companies', company)
app.use('/api/resume', resume)
app.use('/api/jobs', job)
app.use('/api/statistics', statistics)


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());



app.listen(PORT, function () {
    console.log(`Demo project at: ${PORT}!`);
});

module.exports = app
