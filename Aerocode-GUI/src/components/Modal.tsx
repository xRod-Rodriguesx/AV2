// src/components/Modal.tsx
import React from 'react';
import './Modal.css'; // Vamos criar este CSS

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: Props) {
    if (!isOpen) {
        return null; // Se não estiver aberto, não renderiza nada
    }

    return (
        // O "backdrop" é o fundo cinza
        <div className="modal-backdrop" onClick={onClose}>
            {/* O "content" é a caixa branca no meio */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close-btn">&times;</button>
                {children}
            </div>
        </div>
    );
}