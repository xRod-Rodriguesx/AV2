import React, { createContext, useContext, useState, useEffect } from "react";
import { Aeronave, Funcionario, Peca, Etapa, Teste, TipoAeronave, NivelPermissao, TipoPeca, StatusPeca, StatusEtapa, TipoTeste, ResultadoTeste } from "../logic/models";

interface IDatabaseContext {
    aeronaves: Aeronave[];
    funcionarios: Funcionario[];
    addAeronave: (aeronave: Aeronave) => Promise<boolean>; // Agora retorna Promise (async)
    addFuncionario: (funcionario: Funcionario) => Promise<boolean>;
    updateAeronave: (aeronave: Aeronave) => void;
    salvarDados: () => void;
    refreshDados: () => void;
}

const DatabaseContext = createContext<IDatabaseContext>(null!);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

    // Função que busca os dados reais do Back-end
    const fetchData = async () => {
        try {
            console.log("🔄 Buscando dados do servidor...");

            // 1. Buscar Funcionários
            const resFunc = await fetch('http://localhost:3001/funcionarios');
            const dataFunc = await resFunc.json();
            const funcionariosRevividos = dataFunc.map((f: any) => new Funcionario(
                f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao as NivelPermissao
            ));
            setFuncionarios(funcionariosRevividos);

            // 2. Buscar Aeronaves
            const resAero = await fetch('http://localhost:3001/aeronaves');
            const dataAero = await resAero.json();
            
            const aeronavesRevividas = dataAero.map((a: any) => {
                const novaAeronave = new Aeronave(
                    a.codigo, a.modelo, a.tipo as TipoAeronave, a.capacidade, a.alcance
                );

                // Reconstrói as peças
                if (a.pecas) {
                    novaAeronave.pecas = a.pecas.map((p: any) => {
                        const novaPeca = new Peca(p.nome, p.tipo as TipoPeca, p.fornecedor);
                        novaPeca.status = p.status as StatusPeca;
                        (novaPeca as any).id = p.id; // Guarda o ID do banco
                        return novaPeca;
                    });
                }

                // Reconstrói as etapas
                if (a.etapas) {
                    novaAeronave.etapas = a.etapas.map((e: any) => {
                        const novaEtapa = new Etapa(e.nome, e.prazo);
                        novaEtapa.status = e.status as StatusEtapa;
                        (novaEtapa as any).id = e.id;

                        if (e.funcionarios) {
                            novaEtapa.funcionarios = e.funcionarios.map((f: any) => new Funcionario(
                                f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao as NivelPermissao
                            ));
                        }
                        return novaEtapa;
                    });
                }

                // Reconstrói os testes
                if (a.testes) {
                    novaAeronave.testes = a.testes.map((t: any) => {
                        const novoTeste = new Teste(t.tipo as TipoTeste, t.resultado as ResultadoTeste);
                        (novoTeste as any).id = t.id;
                        return novoTeste;
                    });
                }

                return novaAeronave;
            });
            setAeronaves(aeronavesRevividas);
            console.log("✅ Dados carregados do MySQL!");

        } catch (error) {
            console.error("❌ Erro ao buscar dados:", error);
        }
    };

    // Carrega os dados ao abrir a página
    useEffect(() => {
        fetchData();
    }, []);

    // --- AÇÕES DE ESCRITA (POST) ---
    
    const addAeronave = async (aeronave: Aeronave): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:3001/aeronaves', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codigo: aeronave.codigo,
                    modelo: aeronave.modelo,
                    tipo: aeronave.tipo,
                    capacidade: aeronave.capacidade,
                    alcance: aeronave.alcance
                })
            });

            if (response.ok) {
                fetchData(); // Atualiza a lista com os dados do banco
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao salvar aeronave:", error);
            return false;
        }
    };

    const addFuncionario = async (funcionario: Funcionario): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:3001/funcionarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: funcionario.nome,
                    telefone: funcionario.telefone,
                    endereco: funcionario.endereco,
                    usuario: funcionario.usuario,
                    senha: funcionario.senha,
                    nivelPermissao: funcionario.nivelPermissao
                })
            });

            if (response.ok) {
                fetchData();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao salvar funcionário:", error);
            return false;
        }
    };

    const updateAeronave = (aeronave: Aeronave) => {
        // Por enquanto atualiza só localmente para refletir na tela rápido
        setAeronaves(prev => prev.map(a => a.codigo === aeronave.codigo ? aeronave : a));
    };

    const salvarDados = () => {};
    const refreshDados = () => { fetchData(); };

    return (
        <DatabaseContext.Provider 
            value={{ aeronaves, funcionarios, addAeronave, addFuncionario, updateAeronave, salvarDados, refreshDados }}
        >
            {children}
        </DatabaseContext.Provider>
    );
}

export function useDatabase() {
    return useContext(DatabaseContext);
}