import { useState, useEffect } from 'react';
import './Step1.css';

interface Step1Props {
  data: any;
  onChange: (data: any) => void;
}

export default function Step1({ data, onChange }: Step1Props) {
  const [formData, setFormData] = useState({
    title: data?.title || '',
    synopsis: data?.synopsis || '',
    genre: data?.genre || '',
    duration: data?.duration || '',
    characters: data?.characters || '',
    setting: data?.setting || '',
    tone: data?.tone || ''
  });

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="step1-container">
      <h2 className="step-heading">Detalhes da História</h2>
      <p className="step-description">Preencha os detalhes da sua história para criar o storyboard</p>

      <div className="form-container">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Digite o título da história"
            />
          </div>

          <div className="form-field">
            <label htmlFor="genre">Gênero *</label>
            <input
              id="genre"
              type="text"
              value={formData.genre}
              onChange={(e) => handleChange('genre', e.target.value)}
              placeholder="Ex: Ficção científica, Drama, Comédia"
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="synopsis">Sinopse *</label>
          <textarea
            id="synopsis"
            value={formData.synopsis}
            onChange={(e) => handleChange('synopsis', e.target.value)}
            placeholder="Descreva a sinopse da história"
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="duration">Duração</label>
            <input
              id="duration"
              type="text"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              placeholder="Ex: 10 minutos, 1 hora"
            />
          </div>

          <div className="form-field">
            <label htmlFor="tone">Tom</label>
            <input
              id="tone"
              type="text"
              value={formData.tone}
              onChange={(e) => handleChange('tone', e.target.value)}
              placeholder="Ex: Sério, Leve, Tenso"
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="characters">Personagens Principais</label>
          <textarea
            id="characters"
            value={formData.characters}
            onChange={(e) => handleChange('characters', e.target.value)}
            placeholder="Liste os personagens principais e suas descrições"
            rows={3}
          />
        </div>

        <div className="form-field">
          <label htmlFor="setting">Ambientação</label>
          <textarea
            id="setting"
            value={formData.setting}
            onChange={(e) => handleChange('setting', e.target.value)}
            placeholder="Descreva onde a história se passa"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
