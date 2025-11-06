import { useState } from 'react';
import { supabase, type Project } from './lib/supabase';
import ProjectList from './components/ProjectList';
import NewProjectModal from './components/NewProjectModal';
import StepWizard from './components/StepWizard';

function App() {
  const [view, setView] = useState<'list' | 'wizard'>('list');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewProject = () => {
    setIsModalOpen(true);
  };

  const handleCreateProject = async (data: {
    name: string;
    description: string;
    apiKey: string;
    cookies: string;
  }) => {
    try {
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          name: data.name,
          description: data.description,
          api_key: data.apiKey,
          cookies: data.cookies,
          step1_data: {},
          step2_data: {},
          step3_data: {}
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentProject(newProject);
      setIsModalOpen(false);
      setView('wizard');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Erro ao criar projeto');
    }
  };

  const handleOpenProject = (project: Project) => {
    setCurrentProject(project);
    setView('wizard');
  };

  const handleBackToList = () => {
    setCurrentProject(null);
    setView('list');
  };

  return (
    <>
      {view === 'list' ? (
        <ProjectList
          onNewProject={handleNewProject}
          onOpenProject={handleOpenProject}
        />
      ) : currentProject ? (
        <StepWizard
          project={currentProject}
          onBack={handleBackToList}
        />
      ) : null}

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </>
  );
}

export default App;
