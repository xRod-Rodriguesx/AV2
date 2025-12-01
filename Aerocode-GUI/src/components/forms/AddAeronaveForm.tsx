import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Aeronave, TipoAeronave } from '../../logic/models';
import './FormStyles.css';

interface Props {
    onClose: () => void;
}

export function AddAeronaveForm({ onClose }: Props) {
    const { aeronaves, addAeronave } = useDatabase();

    const [codigo, setCodigo] = useState('');
    const [modelo, setModelo] = useState('');
    const [tipo, setTipo] = useState(TipoAeronave.COMERCIAL); 
    const [capacidade, setCapacidade] = useState(0);
    const [alcance, setAlcance] = useState(0);
    const [erro, setErro] = useState('');

    // Agora a função é ASYNC
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (aeronaves.find(a => a.codigo === codigo)) {
            setErro('Erro: Já existe uma aeronave com este código.');
            return;
        }

        if (!codigo || !modelo) {
            setErro('Código e Modelo são obrigatórios.');
            return;
        }

        const novaAeronave = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
        
        // Espera o banco salvar antes de fechar
        const sucesso = await addAeronave(novaAeronave);
        
        if (sucesso) {
            console.log("Aeronave Salva no MySQL!", novaAeronave);
            onClose();
        } else {
            setErro("Erro ao salvar no banco de dados.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>Cadastrar Nova Aeronave</h2>
            
            <div className="form-group">
                <label htmlFor="codigo">Código Único</label>
                <input type="text" id="codigo" value={codigo} onChange={e => setCodigo(e.target.value)} />
            </div>
            
            <div className="form-group">
                <label htmlFor="modelo">Modelo</label>
                <input type="text" id="modelo" value={modelo} onChange={e => setModelo(e.target.value)} />
            </div>

            <div className="form-group">
                <label htmlFor="tipo">Tipo de Aeronave</label>
                <select id="tipo" value={tipo} onChange={e => setTipo(e.target.value as TipoAeronave)}>
                    <option value={TipoAeronave.COMERCIAL}>Comercial</option>
                    <option value={TipoAeronave.MILITAR}>Militar</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="capacidade">Capacidade (Passageiros)</label>
                <input type="number" id="capacidade" value={capacidade} onChange={e => setCapacidade(Number(e.target.value))} />
            </div>
            
            <div className="form-group">
                <label htmlFor="alcance">Alcance (km)</label>
                <input type="number" id="alcance" value={alcance} onChange={e => setAlcance(Number(e.target.value))} />
            </div>

            {erro && <p className="error-message">{erro}</p>}

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar</button>
            </div>
        </form>
    );
}