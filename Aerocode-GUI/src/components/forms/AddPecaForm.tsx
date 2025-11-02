// src/components/forms/AddPecaForm.tsx
import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Aeronave, Peca, TipoPeca } from '../../logic/models';
import './FormStyles.css'; // Reutilizando o CSS que já temos

interface Props {
    aeronave: Aeronave;
    onClose: () => void;
}

export function AddPecaForm({ aeronave, onClose }: Props) {
    const { updateAeronave } = useDatabase(); // Pegamos nossa nova função!

    const [nome, setNome] = useState('');
    const [fornecedor, setFornecedor] = useState('');
    const [tipo, setTipo] = useState(TipoPeca.NACIONAL);
    const [erro, setErro] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !fornecedor) {
            setErro('Nome e Fornecedor são obrigatórios.');
            return;
        }

        const novaPeca = new Peca(nome, tipo, fornecedor);
        aeronave.adicionarPeca(novaPeca); // 1. Adiciona a peça ao objeto aeronave

        updateAeronave(aeronave); // 2. "Avisa" o React que a aeronave mudou
        
        console.log("Peça Adicionada!", novaPeca);
        onClose(); // 3. Fecha o modal
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>Adicionar Nova Peça</h2>
            
            <div className="form-group">
                <label htmlFor="nome">Nome da Peça</label>
                <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            
            <div className="form-group">
                <label htmlFor="fornecedor">Fornecedor</label>
                <input type="text" id="fornecedor" value={fornecedor} onChange={e => setFornecedor(e.target.value)} />
            </div>

            <div className="form-group">
                <label htmlFor="tipo">Tipo da Peça</label>
                <select id="tipo" value={tipo} onChange={e => setTipo(e.target.value as TipoPeca)}>
                    <option value={TipoPeca.NACIONAL}>Nacional</option>
                    <option value={TipoPeca.IMPORTADA}>Importada</option>
                </select>
            </div>

            {erro && <p className="error-message">{erro}</p>}

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Peça</button>
            </div>
        </form>
    );
}