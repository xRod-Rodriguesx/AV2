import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDatabase } from "../contexts/DatabaseContext";
import { Modal } from "../components/Modal";
import { PecasManagerModal } from "../components/PecasManagerModal";
import { EtapasManagerModal } from "../components/EtapasManagerModal"; 
import { RegistrarTesteForm } from "../components/forms/RegistrarTesteForm";
import { Relatorio } from "../logic/models";
import './AeronaveDetailPage.css';

export function AeronaveDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { aeronaves } = useDatabase();

    const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false);
    const [isPecasModalOpen, setIsPecasModalOpen] = useState(false); 
    const [isEtapasModalOpen, setIsEtapasModalOpen] = useState(false); 
    const [isTestesModalOpen, setIsTestesModalOpen] = useState(false); 

    const aeronave = aeronaves.find(a => a.codigo === id);

    if (!aeronave) {
        return (
            <div className="page-container">
                <h2>Aeronave não encontrada</h2>
                <button onClick={() => navigate("/aeronaves")} className="btn-secondary">
                    Voltar para a Lista
                </button>
            </div>
        );
    }

    const handleGerarRelatorio = () => {
        const relatorio = new Relatorio();
        
        const conteudo = relatorio.gerarRelatorio(aeronave);
        
        relatorio.salvarEmArquivoWeb(conteudo, aeronave.codigo);

        console.log(conteudo);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Gerenciando Aeronave: {aeronave.modelo} ({aeronave.codigo})</h2>
                <button onClick={() => navigate("/aeronaves")} className="btn-secondary">
                    &larr; Voltar para a Lista
                </button>
            </div>

            <div className="hub-actions">
                <button className="hub-button" onClick={() => setIsDetalhesModalOpen(true)}>
                    Ver Detalhes Completos
                </button>
                <button className="hub-button" onClick={() => setIsPecasModalOpen(true)}>
                    Gerenciar Peças
                </button>
                <button className="hub-button" onClick={() => setIsEtapasModalOpen(true)}>
                    Gerenciar Etapas
                </button>
                <button className="hub-button" onClick={() => setIsTestesModalOpen(true)}>
                    Registrar Testes
                </button>
                {}
                <button className="hub-button btn-danger" onClick={handleGerarRelatorio}>
                    Gerar Relatório Final
                </button>
            </div>

            {/* Modal de Detalhes */}
            <Modal isOpen={isDetalhesModalOpen} onClose={() => setIsDetalhesModalOpen(false)}>
                <div className="detalhes-modal-content">
                    <h2>Detalhes Completos: {aeronave.modelo}</h2>
                    <section>
                        <h3>Peças</h3>
                        {aeronave.pecas.length === 0 ? <p>Nenhuma peça cadastrada.</p> : <ul>{aeronave.pecas.map((peca, index) => (<li key={index}>{peca.nome} (Fornecedor: {peca.fornecedor}) - <strong>Status: {peca.status}</strong></li>))}</ul>}
                    </section>
                    <section>
                        <h3>Etapas de Produção</h3>
                        {aeronave.etapas.length === 0 ? <p>Nenhuma etapa cadastrada.</p> : <ol>{aeronave.etapas.map((etapa, index) => (<li key={index}>{etapa.nome} (Prazo: {etapa.prazo}) - <strong>Status: {etapa.status}</strong></li>))}</ol>}
                    </section>
                    <section>
                        <h3>Testes Registrados</h3>
                        {aeronave.testes.length === 0 ? <p>Nenhum teste registrado.</p> : <ul>{aeronave.testes.map((teste, index) => (<li key={index}>Teste de {teste.tipo} - <strong>Resultado: {teste.resultado}</strong></li>))}</ul>}
                    </section>
                </div>
            </Modal>

            {/* Modal de Gerenciamento de Peças */}
            <Modal isOpen={isPecasModalOpen} onClose={() => setIsPecasModalOpen(false)}>
                <PecasManagerModal aeronave={aeronave} />
            </Modal>

            {/* Modal de Gerenciamento de Etapas */}
            <Modal isOpen={isEtapasModalOpen} onClose={() => setIsEtapasModalOpen(false)}>
                <EtapasManagerModal aeronave={aeronave} />
            </Modal>

            {/* Modal de Registro de Testes */}
            <Modal isOpen={isTestesModalOpen} onClose={() => setIsTestesModalOpen(false)}>
                <RegistrarTesteForm 
                    aeronave={aeronave} 
                    onClose={() => setIsTestesModalOpen(false)} 
                />
            </Modal>
        </div>
    );
}