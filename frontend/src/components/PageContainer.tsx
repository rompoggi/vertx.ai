import React, { useState, useRef, useEffect } from 'react';
import LatexRenderer from './LatexRenderer.tsx';
import axios from 'axios';

const pageContainerStyles = `
  .page-container {
    display: flex;
    width: 80vw;
    height: 80vh;
    margin: 40px auto;
    border-radius: 2rem;
    background: rgba(0, 0, 0, 0.65);
    box-shadow: 0px 0px 8px 8px rgba(184, 129, 1, 0.10),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
    overflow: hidden;
  }

  .text-area {
    flex: 8;
    border-right: 1px solid #ffd246;
    height: 100%;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
  }

  .text-area::-webkit-scrollbar {
    width: 8px;
  }

  .text-area::-webkit-scrollbar-track {
    background: rgba(255, 210, 70, 0.1);
    border-radius: 4px;
  }

  .text-area::-webkit-scrollbar-thumb {
    background: #ffd246;
    border-radius: 4px;
  }

  .text-area::-webkit-scrollbar-thumb:hover {
    background: #e27100;
  }

  .media-area {
    flex: 2;
    height: 100%;
    padding: 32px;
    background: transparent;
    display: flex;
    flex-direction: column;
    gap: 18px;
    align-items: center;
    justify-content: flex-start;
  }

  .title {
    margin: 0;
    color: #e27100;
    font-size: 52px;
    font-weight: 700;
    text-align: center;
  }

  .divider {
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #e27100 0%, #ffd246 100%);
    border-radius: 2px;
    margin: 1px 0px 18px 0px;
    opacity: 0.8;
  }

  .text-block-container {
    position: relative;
  }

  .delete-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent;
    border: none;
    color: #e27100;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1;
    font-weight: 700;
    line-height: 1;
  }

  .text-input {
    background: #ffe6b3;
    border-radius: 8px;
    padding: 12px;
    color: #222;
    font-size: 1.4rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-weight: 600;
    border: none;
    width: 100%;
    min-height: 36px;
    margin-bottom: 0;
    resize: none;
    box-sizing: border-box;
    outline: none;
    box-shadow: 0 2px 8px rgba(226,113,0,0.04);
  }

  .text-display {
    background: #ffe6b3;
    border-radius: 8px;
    padding: 12px;
    color: #222;
    font-size: 1.4rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-weight: 600;
    cursor: pointer;
    min-height: 36px;
    box-shadow: 0 2px 8px rgba(226,113,0,0.04);
  }

  .add-block-button {
    margin-top: 12px;
    padding: 8px 20px;
    font-size: 1.4rem;
    background: linear-gradient(90deg, #e27100 0%, #ffd246 100%);
    color: #222;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    box-shadow: 0 2px 12px rgba(226,113,0,0.12);
  }

  .media-container {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
    align-items: center;
  }

  .media-image {
    width: 100%;
    height: auto;
    border-radius: 12px;
    border: 2px solid #ffd246;
    object-fit: contain;
    box-shadow: 0 2px 8px rgba(226,113,0,0.08);
    opacity: 1;
    background: #fff;
    display: block;
  }
`

// Each block will have { text, mode } where mode is 'edit' or 'render'
interface TextBlock {
  id: string;
  text: string;
  mode: 'edit' | 'render';
  balise?: string;
  color?: string;
}

interface PageContainerProps {
  userName?: string;
  selectedSubjects?: any[];
  selectedTopics?: string[];
}

