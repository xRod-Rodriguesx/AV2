import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Aeronave, Teste, TipoTeste, ResultadoTeste } from '../../logic/models';
import './FormStyles.css'; 

interface Props {
    aeronave: Aeronave;
    onClose: () => void;
}

export function RegistrarTesteForm({ aeronave, onClose }: Props) {
    const { updateAeronave } = useDatabase();

    const [tipo, setTipo] = useState(TipoTeste.ELETRICO);
    const [resultado, setResultado] = useState(ResultadoTeste.APROVADO);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const novoTeste = new Teste(tipo, resultado);
        aeronave.adicionarTeste(novoTeste); 
        updateAeronave(aeronave); 
        
        console.log("Teste Registrado!", novoTeste);
        onClose(); 
    };

    return (
        <form onSubmit={handleSubmit} className="form-container" style={{ width: '350px' }}>
            <h2>Registrar Novo Teste</h2>
            
            <div className="form-group">
                <label htmlFor="tipo">Tipo de Teste</label>
                <select id="tipo" value={tipo} onChange={e => setTipo(e.target.value as TipoTeste)}>
                    {/* Mapeia o Enum 'TipoTeste' para as opções */}
                    {Object.values(TipoTeste).map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>
            
            <div className="form-group">
                <label htmlFor="resultado">Resultado do Teste</label>
                <select id="resultado" value={resultado} onChange={e => setResultado(e.target.value as ResultadoTeste)}>
                    {}
                    {Object.values(ResultadoTeste).map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Teste</button>
            </div>
        </form>
    );
}