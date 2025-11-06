import { useState } from 'react';
import { X } from 'lucide-react';
import './NewProjectModal.css';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; apiKey: string; cookies: string }) => void;
}

export default function NewProjectModal({ isOpen, onClose, onSubmit }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [cookies, setCookies] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !apiKey.trim()) return;

    onSubmit({ name, description, apiKey, cookies });
    setName('');
    setDescription('');
    setApiKey('');
    setCookies('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Novo Projeto</h2>
          <button onClick={onClose} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="project-name">Nome do Projeto *</label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Meu Storyboard"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-description">Descrição</label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva seu projeto (opcional)"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="api-key">API Key *</label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Cole sua chave API aqui"
              required
            />
            <p className="form-hint">Necessária para gerar imagens com IA</p>
          </div>

          <div className="form-group">
            <label htmlFor="cookies">Cookies</label>
            <textarea
              id="cookies"
              value={cookies}
              onChange={(e) => setCookies(e.target.value)}
              placeholder="Cole os cookies de autenticação (opcional)"
              rows={3}
            />
            <p className="form-hint">Usado para autenticação adicional, se necessário</p>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={!name.trim() || !apiKey.trim()}>
              Criar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
