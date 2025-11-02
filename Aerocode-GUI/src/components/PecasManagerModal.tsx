// src/components/PecasManagerModal.tsx
import { useState } from 'react';
import { Aeronave, Peca } from '../logic/models'; // 1. Importar Peca
import { Modal } from './Modal';
import { AddPecaForm } from './forms/AddPecaForm';
import { UpdatePecaStatusForm } from './forms/UpdatePecaStatusForm'; // 2. Importar o novo formulário
import './ManagerModal.css';

interface Props {
    aeronave: Aeronave;
}

export function PecasManagerModal({ aeronave }: Props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // 3. Novo estado para controlar qual peça estamos editando
    const [pecaParaEditar, setPecaParaEditar] = useState<Peca | null>(null);

    const handleUpdateStatus = (peca: Peca) => {
        // 4. Em vez de um alert, agora "setamos" a peça para edição
        setPecaParaEditar(peca);
    }

    return (
        <div className="manager-modal-container">
            <h2>Gerenciar Peças: {aeronave.codigo}</h2>
            
            <div className="manager-actions">
                <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
                    + Adicionar Peça
                </button>
            </div>

            <div className="manager-list">
                {aeronave.pecas.length === 0 ? (
                    <p>Nenhuma peça cadastrada para esta aeronave.</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Fornecedor</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aeronave.pecas.map((peca, index) => (
                                <tr key={index}>
                                    <td>{peca.nome}</td>
                                    <td>{peca.fornecedor}</td>
                                    <td>{peca.tipo}</td>
                                    <td>{peca.status}</td>
                                    <td>
                                        {/* 5. O OnClick agora chama a função correta */}
                                        <button onClick={() => handleUpdateStatus(peca)} className="btn-secondary">
                                            Atualizar Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal para Adicionar Peça (já existia) */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <AddPecaForm 
                    aeronave={aeronave} 
                    onClose={() => setIsAddModalOpen(false)} 
                />
            </Modal>

            {/* 6. NOVO: Modal para Atualizar Status */}
            <Modal isOpen={!!pecaParaEditar} onClose={() => setPecaParaEditar(null)}>
                {pecaParaEditar && ( 
                    <UpdatePecaStatusForm
                        aeronave={aeronave}
                        peca={pecaParaEditar}
                        onClose={() => setPecaParaEditar(null)}
                    />
                )}
            </Modal>
        </div>
    );
}