const banco = require('../database');
const { pgErros } = require('../excecoes');

class Categorias {
    constructor() {
        this.tabela = "categorias";
    }

    listar = async (req, res) => {
        try {
            const categorias = await banco.select({
                tabela: this.tabela
            });
            
            return res.status(200).json(categorias);
        }
        
        catch (erro) {
            const mensagem = pgErros[erro.code];
            return res.status(400).json({ mensagem });
        }
    }
}

module.exports = new Categorias();