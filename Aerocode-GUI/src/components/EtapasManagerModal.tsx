// src/components/EtapasManagerModal.tsx
import { useState } from 'react';
import { Aeronave, Funcionario, Etapa } from '../logic/models';
import { Modal } from './Modal';
import { AddEtapaForm } from './forms/AddEtapaForm';
// 1. Importar o novo formulário
import { AssociarFuncionarioForm } from './forms/AssociarFuncionarioForm'; 
import { useDatabase } from '../contexts/DatabaseContext';
import './ManagerModal.css';

interface Props {
    aeronave: Aeronave;
}

export function EtapasManagerModal({ aeronave }: Props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // 2. Novo estado para controlar qual etapa estamos associando
    const [etapaParaAssociar, setEtapaParaAssociar] = useState<Etapa | null>(null);
    const { updateAeronave } = useDatabase(); 

    const handleIniciarProxima = () => {
        const mensagem = aeronave.iniciarProximaEtapa();
        alert(mensagem); 
        updateAeronave(aeronave);
    }
    
    const handleFinalizarAtual = () => {
        const mensagem = aeronave.finalizarEtapaAtual();
        alert(mensagem);
        updateAeronave(aeronave);
    }

    const handleAssociarFuncionario = (etapa: Etapa) => {
        // 3. Em vez de um alert, agora "setamos" a etapa para associação
        setEtapaParaAssociar(etapa);
    }

    return (
        <div className="manager-modal-container">
            <h2>Gerenciar Etapas: {aeronave.codigo}</h2>
            
            <div className="manager-actions">
                <button onClick={() => setIsAddModalOpen(true)} className="btn-primary" style={{ marginRight: '10px' }}>
                    + Adicionar Etapa
                </button>
                <button onClick={handleIniciarProxima} className="btn-secondary" style={{ marginRight: '10px' }}>
                    Iniciar Próxima Etapa
                </button>
                <button onClick={handleFinalizarAtual} className="btn-secondary">
                    Finalizar Etapa Atual
                </button>
            </div>

            <div className="manager-list">
                {aeronave.etapas.length === 0 ? (
                    <p>Nenhuma etapa cadastrada para esta aeronave.</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Ordem</th>
                                <th>Nome</th>
                                <th>Status</th>
                                <th>Funcionários</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aeronave.etapas.map((etapa, index) => {
                                const nomesFuncionarios = etapa.funcionarios.map((f: Funcionario) => f.nome).join(', ');
                                
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{etapa.nome}</td>
                                        <td>{etapa.status}</td>
                                        {/* A lista de funcionários agora será preenchida */}
                                        <td>{nomesFuncionarios || 'Nenhum'}</td>
                                        <td>
                                            <button onClick={() => handleAssociarFuncionario(etapa)} className="btn-secondary">
                                                Associar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal para Adicionar Etapa */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <AddEtapaForm 
                    aeronave={aeronave} 
                    onClose={() => setIsAddModalOpen(false)} 
                />
            </Modal>

            {/* 4. NOVO: Modal para Associar Funcionário */}
            <Modal isOpen={!!etapaParaAssociar} onClose={() => setEtapaParaAssociar(null)}>
                {etapaParaAssociar && ( 
                    <AssociarFuncionarioForm
                        aeronave={aeronave}
                        etapa={etapaParaAssociar}
                        onClose={() => setEtapaParaAssociar(null)}
                    />
                )}
            </Modal>
        </div>
    );
}