const express = require('express');
const configure = require('./config');

const app = express();
configure(app);
