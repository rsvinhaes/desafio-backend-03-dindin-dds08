const bcript = require('bcrypt');
const banco = require('../database');
const {pgErros} = require('../excecoes');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJWT');
const validadores = require('../intermediarios/validadores');

class Usuario {
    constructor() {
        this.tabela = 'usuarios';
    }

    cadastrar = async (req, res) => {
        let { nome, email, senha } = req.body;

        try {
            if (validadores.validarExistenciaSenha(req, res)) { return }
            senha = await bcript.hash(senha, 10);

            await banco.insert({
                tabela: this.tabela,
                valores: { nome, email, senha }
            });

            const conta = await banco.select({
                colunas: 'id,nome,email',
                tabela: this.tabela,
                filtros: { email }
            });

            return res.status(201).json(conta[0]);
            
        } catch (erro) {
            const mensagem = pgErros[erro.code];
            return res.status(400).json({ mensagem });
        }
    }

    login = async (req, res) => {
        const { email } = req.body;

        try {
            if (
                validadores.validarExistenciaSenha(req, res) ||
                await validadores.validarSenha(req, res)
            ) { return }

            const usuario = await banco.select({
                tabela: this.tabela,
                filtros: { email }
            });

            const { id, nome } = usuario[0];
            const token = jwt.sign({ id: usuario[0].id }, senhaJwt, {expiresIn: '8h'});

            const resposta = { 'usuario': { id, nome, email }, 'token': token };
            return res.status(200).json(resposta);
        }
        
        catch (erro) {
            const mensagem = pgErros[erro.code];
            return res.status(400).json({ mensagem });
        }
    }

    detalhar = async (req, res) => {
        let { usuario_id } = req.body;

        try {
            const usuario = await banco.select({
                colunas: 'id,nome,email',
                tabela: this.tabela,
                filtros: { id: usuario_id }
            });

            return res.status(200).json(usuario[0]);
        }
        
        catch (erro) {
            const mensagem = pgErros[erro.code];
            return res.status(400).json({ mensagem });
        }
    }

    atualizar = async (req, res) => {
        let { nome, email, senha, usuario_id } = req.body;

        try {
            if (
                validadores.verificarDados(req, res) ||
                await validadores.validarExistenciaSenha(req, res)
            ) { return }

            senha = await bcript.hash(senha, 10);

            await banco.update({
                tabela: this.tabela,
                filtros: { id: usuario_id }, 
                valores: { nome, email, senha }
            });

            return res.status(204).json({});
        }
        
        catch (erro) {
            const mensagem = pgErros[erro.code];
            return res.status(400).json({ mensagem });
        }
    }
}

module.exports = new Usuario();