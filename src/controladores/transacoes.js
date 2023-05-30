const banco = require('../database');
const { erros } = require('../excecoes');
const validadores = require('../intermediarios/validadores');

class Transacao {
    constructor() {
        this.tabela = 'transacoes';     
    }

    listar = async (req, res) => {
        let { usuario_id } = req.body;
        let { order, filtro } = req.query;

        try {
            let transacoes = await banco.select({
                colunas: '*,(select descricao as categoria_nome from categorias where transacoes.categoria_id = categorias.id)',
                tabela: this.tabela,
                filtros: { usuario_id },
                ordenar: order
            });

            if (filtro) {
                transacoes = transacoes.filter((transacao) => filtro.includes(transacao.categoria_nome));
            }
            return res.status(200).json(transacoes);
        }

        catch (erro) {
            const errorCode = '06';
            return res.status(500).json({ mensagem: erros[errorCode]});
        }
    }

    detalhar = async (req, res) => {
        let { id } = req.params;
        let { usuario_id } = req.body;

        try {
            let transacao = await banco.select({
                colunas: '*,(select descricao as categoria_nome from categorias where transacoes.categoria_id = categorias.id)',
                tabela: this.tabela,
                filtros: { id, usuario_id }
            });

            if (validadores.validarTransacaoExistente(req, res, transacao)) { return }
            return res.status(200).json(transacao[0]);
        }
        
        catch (erro) {
            const errorCode = '06';
            return res.status(500).json({ mensagem: erros[errorCode]});
        }
    }

    cadastrar = async (req, res) => {
        let { descricao, valor, data, categoria_id, tipo, usuario_id } = req.body;

        try {
            if (
                validadores.validarTipoTransacao(req, res) ||
                await validadores.validarValor(req, res)
            ) {return}

            await banco.insert({
                valores: {descricao, valor, data, categoria_id, usuario_id, tipo},
                tabela: this.tabela,
                filtros: { usuario_id }
            });

            let transacao = await banco.select({
                colunas: '*,(select descricao as categoria_nome from categorias where transacoes.categoria_id = categorias.id)',
                tabela: this.tabela,
                filtros: { usuario_id },
                ordenar: '-id'
            });
            
            return res.status(201).json(transacao[0]);
        }

        catch (erro) {
            const errorCode = '06';
            return res.status(500).json({ mensagem: erros[errorCode]});
        }
    }

    atualizar = async (req, res) => {
        let { id } = req.params;
        let { descricao, valor, data, categoria_id, tipo, usuario_id } = req.body;

        try {
            let transacao = await banco.select({
                tabela: this.tabela,
                filtros: { id, usuario_id }
            });

            if (
                validadores.validarTipoTransacao(req, res) ||
                await validadores.validarTransacaoExistente(req, res, transacao)
            ) { return }
            
            await banco.update({
                tabela: this.tabela,
                valores: {descricao, valor, data, categoria_id, tipo},
                filtros: {id, usuario_id}
            });

            return res.status(204).json({});
        }
        
        catch (erro) {
            const errorCode = '06';
            return res.status(500).json({ mensagem: erros[errorCode]});
        }
    }

    deletarId = async (req, res, transacao) => {
        let { id } = req.params;
        let { usuario_id } = req.body;

        try {
            let transacao = await banco.select({
                tabela: this.tabela,
                filtros: { id, usuario_id }
            });

            if (
                validadores.validarTransacaoExistente(req, res, transacao)
            ) { return }

            await banco.delete({
                tabela: this.tabela,
                filtros: {id, usuario_id}
            });

            return res.status(204).json({});
        }
        
        catch (erro) {
            const errorCode = '06';
            return res.status(500).json({ mensagem: erros[errorCode]});
        }
    }

    listarExtrato = async (req, res) => {
        let { usuario_id } = req.body;

        try {
            let saidaEntrada = await banco.select({
                colunas: `  COALESCE(sum(valor) filter (where tipo = 'entrada'),0)::integer entrada,
                            COALESCE(sum(valor) filter (where tipo = 'saida'),0)::integer saida   `,
                tabela: this.tabela,
                filtros: { usuario_id },
            });

            return res.status(200).json( saidaEntrada[0] );
            
        } catch (erro) {
            const errorCode = '06';
            return res.status(500).json({ mensagem: erros[errorCode]});
        }
    }
}

module.exports = new Transacao();