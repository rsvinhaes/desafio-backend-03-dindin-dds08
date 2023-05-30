class DataBase{
    constructor() {
        this.pool = require('./conexao');
    }

    select = async (parametros) => {
        const colunas = parametros.colunas ? parametros.colunas : '*';
        const tabela = parametros.tabela;
        const filtros = parametros.filtros ? parametros.filtros : { 1: 1 };
        const ordenar = parametros.ordenar ? parametros.ordenar : '1';

        const filtrarChaves = Object.keys(filtros).map((key, index) => (filtros[key] ? key:1) + '=$' + (index + 1)).join(' and ');
        const filtrarValores = Object.values(filtros).map((value) => value ? value : 1);

        const query = `
            select ${colunas} 
            from ${tabela} 
            where ${filtrarChaves} 
            order by ${ordenar.replace('-','')} ${ordenar[0]=='-' ? "desc":"asc"}
        `;

        const resultado = await this.pool.query(query, filtrarValores);
        return resultado.rows;
    }

    insert = async (parametros) => {
        const tabela = parametros.tabela;
        const valores = parametros.valores;

        const valoresFiltrados = {}
        Object.entries(valores).forEach(([key, value]) => {
            value ? valoresFiltrados[key] = value : 'null';
        })

        const query = `
            INSERT INTO
            ${tabela} (${Object.keys(valoresFiltrados).join(',')}) 
            VALUES (${Object.keys(valoresFiltrados).map((key, index) => '$' + (index+1)).join(',')})
        `;

        const params = Object.values(valoresFiltrados);
        await this.pool.query(query, params);
    }

    update = async (parametros) => {
        const tabela = parametros.tabela;
        const valores = parametros.valores;
        const filtros = parametros.filtros;

        const setChaves = Object.keys(valores).map((key, index) => (valores[key] ? key : 1) + '=$' + (index + 1)).join(' , ');
        const setValores = Object.values(valores).map((value) => value ? value : 1);

        const filtrarChaves = Object.keys(filtros).map((key, index) => (filtros[key] ? key:1) + '=$' + (index + setValores.length + 1)).join(' and ');
        const filtrarValores = Object.values(filtros).map((value) => value ? value : 1);

        const query = `
            UPDATE ${tabela}
            SET ${setChaves}
            WHERE ${filtrarChaves}
        `;

        const params = setValores.concat(filtrarValores);
        await this.pool.query(query, params);
    }

    delete = async (parametros) => {
        const tabela = parametros.tabela;
        const filtros = parametros.filtros;

        const filtrarChaves = Object.keys(filtros).map((key, index) => (filtros[key] ? key:1) + '=$' + (index + 1)).join(' and ');
        const filtrarValores = Object.values(filtros).map((value) => value ? value : 1);

        const query = `
            DELETE FROM ${tabela}
            WHERE ${filtrarChaves} 
        `;

        await this.pool.query(query, filtrarValores);
    }
}

module.exports = new DataBase();