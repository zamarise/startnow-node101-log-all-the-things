// Express server
const express = require('express');
const app = express();
// File System module from Node.js
const fs = require('fs');
// Logging code
app.use((req1, res1, next) => {
  var userAgent = req1['headers']['user-agent'];
  var realUserAgent = userAgent.replace(',', '');
  var method = req1.method;
  var resource = req1.originalUrl;
  var version = req1.httpVersion;
  var status = '200';
  var date = new Date();
  var newDate = date.toISOString();
  var logData = realUserAgent + ',' + newDate + ',' + method + ',' + resource + ',' + "HTTP/" + version + ',' + status + '\n';
  fs.appendFile('log.csv', logData, (err) => {
    if (err) throw err;
    // console.log('The data was logged to the file!');
  });
  console.log(logData);
  next();
});
// Code to respond to ok
app.get('/', (req2, res2) => {
  res2.sendStatus(200);
  // console.log('send status OK', res2.sendStatus);
});
// Return a JSON object containing the log data when accessing logs path
app.get('/logs', (req3, res3) => {
  // Read CSV file
  // res3data is buffer object
  fs.readFile('./log.csv', (err, res3data) => {
    if (err) throw err;
    // Covert buffer object to string
    var bufferString = res3data.toString();
    // Split the string object variable 'bufferString' at each newline to create an array of strings
    var logArr = bufferString.split('\n');
    // Array of final data here
    var dataLog = [];
    // Get headers row from logArr
    var headers = logArr[0].split(',');
    for (var i = 1; i < logArr.length - 1; i++) {
      var theData = {};
      var row = logArr[i].split(',');
      for (var x = 0; x < row.length; x++) {
        theData[headers[x]] = row[x];
      }
      dataLog.push(theData);
    }
    res3.json(dataLog);
  });
});
module.exports = app;
