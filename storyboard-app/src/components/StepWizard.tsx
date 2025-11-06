import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { supabase, type Project } from '../lib/supabase';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import './StepWizard.css';

interface StepWizardProps {
  project: Project;
  onBack: () => void;
}

export default function StepWizard({ project, onBack }: StepWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState(project);

  const steps = [
    { number: 1, title: 'Detalhes da História' },
    { number: 2, title: 'Lista de Cenas' },
    { number: 3, title: 'Gerar Imagens' }
  ];

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep || stepNumber === currentStep + 1) {
      setCurrentStep(stepNumber);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalize = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          step1_data: projectData.step1_data,
          step2_data: projectData.step2_data,
          step3_data: projectData.step3_data,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;
      onBack();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Erro ao salvar projeto');
    }
  };

  const updateProjectData = (step: string, data: any) => {
    setProjectData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  return (
    <div className="step-wizard">
      <header className="wizard-header">
        <div className="header-top">
          <button onClick={onBack} className="btn-back">
            <ArrowLeft size={20} />
            Voltar
          </button>
          <h1 className="project-title">{project.name}</h1>
        </div>

        <div className="steps-navigation">
          {steps.map((step) => (
            <button
              key={step.number}
              className={`step-button ${currentStep === step.number ? 'active' : ''} ${
                currentStep > step.number ? 'completed' : ''
              }`}
              onClick={() => handleStepClick(step.number)}
              disabled={step.number > currentStep + 1}
            >
              <div className="step-number">
                {currentStep > step.number ? <Check size={16} /> : step.number}
              </div>
              <span className="step-title">{step.title}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="wizard-content">
        {currentStep === 1 && (
          <Step1
            data={projectData.step1_data}
            onChange={(data) => updateProjectData('step1_data', data)}
          />
        )}
        {currentStep === 2 && (
          <Step2
            data={projectData.step2_data}
            onChange={(data) => updateProjectData('step2_data', data)}
            projectId={project.id}
          />
        )}
        {currentStep === 3 && (
          <Step3
            projectId={project.id}
            apiKey={project.api_key || ''}
            cookies={project.cookies || ''}
            onRegenerateScene={async (sceneId: string) => {
              console.log('Regenerating scene:', sceneId);
            }}
          />
        )}
      </div>

      <footer className="wizard-footer">
        <div className="footer-buttons">
          {currentStep > 1 && (
            <button onClick={handlePrevious} className="btn-navigation">
              <ArrowLeft size={18} />
              Anterior
            </button>
          )}
          {currentStep < 3 ? (
            <button onClick={handleNext} className="btn-navigation btn-primary">
              Próximo
              <ArrowRight size={18} />
            </button>
          ) : (
            <button onClick={handleFinalize} className="btn-navigation btn-primary">
              <Check size={18} />
              Finalizar
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
