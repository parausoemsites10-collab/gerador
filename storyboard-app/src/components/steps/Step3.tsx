import { useState, useEffect } from 'react';
import { RefreshCw, Image as ImageIcon } from 'lucide-react';
import { supabase, type Scene } from '../../lib/supabase';
import './Step3.css';

interface Step3Props {
  projectId: string;
  apiKey?: string;
  cookies?: string;
  onRegenerateScene?: (sceneId: string) => void;
}

export default function Step3({ projectId }: Step3Props) {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingScenes, setGeneratingScenes] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadScenes();
  }, [projectId]);

  const loadScenes = async () => {
    try {
      const { data, error } = await supabase
        .from('scenes')
        .select('*')
        .eq('project_id', projectId)
        .order('scene_number');

      if (error) throw error;
      setScenes(data || []);
    } catch (error) {
      console.error('Error loading scenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async (scene: Scene) => {
    setGeneratingScenes(prev => new Set(prev).add(scene.id));

    try {
      await supabase
        .from('scenes')
        .update({
          status: 'generating',
          images: []
        })
        .eq('id', scene.id);

      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockImages = [
        { url: `https://placehold.co/800x600/1a1a1a/666666?text=Scene+${scene.scene_number}`, id: Date.now() }
      ];

      const { error } = await supabase
        .from('scenes')
        .update({
          status: 'completed',
          images: mockImages
        })
        .eq('id', scene.id);

      if (error) throw error;
      await loadScenes();
    } catch (error) {
      console.error('Error generating image:', error);
      await supabase
        .from('scenes')
        .update({ status: 'error' })
        .eq('id', scene.id);
    } finally {
      setGeneratingScenes(prev => {
        const newSet = new Set(prev);
        newSet.delete(scene.id);
        return newSet;
      });
    }
  };

  const handleRegenerate = async (scene: Scene) => {
    await generateImage(scene);
  };

  const generateAllImages = async () => {
    for (const scene of scenes) {
      if (scene.status !== 'completed') {
        await generateImage(scene);
      }
    }
  };

  if (loading) {
    return (
      <div className="step3-loading">
        <div className="spinner" />
        <p>Carregando cenas...</p>
      </div>
    );
  }

  return (
    <div className="step3-container">
      <div className="step3-header">
        <div>
          <h2 className="step-heading">Gerar Imagens</h2>
          <p className="step-description">Gere imagens para cada cena do storyboard</p>
        </div>
        <button onClick={generateAllImages} className="btn-generate-all">
          <ImageIcon size={18} />
          Gerar Todas
        </button>
      </div>

      <div className="scenes-grid">
        {scenes.map((scene) => (
          <div key={scene.id} className="scene-generation-card">
            <div className="scene-info">
              <div className="scene-badge">Cena {scene.scene_number}</div>
              <h3 className="scene-title">{scene.title}</h3>
              <p className="scene-description">{scene.description}</p>
            </div>

            <div className="scene-image-container">
              {generatingScenes.has(scene.id) ? (
                <div className="generating-state">
                  <div className="spinner" />
                  <p>Gerando imagem...</p>
                </div>
              ) : scene.images && scene.images.length > 0 ? (
                <div className="image-wrapper">
                  <img
                    src={scene.images[0].url}
                    alt={scene.title}
                    className="scene-image"
                  />
                  <button
                    onClick={() => handleRegenerate(scene)}
                    className="btn-regenerate"
                    title="Refazer cena"
                  >
                    <RefreshCw size={16} />
                    Refazer
                  </button>
                </div>
              ) : (
                <div className="empty-image-state">
                  <ImageIcon size={48} />
                  <button
                    onClick={() => generateImage(scene)}
                    className="btn-generate"
                  >
                    Gerar Imagem
                  </button>
                </div>
              )}
            </div>

            {scene.status === 'error' && (
              <div className="error-message">
                Erro ao gerar imagem. Tente novamente.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
