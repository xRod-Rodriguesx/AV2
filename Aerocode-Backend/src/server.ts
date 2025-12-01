import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- NOVO: Middleware para medir Tempo de Processamento ---
app.use((req, res, next) => {
    const start = process.hrtime(); // Inicia o cronômetro de alta precisão

    // Quando a resposta for enviada (finish), paramos o cronômetro
    res.on('finish', () => {
        const diff = process.hrtime(start);
        const timeInMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(3); // Converte para milissegundos
        console.log(`[METRICA] ${req.method} ${req.url} - Processamento: ${timeInMs}ms`);
    });

    next();
});

// --- ROTAS DE FUNCIONÁRIOS ---

app.get('/funcionarios', async (req, res) => {
    try {
        const funcionarios = await prisma.funcionario.findMany();
        res.json(funcionarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar funcionários' });
    }
});

app.post('/funcionarios', async (req, res) => {
    const { nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;
    try {
        const novo = await prisma.funcionario.create({
            data: { nome, telefone, endereco, usuario, senha, nivelPermissao }
        });
        res.json(novo);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar funcionário.' });
    }
});

app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;
    try {
        const funcionario = await prisma.funcionario.findUnique({ where: { usuario } });
        if (funcionario && funcionario.senha === senha) {
            res.json(funcionario);
        } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// --- ROTAS DE AERONAVES ---

app.get('/aeronaves', async (req, res) => {
    try {
        const aeronaves = await prisma.aeronave.findMany({
            include: {
                pecas: true,
                etapas: { include: { funcionarios: true } },
                testes: true
            }
        });
        res.json(aeronaves);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar aeronaves' });
    }
});

app.post('/aeronaves', async (req, res) => {
    const { codigo, modelo, tipo, capacidade, alcance } = req.body;
    try {
        const nova = await prisma.aeronave.create({
            data: { codigo, modelo, tipo, capacidade, alcance }
        });
        res.json(nova);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar aeronave.' });
    }
});

// --- ROTAS DE PEÇAS ---

app.post('/pecas', async (req, res) => {
    const { nome, tipo, fornecedor, aeronaveId } = req.body;
    try {
        const novaPeca = await prisma.peca.create({
            data: { nome, tipo, fornecedor, aeronaveId, status: 'EM_PRODUCAO' }
        });
        res.json(novaPeca);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao adicionar peça.' });
    }
});

app.put('/pecas/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const pecaAtualizada = await prisma.peca.update({
            where: { id },
            data: { status }
        });
        res.json(pecaAtualizada);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar status da peça.' });
    }
});

// --- ROTAS DE ETAPAS ---

app.post('/etapas', async (req, res) => {
    const { nome, prazo, aeronaveId } = req.body;
    try {
        const novaEtapa = await prisma.etapa.create({
            data: { nome, prazo, aeronaveId, status: 'PENDENTE' }
        });
        res.json(novaEtapa);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao adicionar etapa.' });
    }
});

// Atualizar status da etapa (Iniciar/Finalizar)
app.put('/etapas/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // PENDENTE, ANDAMENTO ou CONCLUIDA
    try {
        const etapaAtualizada = await prisma.etapa.update({
            where: { id },
            data: { status }
        });
        res.json(etapaAtualizada);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar status da etapa.' });
    }
});

// Associar funcionário à etapa
app.post('/etapas/:id/associar', async (req, res) => {
    const { id } = req.params; // ID da Etapa
    const { funcionarioId } = req.body;
    try {
        const etapa = await prisma.etapa.update({
            where: { id },
            data: {
                funcionarios: {
                    connect: { id: funcionarioId }
                }
            },
            include: { funcionarios: true }
        });
        res.json(etapa);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao associar funcionário.' });
    }
});

// --- ROTAS DE TESTES ---

app.post('/testes', async (req, res) => {
    const { tipo, resultado, aeronaveId } = req.body;
    try {
        const novoTeste = await prisma.teste.create({
            data: { tipo, resultado, aeronaveId }
        });
        res.json(novoTeste);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao registrar teste.' });
    }
});

// --- INICIALIZAÇÃO ---
const PORT = 3001;
app.listen(PORT, async () => {
    console.log(`🚀 Servidor Aerocode rodando em http://localhost:${PORT}`);
    
    // Seed Admin
    const adminExiste = await prisma.funcionario.findUnique({ where: { usuario: 'admin' } });
    if (!adminExiste) {
        await prisma.funcionario.create({
            data: {
                nome: "Admin Principal",
                telefone: "99999-9999",
                endereco: "Sede da AeroCode",
                usuario: "admin",
                senha: "admin",
                nivelPermissao: "ADMINISTRADOR"
            }
        });
        console.log("User 'admin' criado automaticamente.");
    }
});