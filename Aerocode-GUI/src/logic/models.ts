// --- ENUMS ---
export enum TipoAeronave {
    COMERCIAL = 'Comercial',
    MILITAR = 'Militar',
}
export enum TipoPeca {
    NACIONAL = 'Nacional',
    IMPORTADA = 'Importada',
}
export enum StatusPeca {
    EM_PRODUCAO = 'Em Produção',
    EM_TRANSPORTE = 'Em Transporte',
    PRONTA = 'Pronta',
}
export enum StatusEtapa {
    PENDENTE = 'Pendente',
    ANDAMENTO = 'Em Andamento',
    CONCLUIDA = 'Concluída',
}
export enum NivelPermissao {
    ADMINISTRADOR = 'Administrador',
    ENGENHEIRO = 'Engenheiro',
    OPERADOR = 'Operador',
}
export enum TipoTeste {
    ELETRICO = 'Elétrico',
    HIDRAULICO = 'Hidráulico',
    AERODINAMICO = 'Aerodinâmico',
}
export enum ResultadoTeste {
    APROVADO = 'Aprovado',
    REPROVADO = 'Reprovado',
}

// --- CLASSES DE MODELO ---

export class Funcionario {
    id: string;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: NivelPermissao;

    constructor(id: string, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }

    autenticar(usuario: string, senha: string): boolean {
        return this.usuario === usuario && this.senha === senha;
    }
}

export class Peca {
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status: StatusPeca;

    constructor(nome: string, tipo: TipoPeca, fornecedor: string) {
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        this.status = StatusPeca.EM_PRODUCAO;
    }

    atualizarStatus(novoStatus: StatusPeca): void {
        console.log(`Status da peça '${this.nome}' atualizado de '${this.status}' para '${novoStatus}'.`);
        this.status = novoStatus;
    }
}

export class Etapa {
    nome: string;
    prazo: string;
    status: StatusEtapa;
    funcionarios: Funcionario[] = [];

    constructor(nome: string, prazo: string) {
        this.nome = nome;
        this.prazo = prazo;
        this.status = StatusEtapa.PENDENTE;
    }

    iniciar(): boolean {
        if (this.status === StatusEtapa.PENDENTE) {
            this.status = StatusEtapa.ANDAMENTO;
            console.log(`Etapa '${this.nome}' iniciada.`);
            return true;
        } else {
            console.log(`Não foi possível iniciar a etapa '${this.nome}', pois seu status é '${this.status}'.`);
            return false;
        }
    }

    finalizar(): boolean {
        if (this.status === StatusEtapa.ANDAMENTO) {
            this.status = StatusEtapa.CONCLUIDA;
            console.log(`Etapa '${this.nome}' finalizada.`);
            return true;
        } else {
            console.log(`Não foi possível finalizar a etapa '${this.nome}', pois ela não está em andamento.`);
            return false;
        }
    }

    associarFuncionario(funcionario: Funcionario): void {
        const funcionarioExistente = this.funcionarios.find(f => f.id === funcionario.id);
        if (!funcionarioExistente) {
            this.funcionarios.push(funcionario);
            console.log(`Funcionário '${funcionario.nome}' associado à etapa '${this.nome}'.`);
        } else {
            console.log(`Funcionário '${funcionario.nome}' já está associado a esta etapa.`);
        }
    }
}

export class Teste {
    tipo: TipoTeste;
    resultado: ResultadoTeste;

    constructor(tipo: TipoTeste, resultado: ResultadoTeste) {
        this.tipo = tipo;
        this.resultado = resultado;
    }
}

