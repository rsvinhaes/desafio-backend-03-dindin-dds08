const { erros } = require('../excecoes');
const bcript = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJWT');
const banco = require('../database');

class Validadores{
    validarToken = async (req, res, next) => {
        let { authorization } = req.headers;
        
        try {
            const tokenUsuario = jwt.verify(authorization.split(' ')[1], senhaJwt);
            let usuario_id = tokenUsuario.id;
            req.body.usuario_id = usuario_id;
        }
        
        catch (erro) {
            const errorCode = '01';
            return res.status(401).json({ mensagem: erros[errorCode]});
        }
        
        return next();
    }
    validarTipoTransacao = (req, res) => {
        let { tipo } = req.body;

        if (tipo != 'saida' && tipo != 'entrada') {
            const errorCode = '02';
            return res.status(403).json({ mensagem: erros[errorCode]});
        }
    }
    validarValor = async (req, res) => {
        let { valor } = req.body;
        
        if (valor <= 0) {
            const errorCode = '03';
            return res.status(400).json({ mensagem: erros[errorCode]});
        }
    }
    validarTransacaoExistente = (req, res, transacao) => {
        if (!transacao[0]) {
            const errorCode = '05';
            return res.status(404).json({ mensagem: erros[errorCode]});
        }
    }
    validarExistenciaSenha = (req, res) => {
        let { senha } = req.body;

        if (!senha) {
            const errorCode = '07';
            return res.status(403).json({ mensagem: erros[errorCode]});
        }
    }
    validarSenha = async (req, res) => {
        const { senha, email } = req.body;

        const usuario = await banco.select({
            tabela: 'usuarios',
            filtros: { email }
        });

        if (usuario.length == 0) {
            const errorCode = '08';
            return res.status(400).json({ mensagem: erros[errorCode] });
        }

        const senhaValida = await bcript.compare(senha, usuario[0].senha);

        if (!senhaValida) {
            const errorCode = '08';
            return res.status(400).json({ mensagem: erros[errorCode] });
        }
    }
    verificarDados = (req, res) => {
        let { nome, email } = req.body;

        if (!email || !nome) {
            const errorCode = '07';
            return res.status(403).json({ mensagem: erros[errorCode] });
        }
    }
}

module.exports = new Validadores();