import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Aeronave, Peca, StatusPeca } from '../../logic/models';
import './FormStyles.css';

interface Props {
    aeronave: Aeronave;
    peca: Peca;
    onClose: () => void;
}

export function UpdatePecaStatusForm({ aeronave, peca, onClose }: Props) {
    const { updateAeronave } = useDatabase();
    
    
    const [novoStatus, setNovoStatus] = useState(peca.status);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
      
        peca.atualizarStatus(novoStatus);
        
       
        updateAeronave(aeronave); 
        
        onClose(); 
    };

    return (
        <form onSubmit={handleSubmit} className="form-container" style={{ width: '350px' }}> {/* Um pouco mais estreito */}
            <h2>Atualizar Status: {peca.nome}</h2>
            
            <div className="form-group">
                <label htmlFor="status">Novo Status</label>
                <select 
                    id="status" 
                    value={novoStatus} 
                    onChange={e => setNovoStatus(e.target.value as StatusPeca)}
                >
                    {/* Mapeia o Enum 'StatusPeca' para criar as opções */}
                    {Object.values(StatusPeca).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Status</button>
            </div>
        </form>
    );
}