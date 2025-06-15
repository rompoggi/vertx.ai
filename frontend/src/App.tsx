import React, { useState } from 'react';
import axios from 'axios';
import ChromaGrid from './components/ChromaGrid.tsx';
import Header from './components/Header.tsx';
import SpotlightCard from './components/SpotlightCard.tsx';
import ApiWorkflow from './components/ApiWorkflow.tsx';
import DotGrid from './components/DotGrid.tsx';
import GradientText from './components/GradientText.tsx'
import GraphRenderer from './components/GraphRenderer.tsx';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [error, setError] = useState('');

  const processText = async () => {
    try {
      setError('');
      const response = await axios.post('http://localhost:8000/api/process', {
        text: inputText
      });
      setProcessedText(response.data.processed_text);
    } catch (err) {
      setError('Error processing text. Please try again.');
      console.error('Error:', err);
    }
  };

  return (
    <>
      {/* DotGrid as full background */}
      <body>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '140vw',
          height: '140vh',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        <DotGrid
          dotSize={8}
          gap={100}
          baseColor="#e27100"
          activeColor="#ffd246"
          proximity={120}
          shockRadius={500}
          shockStrength={5}
          resistance={5000}
          returnDuration={2.5}
        />
      </div>

      {/* Main content above the grid */}
      <div style={{ position: 'relative', zIndex: 4 }}>
        <Header />
          <div
            style={{
              width: '70vw',
              maxWidth: '1200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px',
              margin: '40px auto',
            }}
          >
            <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(226, 113, 0 , 0.2)">
              <GradientText animationSpeed={10}>
              Connect your AI Assistant to your cloud
              </GradientText>
            </SpotlightCard>

            <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(226, 113, 0 , 0.2)">
            <GradientText animationSpeed={10}>
              Get help from the internet
            </GradientText>
            </SpotlightCard>

            <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(226, 113, 0 , 0.2)">
              <GradientText animationSpeed={10}>
              Complete your tasks efficiently
              </GradientText>
            </SpotlightCard>

          </div>

          <ApiWorkflow
            inputText={inputText}
            setInputText={setInputText}
            processedText={processedText}
            processText={processText}
            error={error}
          />
          
          <GraphRenderer />
          
          <div style={{ 
            maxWidth: '3000px',
            width: '100%',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}> 
            <div style={{ height: '600px', position: 'relative' }}>
              <ChromaGrid 
                color="orange"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
              />
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default App; 