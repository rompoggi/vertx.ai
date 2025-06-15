import React, { useState, useRef, useEffect } from 'react';
import LatexRenderer from './LatexRenderer.tsx';
import axios from 'axios';

const pageContainerStyles = `
  .page-container {
    display: flex;
    width: 80vw;
    height: 90vh;
    margin: 40px auto;
    border: 1px solid #ffd246;
    border-radius: 2rem;
    background: rgba(0, 0, 0, 0.65);
    box-shadow: 0px 0px 6px 6px rgba(184, 129, 1, 0.10) 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    overflow: hidden;
  }

  .text-area {
    flex: 8;
    border-right: 1px solid #ffd246;
    height: 100%;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 18px;
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
    border-radius: 12px;
    padding: 16px;
    color: #222;
    font-size: 2rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-weight: 700;
    border: none;
    width: 100%;
    min-height: 48px;
    margin-bottom: 0;
    resize: none;
    box-sizing: border-box;
    outline: none;
    box-shadow: 0 2px 8px rgba(226,113,0,0.04);
  }

  .text-display {
    background: #ffe6b3;
    border-radius: 12px;
    padding: 16px;
    color: #222;
    font-size: 2rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-weight: 700;
    cursor: pointer;
    min-height: 48px;
    box-shadow: 0 2px 8px rgba(226,113,0,0.04);
  }

  .add-block-button {
    margin-top: 18px;
    padding: 10px 28px;
    font-size: 2rem;
    background: linear-gradient(90deg, #e27100 0%, #ffd246 100%);
    color: #222;
    border: none;
    border-radius: 8px;
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

const initialTextBlocks = [
  'Welcome to the Page block! This is a sample text block.',
  'You can add multiple text blocks here, each with its own content and style.',
  'The right area will soon display media in a scrollable column.'
];

// Each block will have { text, mode } where mode is 'edit' or 'render'
interface TextBlock {
  id: string;
  text: string;
  mode: 'edit' | 'render';
  balise?: string;
}

const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const initialBlockObjects: TextBlock[] = initialTextBlocks.map(text => ({ 
  id: generateUniqueId(),
  text, 
  mode: 'edit' 
}));

const PageContainer: React.FC = () => {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>(initialBlockObjects);
  const [mediaImages, setMediaImages] = useState<string[]>([]);
  const textAreaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const textAreaContainerRef = useRef<HTMLDivElement>(null);

  // Add new text block from API
  const addTextBlockFromAPI = (text: string, balise: string) => {
    setTextBlocks(prevBlocks => [...prevBlocks, { 
      id: generateUniqueId(),
      text, 
      mode: 'render', 
      balise 
    }]);
    // Scroll to bottom after adding new block
    setTimeout(() => {
      if (textAreaContainerRef.current) {
        textAreaContainerRef.current.scrollTop = textAreaContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  // Handle API response based on balise type
  const handleAPIResponse = (response: { balise: string; text: string }) => {
    switch (response.balise) {
      case 'media_image':
        setMediaImages(prevImages => [...prevImages, response.text]);
        break;
      case 'cours':
      case 'question':
        addTextBlockFromAPI(response.text, response.balise);
        break;
      default:
        console.warn(`Unknown balise type: ${response.balise}`);
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
        id: idx,
        text: newBlocks[idx].text,
        balise: newBlocks[idx].balise || 'default'
      }).then(response => {
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
        <h2 className="title">Text</h2>
        <div className="divider" />
        {textBlocks.map((block, idx) => (
          <div key={block.id} className="text-block-container">
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
                className="text-input"
              />
            ) : (
              <div
                onClick={() => handleBlockClick(idx)}
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
              mode: 'edit' 
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