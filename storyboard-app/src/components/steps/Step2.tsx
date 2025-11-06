import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Step2.css';

interface Scene {
  id?: string;
  scene_number: number;
  title: string;
  description: string;
}

interface Step2Props {
  data: any;
  onChange: (data: any) => void;
  projectId: string;
}

export default function Step2({ data, onChange, projectId }: Step2Props) {
  const [scenes, setScenes] = useState<Scene[]>(data?.scenes || [
    { scene_number: 1, title: '', description: '' }
  ]);

  useEffect(() => {
    loadScenes();
  }, [projectId]);

  useEffect(() => {
    onChange({ scenes });
  }, [scenes]);

  const loadScenes = async () => {
    try {
      const { data: savedScenes, error } = await supabase
        .from('scenes')
        .select('*')
        .eq('project_id', projectId)
        .order('scene_number');

      if (error) throw error;
      if (savedScenes && savedScenes.length > 0) {
        setScenes(savedScenes);
      }
    } catch (error) {
      console.error('Error loading scenes:', error);
    }
  };

  const addScene = () => {
    setScenes([...scenes, {
      scene_number: scenes.length + 1,
      title: '',
      description: ''
    }]);
  };

  const removeScene = async (index: number) => {
    const scene = scenes[index];
    if (scene.id) {
      try {
        const { error } = await supabase
          .from('scenes')
          .delete()
          .eq('id', scene.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting scene:', error);
      }
    }

    const newScenes = scenes.filter((_, i) => i !== index);
    newScenes.forEach((scene, i) => {
      scene.scene_number = i + 1;
    });
    setScenes(newScenes);
  };

  const updateScene = (index: number, field: keyof Scene, value: string) => {
    const newScenes = [...scenes];
    newScenes[index] = { ...newScenes[index], [field]: value };
    setScenes(newScenes);
  };

  const saveScenes = async () => {
    try {
      for (const scene of scenes) {
        if (scene.id) {
          await supabase
            .from('scenes')
            .update({
              title: scene.title,
              description: scene.description,
              scene_number: scene.scene_number
            })
            .eq('id', scene.id);
        } else {
          const { data: newScene } = await supabase
            .from('scenes')
            .insert({
              project_id: projectId,
              title: scene.title,
              description: scene.description,
              scene_number: scene.scene_number,
              status: 'pending'
            })
            .select()
            .single();

          if (newScene) {
            scene.id = newScene.id;
          }
        }
      }
    } catch (error) {
      console.error('Error saving scenes:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scenes.some(s => s.title || s.description)) {
        saveScenes();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [scenes]);

  return (
    <div className="step2-container">
      <div className="step2-header">
        <div>
          <h2 className="step-heading">Lista de Cenas</h2>
          <p className="step-description">Adicione e organize as cenas do seu storyboard</p>
        </div>
        <button onClick={addScene} className="btn-add-scene">
          <Plus size={18} />
          Adicionar Cena
        </button>
      </div>

      <div className="scenes-list">
        {scenes.map((scene, index) => (
          <div key={index} className="scene-card">
            <div className="scene-header">
              <div className="scene-number-badge">
                <GripVertical size={16} />
                Cena {scene.scene_number}
              </div>
              {scenes.length > 1 && (
                <button
                  onClick={() => removeScene(index)}
                  className="btn-remove"
                  title="Remover cena"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="scene-fields">
              <div className="form-field">
                <label htmlFor={`scene-title-${index}`}>Título da Cena</label>
                <input
                  id={`scene-title-${index}`}
                  type="text"
                  value={scene.title}
                  onChange={(e) => updateScene(index, 'title', e.target.value)}
                  placeholder="Ex: Abertura na floresta"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`scene-desc-${index}`}>Descrição</label>
                <textarea
                  id={`scene-desc-${index}`}
                  value={scene.description}
                  onChange={(e) => updateScene(index, 'description', e.target.value)}
                  placeholder="Descreva o que acontece nesta cena..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
