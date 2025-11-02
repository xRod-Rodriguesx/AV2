// src/pages/AeronavesPage.tsx
import { useState } from "react";
import { Aeronave, StatusEtapa } from "../logic/models";
import { useDatabase } from "../contexts/DatabaseContext";
import './PageStyles.css';
import { Modal } from "../components/Modal";
import { AddAeronaveForm } from "../components/forms/AddAeronaveForm";
import { useNavigate } from "react-router-dom"; // 1. Importar useNavigate

// ... (função getStatusProducao continua a mesma) ...
function getStatusProducao(aeronave: Aeronave): string {
    const etapaEmAndamento = aeronave.etapas.find(e => e.status === StatusEtapa.ANDAMENTO);
    if (etapaEmAndamento) {
        return `Em Andamento: ${etapaEmAndamento.nome}`;
    }
    const proximaEtapa = aeronave.etapas.find(e => e.status === StatusEtapa.PENDENTE);
    if (proximaEtapa) {
        return `Pendente: ${proximaEtapa.nome}`;
    }
    if (aeronave.etapas.length > 0 && aeronave.etapas.every(e => e.status === StatusEtapa.CONCLUIDA)) {
        return "Produção Concluída";
    }
    return "Aguardando Planejamento";
}


export function AeronavesPage() {
    const { aeronaves } = useDatabase();
    const [isModalAberto, setIsModalAberto] = useState(false);
    const navigate = useNavigate(); // 2. Iniciar o hook

    const handleGerenciar = (aeronave: Aeronave) => {
        // 3. ALTERADO: Agora navega para a URL dinâmica
        navigate(`/aeronaves/${aeronave.codigo}`);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Gerenciamento de Aeronaves</h2>
                <button onClick={() => setIsModalAberto(true)} className="btn-primary">
                    + Cadastrar Nova Aeronave
                </button>
            </div>

            <table className="data-table">
                {/* ... (código da tabela continua o mesmo) ... */}
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Modelo</th>
                        <th>Status da Produção</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {aeronaves.length === 0 ? (
                        <tr>
                            <td colSpan={5}>Nenhuma aeronave cadastrada.</td>
                        </tr>
                    ) : (
                        aeronaves.map(aeronave => (
                            <tr key={aeronave.codigo}>
                                <td>{aeronave.codigo}</td>
                                <td>{aeronave.modelo}</td>
                                <td>{getStatusProducao(aeronave)}</td>
                                <td>{aeronave.tipo}</td>
                                <td>
                                    <button 
                                        onClick={() => handleGerenciar(aeronave)} 
                                        className="btn-secondary"
                                    >
                                        Gerenciar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <Modal isOpen={isModalAberto} onClose={() => setIsModalAberto(false)}>
                <AddAeronaveForm onClose={() => setIsModalAberto(false)} />
            </Modal>
        </div>
    );
}