export class Aeronave {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
    pecas: Peca[] = [];
    etapas: Etapa[] = [];
    testes: Teste[] = [];

    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
    }
    
    adicionarPeca(peca: Peca) {
        this.pecas.push(peca);
    }
    
    adicionarEtapa(etapa: Etapa) {
        this.etapas.push(etapa);
    }

    adicionarTeste(teste: Teste) {
        this.testes.push(teste);
    }

    iniciarProximaEtapa(): string {
        const proximaEtapaIndex = this.etapas.findIndex(e => e.status === StatusEtapa.PENDENTE);
        if (proximaEtapaIndex === -1) {
            return "Não há etapas pendentes para iniciar.";
        }
        const algumaEtapaEmAndamento = this.etapas.some(e => e.status === StatusEtapa.ANDAMENTO);
        if(algumaEtapaEmAndamento) {
            return "Já existe uma etapa em andamento. Finalize-a antes de iniciar a próxima.";
        }
        for (let i = 0; i < proximaEtapaIndex; i++) {
            const etapaAnterior = this.etapas[i];
            if (etapaAnterior && etapaAnterior.status !== StatusEtapa.CONCLUIDA) {
                const etapaAtual = this.etapas[proximaEtapaIndex];
                return `Não é possível iniciar a etapa '${etapaAtual?.nome}' pois a etapa anterior '${etapaAnterior.nome}' não foi concluída.`;
            }
        }
        const etapaParaIniciar = this.etapas[proximaEtapaIndex];
        if (etapaParaIniciar) {
            etapaParaIniciar.iniciar();
            return `Etapa '${etapaParaIniciar.nome}' iniciada com sucesso.`;
        }
        return "Erro desconhecido ao tentar iniciar etapa.";
    }
    
    finalizarEtapaAtual(): string {
        const etapaEmAndamento = this.etapas.find(e => e.status === StatusEtapa.ANDAMENTO);
        if (etapaEmAndamento) {
            etapaEmAndamento.finalizar();
            return `Etapa '${etapaEmAndamento.nome}' finalizada com sucesso.`;
        } else {
            return "Nenhuma etapa está em andamento para ser finalizada.";
        }
    }
    
    detalhesAeronave(): string { 
        let detalhes = "--- Detalhes da Aeronave ---\n";
        detalhes += `Código: ${this.codigo}\n`;
        detalhes += `Modelo: ${this.modelo}\n\n`;
        
        detalhes += "--- Peças ---\n";
        if (this.pecas.length === 0) {
            detalhes += "Nenhuma peça\n";
        } else {
            this.pecas.forEach(p => {
                detalhes += `- ${p.nome} (Status: ${p.status})\n`;
            });
        }
        // ... (você pode adicionar mais detalhes aqui)
        return detalhes;
    }
}

export class Relatorio {
    
    public gerarRelatorio(aeronave: Aeronave): string {
        console.log(`Gerando relatório para a aeronave ${aeronave.codigo}...`);
        
        let conteudo = "******************************************************\n";
        conteudo += "      * RELATÓRIO FINAL DE PRODUÇÃO DE AERONAVE *\n";
        conteudo += "******************************************************\n\n";

        // Seção 1: Detalhes da Aeronave
        conteudo += "--- 1. DADOS DA AERONAVE ---\n";
        conteudo += `Código: ${aeronave.codigo}\n`;
        conteudo += `Modelo: ${aeronave.modelo}\n`;
        conteudo += `Tipo: ${aeronave.tipo}\n`;
        conteudo += `Capacidade: ${aeronave.capacidade} passageiros\n`;
        conteudo += `Alcance: ${aeronave.alcance} km\n\n`;

        // Seção 2: Peças Utilizadas
        conteudo += "--- 2. PEÇAS UTILIZADAS ---\n";
        if (aeronave.pecas.length === 0) {
            conteudo += "Nenhuma peça registrada.\n";
        } else {
            aeronave.pecas.forEach(peca => {
                conteudo += `- Peça: ${peca.nome} (Fornecedor: ${peca.fornecedor})\n`;
                conteudo += `  Tipo: ${peca.tipo}\n`;
                conteudo += `  Status Final: ${peca.status}\n`;
            });
        }
        conteudo += "\n";

        // Seção 3: Etapas de Produção
        conteudo += "--- 3. ETAPAS DE PRODUÇÃO ---\n";
        if (aeronave.etapas.length === 0) {
            conteudo += "Nenhuma etapa de produção registrada.\n";
        } else {
            aeronave.etapas.forEach((etapa, index) => {
                conteudo += `${index + 1}. Etapa: ${etapa.nome}\n`;
                conteudo += `   Prazo: ${etapa.prazo}\n`;
                conteudo += `   Status: ${etapa.status}\n`;
                const nomesFuncionarios = etapa.funcionarios.map(f => f.nome).join(', ');
                conteudo += `   Responsáveis: ${nomesFuncionarios || 'Nenhum'}\n`;
            });
        }
        conteudo += "\n";

        // Seção 4: Testes Realizados
        conteudo += "--- 4. TESTES DE QUALIDADE ---\n";
        if (aeronave.testes.length === 0) {
            conteudo += "Nenhum teste registrado.\n";
        } else {
            aeronave.testes.forEach(teste => {
                conteudo += `- Teste de ${teste.tipo}: ${teste.resultado}\n`;
            });
        }
        conteudo += "\n";

        conteudo += "******************************************************\n";
        conteudo += "           * AERONAVE PRONTA PARA ENTREGA *\n";
        conteudo += "******************************************************\n";

        return conteudo;
    }

    public salvarEmArquivoWeb(relatorioConteudo: string, codigoAeronave: string): void {
        const nomeArquivo = `Relatorio-Aeronave-${codigoAeronave}.txt`;
        const blob = new Blob([relatorioConteudo], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log(`Relatório ${nomeArquivo} enviado para download.`);
    }
}