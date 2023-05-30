class PgErros{
    '23502' = 'É obrigatório preencher todos os dados requisitados!'
    '23505' = 'Já existe usuário cadastrado com o e-mail informado!'   
}

class Erros{
    '01' = 'Para acessar este recurso um token de autenticação válido deve ser enviado!'
    '02' = 'Tipo inválido! Verificar os dados informados.'
    '03' = 'Insira um valor maior que zero!'
    '04' = 'Saldo insuficiente!'
    '05' = 'Transação não encontrada!'
    '06' = 'Erro interno do servidor.'
    '07' = 'É obrigatório preencher todos os dados requisitados!'
    '08' = 'Email e/ou senha inválido(s).'
}

module.exports = {
    pgErros: new PgErros(),
    erros: new Erros()
}