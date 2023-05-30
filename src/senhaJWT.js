const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./src/configuracoes.json'));

module.exports = config.senhaJWT;