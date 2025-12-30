
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');

require('events').EventEmitter.defaultMaxListeners = 500;

const app = express();
const __path = process.cwd();
const PORT = process.env.PORT || 10000;

const qrRoute = require('./qr.js');
const codeRoute = require('./pair.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use('/qr', qrRoute);
app.use('/code', codeRoute);

app.use('/code', (req, res) => {
  res.sendFile(path.join(__path, 'pair.html'));
});
app.use('/qr', (req, res) => {
  res.sendFile(path.join(__path, 'pair.html'));
});
  
app.use('/', (req, res) => {
  res.sendFile(path.join(__path, 'main.html'));
});

const server = http.createServer(app);

server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;
