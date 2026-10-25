const express = require('express');
const app = express();

// Middleware para permitir que a API receba dados no formato JSON
app.use(express.json());

// --- BANDO DE DADOS EM MEMÓRIA ---
let projetos = [];
let equipes = [];
let idProjetoAtual = 1;
let idEquipeAtual = 1;

// ==========================================
// ENDPOINTS DE EQUIPES
// ==========================================

// 1. POST /equipes - Cria uma nova equipe
app.post('/equipes', (req, res) => {
    const { lider, membros } = req.body;

    // Validação: líder é obrigatório
    if (!lider) {
        return res.status(400).json({ erro: 'Erro de validação: O campo "lider" é obrigatório.' });
    }

    const novaEquipe = {
        id: idEquipeAtual++, // ID gerado pelo sistema
        lider,
        membros: membros || [] // Se não enviar membros, inicia como array vazio
    };

    equipes.push(novaEquipe);
    res.status(201).json(novaEquipe);       
});

// 2. GET /equipes - Retorna todas as equipes
app.get('/equipes', (req, res) => {
    res.json(equipes);
});

// 3. GET /equipes/:id - Retorna uma equipe específica
app.get('/equipes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const equipe = equipes.find(e => e.id === id);

    if (!equipe) {
        return res.status(404).json({ erro: 'Equipe não encontrada.' });
    }

    res.json(equipe);
});

// 4. PUT /equipes/:id - Atualiza uma equipe (Edição Parcial/Total)
app.put('/equipes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = equipes.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Equipe não encontrada.' });
    }

    const { lider, membros } = req.body;

    // Atualiza apenas os campos enviados, mantendo os antigos se não enviados
    const equipeAtualizada = {
        ...equipes[index],
        lider: lider !== undefined ? lider : equipes[index].lider,
        membros: membros !== undefined ? membros : equipes[index].membros
    };

    equipes[index] = equipeAtualizada;
    res.json(equipeAtualizada);
});

// 5. DELETE /equipes/:id - Remove uma equipe
app.delete('/equipes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = equipes.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Equipe não encontrada.' });
    }

    equipes.splice(index, 1);
    res.status(204).send(); // 204 significa "Sucesso, sem conteúdo"
});

// ==========================================
// ENDPOINTS DE PROJETOS
// ==========================================

// 1. POST /projetos - Cria um novo projeto
app.post('/projetos', (req, res) => {
    const { nome, cliente, dataInicio, dataEntrega, idEquipe } = req.body;

    // Validação de campos obrigatórios
    if (!nome || !cliente || dataInicio === undefined || dataEntrega === undefined) {
        return res.status(400).json({ 
            erro: 'Erro de validação: "nome", "cliente", "dataInicio" e "dataEntrega" são obrigatórios.' 
        });
    }

    const novoProjeto = {
        id: idProjetoAtual++, // ID gerado pelo sistema
        nome,
        cliente,
        dataInicio,
        dataEntrega,
        status: 'nao iniciado', // Valor padrão obrigatório, ignora o corpo da requisição
        idEquipe: idEquipe !== undefined ? idEquipe : null // Pode ou não ter equipe
    };

    projetos.push(novoProjeto);
    res.status(201).json(novoProjeto);
});

// 2. GET /projetos - Retorna todos os projetos
app.get('/projetos', (req, res) => {
    res.json(projetos);
});

// 3. GET /projetos/:id - Retorna um projeto específico
app.get('/projetos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const projeto = projetos.find(p => p.id === id);

    if (!projeto) {
        return res.status(404).json({ erro: 'Projeto não encontrado.' });
    }

    res.json(projeto);
});

// 4. PUT /projetos/:id - Atualiza um projeto (Edição Parcial/Total)
app.put('/projetos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = projetos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Projeto não encontrado.' });
    }

    const { nome, cliente, dataInicio, dataEntrega, status, idEquipe } = req.body;

    // Atualiza apenas os campos enviados (ignora qualquer ID enviado no corpo)
    const projetoAtualizado = {
        ...projetos[index], // Mantém as propriedades atuais (incluindo o ID original)
        nome: nome !== undefined ? nome : projetos[index].nome,
        cliente: cliente !== undefined ? cliente : projetos[index].cliente,
        dataInicio: dataInicio !== undefined ? dataInicio : projetos[index].dataInicio,
        dataEntrega: dataEntrega !== undefined ? dataEntrega : projetos[index].dataEntrega,
        status: status !== undefined ? status : projetos[index].status,
        idEquipe: idEquipe !== undefined ? idEquipe : projetos[index].idEquipe
    };

    projetos[index] = projetoAtualizado;
    res.json(projetoAtualizado);
});

// 5. DELETE /projetos/:id - Remove um projeto
app.delete('/projetos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = projetos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Projeto não encontrado.' });
    }

    projetos.splice(index, 1);
    res.status(204).send();
});

// --- INICIANDO O SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});