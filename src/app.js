const express = require('express');
const path = require('path');
const downloadRouter = require('./routes/download');

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use('/download', downloadRouter);

module.exports = app;
