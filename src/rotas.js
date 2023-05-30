const express = require('express');
const rotas = express();
const usuario = require('./controladores/usuarios');
const categorias = require('./controladores/categorias');
const transacao = require('./controladores/transacoes');
const validadores = require('./intermediarios/validadores');

rotas.post('/usuario', usuario.cadastrar);
rotas.post('/login', usuario.login);
rotas.get('/usuario', validadores.validarToken, usuario.detalhar);
rotas.put('/usuario', validadores.validarToken, usuario.atualizar);
rotas.get('/categoria', validadores.validarToken, categorias.listar);
rotas.get('/transacao', validadores.validarToken, transacao.listar);
rotas.get('/transacao/extrato', validadores.validarToken, transacao.listarExtrato);
rotas.get('/transacao/:id', validadores.validarToken, transacao.detalhar);
rotas.post('/transacao', validadores.validarToken, transacao.cadastrar);
rotas.put('/transacao/:id', validadores.validarToken, transacao.atualizar);
rotas.delete('/transacao/:id', validadores.validarToken, transacao.deletarId); 

module.exports = rotas; 