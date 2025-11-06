import { useState, useEffect } from 'react';
import { Plus, FolderOpen, Clock } from 'lucide-react';
import { supabase, type Project } from '../lib/supabase';
import './ProjectList.css';

interface ProjectListProps {
  onNewProject: () => void;
  onOpenProject: (project: Project) => void;
}

export default function ProjectList({ onNewProject, onOpenProject }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="project-list-container">
      <header className="project-list-header">
        <div className="header-content">
          <h1 className="app-title">Storyboard AI</h1>
          <p className="app-subtitle">Crie storyboards com inteligência artificial</p>
        </div>
        <button onClick={onNewProject} className="btn-new-project">
          <Plus size={20} />
          Novo Projeto
        </button>
      </header>

      <div className="projects-grid">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Carregando projetos...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={64} />
            <h2>Nenhum projeto ainda</h2>
            <p>Comece criando seu primeiro storyboard</p>
            <button onClick={onNewProject} className="btn-empty-state">
              <Plus size={20} />
              Criar Primeiro Projeto
            </button>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => onOpenProject(project)}
            >
              <div className="project-card-header">
                <h3 className="project-name">{project.name}</h3>
              </div>
              {project.description && (
                <p className="project-description">{project.description}</p>
              )}
              <div className="project-card-footer">
                <div className="project-meta">
                  <Clock size={14} />
                  <span>{formatDate(project.updated_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
