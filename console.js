// You can load this file with the node REPL to get something analagous
// to the Rails console.

const express = require('express');
const configure = require('./config');

const app = express();
configure(app);