const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const PageContainer: React.FC<PageContainerProps> = ({
  userName = 'Utilisateur',
  selectedSubjects = [],
  selectedTopics = []
}) => {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [mediaImages, setMediaImages] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const textAreaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const textAreaContainerRef = useRef<HTMLDivElement>(null);

  // Initialize and update text blocks when props change
  useEffect(() => {
    const createWelcomeMessage = () => {
      const subjectsText = selectedSubjects.length > 0
        ? selectedSubjects.map(s => s.name).join(', ')
        : 'various fascinating subjects';

      const topicsText = selectedTopics.length > 0
        ? selectedTopics.slice(0, 3).join(', ') + (selectedTopics.length > 3 ? '...' : '')
        : 'general exploration';

      return `🎯 Welcome ${userName}! 

I'm delighted to welcome you to this collaborative learning space. We'll explore together ${subjectsText}, with a particular focus on ${topicsText}.

This environment allows you to:
- ✍️ Ask questions and interact with content
- 📚 Generate personalized explanations 
- 🖼️ Create visual resources in the media area
- 🔄 Modify and enrich content in real-time

**To get started:** Click on this block to edit it, or add new blocks with the button below. Use Shift+Enter to save your changes!`;
    };

    if (!isInitialized) {
      // First initialization
      const initialBlockObjects: TextBlock[] = [
        {
          id: generateUniqueId(),
          text: createWelcomeMessage(),
          mode: 'render'
        },
        ...[].map(text => ({
          id: generateUniqueId(),
          text,
          mode: 'edit' as const
        }))
      ];
      setTextBlocks(initialBlockObjects);
      setIsInitialized(true);
    } else {
      // Update only the welcome message (first block) when props change
      setTextBlocks(prevBlocks => {
        if (prevBlocks.length > 0) {
          return [
            {
              ...prevBlocks[0],
              text: createWelcomeMessage()
            },
            ...prevBlocks.slice(1)
          ];
        }
        return prevBlocks;
      });
    }
  }, [userName, selectedSubjects, selectedTopics, isInitialized]);


  // Add new text block from API
  const addTextBlockFromAPI = (text: string, balise: string, color: string) => {
    setTextBlocks(prevBlocks => {
      const newBlocks: TextBlock[] = [
        ...prevBlocks, 
        // Add the AI response block
        {
          id: generateUniqueId(),
          text,
          mode: 'render' as const,
          balise,
          color,
        },
        // Automatically add a new empty block for human response
        {
          id: generateUniqueId(),
          text: '',
          mode: 'edit' as const,
          balise: 'human_response',
          color: undefined,
        }
      ];
      
      // Focus on the new textarea after state update
      setTimeout(() => {
        const newIndex = newBlocks.length - 1;
        const newTextArea = textAreaRefs.current[newIndex];
        if (newTextArea) {
          newTextArea.focus();
        }
        
        // Also scroll to bottom
        if (textAreaContainerRef.current) {
          textAreaContainerRef.current.scrollTop = textAreaContainerRef.current.scrollHeight;
        }
      }, 100);
      
      return newBlocks;
    });
  };

  // Handle API response based on balise type
  const handleAPIResponse = (response: { balise: string; text: string }) => {
    switch (response.balise) {
      case 'media_image':
        setMediaImages(prevImages => [...prevImages, response.text]);
        break;
      case 'cours':
        addTextBlockFromAPI(response.text, response.balise, "rgba(255,0,0,0.15)");
        break;
      case 'question':
        addTextBlockFromAPI(response.text, response.balise, "rgba(0,0,255,0.15)");
        break;
      case 'ai_response':
        addTextBlockFromAPI(response.text, response.balise, "rgba(0,255,0,0.15)");
        break;
      case 'explanation':
        addTextBlockFromAPI(response.text, response.balise, "rgba(255,165,0,0.15)");
        break;
      default:
        // Default behavior: add as a general AI response
        addTextBlockFromAPI(response.text, response.balise || 'ai_response', "rgba(255,210,70,0.15)");
        break;
    }
  };

  // Auto-resize effect for all textareas
  useEffect(() => {
    textBlocks.forEach((block, idx) => {
      const ref = textAreaRefs.current[idx];
      if (ref && block.mode === 'edit') {
        ref.style.height = 'auto';
        ref.style.height = ref.scrollHeight + 'px';
      }
    });
  }, [textBlocks]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, idx: number) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      const newBlocks = [...textBlocks];
      newBlocks[idx].mode = 'render';
      setTextBlocks(newBlocks);
      // API call on save
      axios.post('http://localhost:8000/api/body', {
      // axios.post('http://localhost:8000/api/demo', { // Send to demo since body does not work yet
        id: idx,
        text: newBlocks[idx].text,
        balise: newBlocks[idx].balise || 'default'
      }).then(response => {
        console.log('Reponse: ', response);
        // If the API responds with data, handle it based on balise type
        if (response.data) {
          handleAPIResponse(response.data);
        }
      }).catch((err) => {
        // Optionally handle error
        console.error('Failed to save block:', err);
      });
    }
  };

  const handleBlockClick = (idx: number) => {
    const newBlocks = [...textBlocks];
    newBlocks[idx].mode = 'edit';
    setTextBlocks(newBlocks);
  };

  return (
    <>
      <style>{pageContainerStyles}</style>
      <div className="page-container">
        {/* Left: Text Area */}
        <div className="text-area" ref={textAreaContainerRef}>
          <h2 className="title">AI Assistant</h2>
          <div className="divider" />
          {textBlocks.map((block, idx) => (
            <div
              key={block.id}
              className="text-block-container"
              style={{
                background: block.color ? block.color : undefined,
                borderRadius: '12px',
              }}
            >
              <button
                onClick={() => setTextBlocks(textBlocks.filter((_, i) => i !== idx))}
                className="delete-button"
                title="Delete block"
              >
              </button>
              {block.mode === 'edit' ? (
                <textarea
                  ref={el => textAreaRefs.current[idx] = el}
                  value={block.text}
                  onKeyDown={e => handleKeyDown(e, idx)}
                  onChange={e => {
                    const newBlocks = [...textBlocks];
                    newBlocks[idx].text = e.target.value;
                    setTextBlocks(newBlocks);
                    // Auto-resize
                    const ref = textAreaRefs.current[idx];
                    if (ref) {
                      ref.style.height = 'auto';
                      ref.style.height = ref.scrollHeight + 'px';
                    }
                  }}
                  style={{
                    background: block.color ? block.color : undefined,
                    color: block.color ? 'white' : undefined,
                  }}
                  className="text-input"
                />
              ) : (
                <div
                  onClick={() => handleBlockClick(idx)}
                  style={{
                    background: block.color ? block.color : undefined,
                    color: block.color ? 'white' : undefined,
                  }}
                  className="text-display"
                  title="Click to edit"
                >
                  <LatexRenderer text={block.text} />
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              setTextBlocks([...textBlocks, {
                id: generateUniqueId(),
                text: '',
                mode: 'edit',
              }]);
              // Scroll to bottom after adding new block
              setTimeout(() => {
                if (textAreaContainerRef.current) {
                  textAreaContainerRef.current.scrollTop = textAreaContainerRef.current.scrollHeight;
                }
              }, 0);
            }}
            className="add-block-button"
          >
            + Add Text Block
          </button>
        </div>
        {/* Right: Media Area */}
        <div className="media-area">
          <h2 className="title">Media</h2>
          <div className="divider" />
          <div className="media-container">
            {mediaImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`media-${idx}`}
                className="media-image"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PageContainer;