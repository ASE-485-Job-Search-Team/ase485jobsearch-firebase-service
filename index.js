var express = require('express');
var app = express();
const user = require('./routes/user')
const resume = require('./routes/resume')
const admin = require('./routes/admin')
const job = require('./routes/job')
var bodyParser = require('body-parser');

const PORT = process.env.PORT || 5050


app.use('/api/users', user)
app.use('/admin', admin)
app.use('/resume', resume)
app.use('/api/jobs', job)


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());



app.listen(PORT, function () {
    console.log(`Demo project at: ${PORT}!`);
});

module.exports = app
