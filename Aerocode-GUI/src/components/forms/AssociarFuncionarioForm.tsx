// src/components/forms/AssociarFuncionarioForm.tsx
import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Aeronave, Etapa, Funcionario } from '../../logic/models';
import './FormStyles.css'; // Reutilizando nosso CSS de formulário

interface Props {
    aeronave: Aeronave;
    etapa: Etapa;
    onClose: () => void;
}

export function AssociarFuncionarioForm({ aeronave, etapa, onClose }: Props) {
    // Pegamos a lista de TODOS os funcionários do "banco"
    const { funcionarios, updateAeronave } = useDatabase(); 
    
    // Estado para guardar o ID do funcionário que o usuário selecionar
    const [selectedFuncionarioId, setSelectedFuncionarioId] = useState('');
    const [erro, setErro] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Encontra o objeto 'Funcionario' completo com base no ID selecionado
        const funcionarioSelecionado = funcionarios.find(f => f.id === selectedFuncionarioId);

        if (funcionarioSelecionado) {
            // 1. Chama a lógica da classe (modelo)
            etapa.associarFuncionario(funcionarioSelecionado);
            
            // 2. Avisa o React que a aeronave (e suas etapas) mudou
            updateAeronave(aeronave); 
            
            onClose(); // 3. Fecha o modal
        } else {
            setErro("Por favor, selecione um funcionário.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container" style={{ width: '350px' }}>
            <h2>Associar Funcionário à Etapa</h2>
            <p style={{ textAlign: 'center', marginTop: '-10px', marginBottom: '20px' }}>
                <strong>Etapa:</strong> {etapa.nome}
            </p>
            
            <div className="form-group">
                <label htmlFor="funcionario">Funcionário</label>
                <select 
                    id="funcionario" 
                    value={selectedFuncionarioId} 
                    onChange={e => setSelectedFuncionarioId(e.target.value)}
                >
                    <option value="">-- Selecione um funcionário --</option>
                    {/* Mapeia a lista de funcionários do banco para criar as opções */}
                    {funcionarios.map(f => (
                        <option key={f.id} value={f.id}>
                            {f.nome} ({f.nivelPermissao})
                        </option>
                    ))}
                </select>
            </div>

            {erro && <p className="error-message">{erro}</p>}

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Associar</button>
            </div>
        </form>
    );
}