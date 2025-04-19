// src/config/database.js
const knex = require('knex');
const knexConfig = require('../../knexfile.js'); // Path to knexfile

const environment = process.env.NODE_ENV || 'development';
const connectionConfig = knexConfig[environment];

const db = knex(connectionConfig);

module.exports = db; // Export knex instance
