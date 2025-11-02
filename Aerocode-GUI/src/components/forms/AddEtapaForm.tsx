// src/components/forms/AddEtapaForm.tsx
import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Aeronave, Etapa } from '../../logic/models';
import './FormStyles.css'; // Reutilizando nosso CSS

interface Props {
    aeronave: Aeronave;
    onClose: () => void;
}

export function AddEtapaForm({ aeronave, onClose }: Props) {
    const { updateAeronave } = useDatabase();

    const [nome, setNome] = useState('');
    const [prazo, setPrazo] = useState('');
    const [erro, setErro] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !prazo) {
            setErro('Nome e Prazo são obrigatórios.');
            return;
        }

        const novaEtapa = new Etapa(nome, prazo); // O status 'Pendente' é automático
        aeronave.adicionarEtapa(novaEtapa); // Adiciona na ordem
        updateAeronave(aeronave); // Avisa o React que a aeronave mudou
        
        console.log("Etapa Adicionada!", novaEtapa);
        onClose(); // Fecha o modal
    };

    return (
        <form onSubmit={handleSubmit} className="form-container" style={{ width: '350px' }}>
            <h2>Adicionar Nova Etapa</h2>
            
            <div className="form-group">
                <label htmlFor="nome">Nome da Etapa</label>
                <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            
            <div className="form-group">
                <label htmlFor="prazo">Prazo Estimado (ex: 5 dias)</label>
                <input type="text" id="prazo" value={prazo} onChange={e => setPrazo(e.target.value)} />
            </div>

            {erro && <p className="error-message">{erro}</p>}

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Etapa</button>
            </div>
        </form>
    );
}