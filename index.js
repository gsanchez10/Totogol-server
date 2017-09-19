// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// DB Setup
mongoose.connect('mongodb://localhost:totogol/totogol');

// App Setup
app.use(express.static('../client'));
app.use(morgan('combined'));//logging, for debugging
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);
app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);
