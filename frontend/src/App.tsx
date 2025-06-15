import React, { useState } from 'react';
import axios from 'axios';
import ChromaGrid from './components/ChromaGrid.tsx';
import Header from './components/Header.tsx';
import SpotlightCard from './components/SpotlightCard.tsx';
import ApiWorkflow from './components/ApiWorkflow.tsx';
import DotGrid from './components/DotGrid.tsx';
import GradientText from './components/GradientText.tsx'
import GraphRenderer from './components/GraphRenderer.tsx';
import Logo from './components/Logo.tsx';
import Stepper, { Step } from './components/Stepper.tsx';
import AnimatedList from './components/AnimatedList.tsx';
import PageContainer from './components/PageContainer.tsx';


const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');

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

        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 0 100px 0',
          textAlign: 'center', 
          color: '#fff', 
          fontSize: '1.2rem' }}>
          <strong>What is vortx.ai?</strong>
          <br />
          vortx.ai is an AI-powered assistant platform designed to help you connect your cloud, get help from the internet, and complete your tasks efficiently. Our mission is to streamline your workflow with intelligent automation and seamless integration.
            <button
            style={{
              marginTop: '32px',
              padding: '12px 32px',
              fontSize: '1.1rem',
              background: 'linear-gradient(90deg, #e27100 0%, #ffd246 100%)',
              color: '#222',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 2px 12px rgba(226,113,0,0.12)'
            }}
            onClick={() => {
              const divider = document.getElementById('stepper-section');
              if (divider) {
              const rect = divider.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              // Scroll so the divider is at the very top of the viewport
              window.scrollTo({
                top: rect.top - 64,
                behavior: 'smooth'
              });
              }
            }}
            >
            Launch Demo
            </button>
        </div>
        
        <div style={{ height: '600px', position: 'relative' }}>
              <ChromaGrid 
                color="orange"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
              />
            </div>

{/* Add separation line */}
        {/* <div id='stepper-section'
          style={{
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, #e27100 0%, #ffd246 100%)',
            opacity: 0.7,
            margin: '32px 0',
            borderRadius: '1px',
          }}
        />

        <div style={{ marginTop: 10 }}>
          <Stepper
            initialStep={1}
            onStepChange={(step) => {
              console.log(step);
            }}
            onFinalStepCompleted={() => console.log("All steps completed!")}
            backButtonText="Previous"
            nextButtonText="Next"
          >
            <Step>
              <h2>Welcome to <Logo /> </h2>
              <p>Check out the next step!</p>
            </Step>
            
            <Step>
              <h2>🎓 Niveau scolaire :</h2>
              <p>Salut ! Pour commencer, où en es-tu dans ton parcours ? 🚀</p>
              <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <AnimatedList
          items={[
            '<strong>Collège</strong> (6ᵉ → 3ᵉ)',
            '<strong>Lycée</strong> (Seconde → Terminale)',
            '<strong>Bac+1/Bac+2</strong> (Licence 1, BTS, Prépa…)',
            '<strong>Bac+3</strong> (Licence 3, Bachelor, BUT…)',
            ]}
          initialSelectedIndex={-1}
          allowHtml={true}
          onItemSelect={(item, index) => {
            console.log('Selected:', item, 'at index:', index);
          }}
          ></AnimatedList>   

          <div
            style={{
              width: '100%',
              height: '2px',
              background: 'linear-gradient(60deg, #e27100 20%, #ffd246 100%)',
              opacity: 0.7,
              margin: '32px 0',
              borderRadius: '1px',
            }}
          />
        </div>

            </Step>
            <Step>
              <h2>📚 Domaine/Matière :</h2>
              <p>Quelle matière veux-tu explorer ou améliorer ? 🔍</p>
              <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <AnimatedList
          items={[
            'Mathématiques 🧮 (Algèbre, Géométrie, Stats…)',
            'Physique /Chimie 🔬 (Mécanique, Thermodynamique, Électromagnétisme…)',
            'Sciences de la Vie (SVT/Biologie) 🧬 (Génétique, Écologie, Anatomie…)',
            'Informatique 💻 (Programmation, Algo, Cybersécurité…)',
            'Histoire / Géographie 🌍 (Antiquité, Moderne, Contemporaine…)',
            'Économie/SES 💹 (Microéco, Macroéco, Sociologie…)',
            'Philosophie 🧠 (Éthique, Logique, Grands courants…)',
            'Anglais 🇬🇧 / Espagnol 🇪🇸 / Allemand 🇩🇪 / Autre'
            ]}
          initialSelectedIndex={-1}
          allowHtml={true}
          onItemSelect={(item, index) => {
            console.log('Selected subject:', item, 'at index:', index);
          }}
          ></AnimatedList>   

          <div
            style={{
              width: '100%',
              height: '2px',
              background: 'linear-gradient(60deg, #e27100 20%, #ffd246 100%)',
              opacity: 0.7,
              margin: '32px 0',
              borderRadius: '1px',
            }}
          />
        </div>
            </Step>
            <Step>
              <h2>How about an input?</h2>
              <input 
                type="text"
                value={name} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
                placeholder="Your name?" 
              />
            </Step>
            <Step>
              <h2>Final Step</h2>
              <p>You made it!</p>
            </Step>
          </Stepper>
          
        </div> */}

        <PageContainer></PageContainer>
{/* 
          <ApiWorkflow
            inputText={inputText}
            setInputText={setInputText}
            processedText={processedText}
            processText={processText}
            error={error}
          /> */}
          
          {/* <GraphRenderer /> */}
{/*           
          <div style={{ 
            maxWidth: '3000px',
            width: '100%',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}> 
          </div> */}
        </div>
      </body>
    </>
  );
};

export default App; 
