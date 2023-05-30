const { Pool } = require('pg');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./src/configuracoes.json'));

const pool = new Pool({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database
});

module.exports = pool;