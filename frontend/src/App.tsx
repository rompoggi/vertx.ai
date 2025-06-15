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
  const [educationLevels, setEducationLevels] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [subjectsData, setSubjectsData] = useState<any[]>([]);
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<{item: string, index: number} | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Initialize questionnaire data from backend
  const initializeQuestionnaire = async () => {
    try {
      setError('');
      const response = await axios.get('http://localhost:8000/api/questionnaire');
      
      if (response.data.success) {
        // Set education levels for US system
        const levels = response.data.education_levels.map((level: any) => 
          `<strong>${level.name}</strong> (${level.description})`
        );
        setEducationLevels(levels);
        
        // Store raw subjects data for later use
        setSubjectsData(response.data.subjects);
        
        // Process subjects (now flattened without categories)
        const allSubjects: string[] = response.data.subjects.map((subject: any) => 
          `${subject.name} (${subject.topics.join(', ')})`
        );
        setSubjects(allSubjects);
        
        console.log('Questionnaire initialized successfully');
      }
    } catch (err) {
      setError('Error initializing questionnaire. Please try again.');
      console.error('Initialization error:', err);
    }
  };

  // Initialize on component mount
  React.useEffect(() => {
    initializeQuestionnaire();
  }, []);

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

  // Function to update available topics based on selected subjects
  const updateAvailableTopics = (selectedItems: string[], selectedIndices: number[]) => {
    const selectedSubjectObjects = selectedIndices.map(index => subjectsData[index]);
    setSelectedSubjects(selectedSubjectObjects);
    
    // Collect all topics from selected subjects
    const allTopics: string[] = [];
    selectedSubjectObjects.forEach(subject => {
      if (subject && subject.topics) {
        subject.topics.forEach((topic: string) => {
          allTopics.push(`${topic} (${subject.name})`);
        });
      }
    });
    
    setAvailableTopics(allTopics);
    console.log('Available topics updated:', allTopics);
  };

  // Function to submit questionnaire results to backend
  const submitQuestionnaireResults = async () => {
    try {
      setError('');
      
      const questionnaireData = {
        name: name,
        educationLevel: selectedEducationLevel,
        selectedSubjects: selectedSubjects.map(subject => ({
          id: subject.id,
          name: subject.name,
          topics: subject.topics
        })),
        selectedTopics: selectedTopics,
        timestamp: new Date().toISOString()
      };

      console.log('Submitting questionnaire data:', questionnaireData);

      const response = await axios.post('http://localhost:8000/api/init', questionnaireData);
      
      if (response.data.success) {
        console.log('Questionnaire submitted successfully:', response.data);
        console.log('Selected subjects with topics:', response.data.selected_subjects_with_topics);
        
        // Scroll to PageContainer after successful submission
        setTimeout(() => {
          const pageContainer = document.querySelector('#page-container');
          if (pageContainer) {
            pageContainer.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 500); // Small delay to ensure component is rendered
      }
    } catch (err) {
      setError('Error submitting questionnaire. Please try again.');
      console.error('Submission error:', err);
    }
  };

  return (
    <>
      {/* DotGrid as full background */}
      <div>
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
      <div id='stepper-section'
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
            onFinalStepCompleted={() => {
              console.log("All steps completed!");
              submitQuestionnaireResults();
            }}
            backButtonText="Previous"
            nextButtonText="Next"
          >
            <Step>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                textAlign: 'center',
                padding: '2rem',
              }}>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '2rem',
                  background: 'linear-gradient(135deg, #e27100 0%, #ffd246 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1.2,
                }}>
                  Welcome to <span style={{ fontSize: '4rem' }}><Logo /></span>
                </h1>
                <p style={{
                  fontSize: '1.5rem',
                  color: '#fff',
                  maxWidth: '600px',
                  lineHeight: 1.6,
                  marginBottom: '1rem',
                }}>
                  Your AI-powered learning companion is ready to help you excel in your studies
                </p>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#ffd246',
                  opacity: 0.9,
                  fontStyle: 'italic',
                }}>
                  Let's get started on your personalized learning journey! 🚀
                </p>
              </div>
            </Step>
            
            <Step>
              <h2>🎓 Education Level:</h2>
              <p>Hi there! Let's start by knowing where you are in your educational journey! 🚀</p>
              <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <AnimatedList
          items={educationLevels.length > 0 ? educationLevels : [
            '<strong>Middle School</strong> (Grades 6-8)',
            '<strong>High School</strong> (Grades 9-12)', 
            '<strong>College (Early)</strong> (Freshman & Sophomore)',
            '<strong>College (Advanced)</strong> (Junior & Senior)',
            '<strong>Graduate School</strong> (Master\'s & PhD)'
            ]}
          initialSelectedIndex={-1}
          allowHtml={true}
          onItemSelect={(item, index) => {
            console.log('Selected education level:', item, 'at index:', index);
            setSelectedEducationLevel({ item, index });
          }}
          />
        </div>
            </Step>
            
            <Step>
              <h2>📚 Subject Area:</h2>
              <p>What subjects would you like to explore or improve? 🔍 <br/>
              <small style={{color: '#ffd246'}}>Click to select multiple subjects</small></p>
              <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <AnimatedList
          items={subjects.length > 0 ? subjects : [
            'Mathematics 🧮 (Algebra, Geometry, Calculus, Statistics)',
            'Physics ⚛️ (Mechanics, Electricity, Waves, Thermodynamics)',
            'Chemistry 🧪 (Organic, Inorganic, Physical Chemistry)',
            'Biology 🧬 (Genetics, Ecology, Anatomy, Cell Biology)',
            'Computer Science 💻 (Programming, Algorithms, Data Structures)',
            'History ⏳ (World History, US History, Ancient Civilizations)',
            'Geography 🌍 (Physical Geography, Human Geography, Geopolitics)',
            'Economics 💹 (Microeconomics, Macroeconomics, Personal Finance)',
            'Psychology 🧠 (Cognitive, Social, Developmental)',
            'Literature 📚 (American Literature, World Literature, Poetry)',
            'English 🇺🇸 (Grammar, Writing, Literature)',
            'Spanish 🇪🇸 (Conversation, Grammar, Culture)',
            'French 🇫🇷 (Conversation, Grammar, Culture)',
            'Other Languages 🌐 (German, Mandarin, Japanese)'
            ]}
          initialSelectedIndex={-1}
          allowHtml={true}
          multiSelect={true}
          onMultiSelect={(selectedItems, selectedIndices) => {
            console.log('Selected subjects:', selectedItems);
            console.log('Selected indices:', selectedIndices);
            updateAvailableTopics(selectedItems, selectedIndices);
          }}
          onItemSelect={(item, index) => {
            console.log('Single selected subject:', item, 'at index:', index);
          }}
          />
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
              <h2>🎯 Specific Topics:</h2>
              <p>Now let's get specific! Which topics would you like to focus on? 📚</p>
              {availableTopics.length > 0 ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                  <AnimatedList
                    items={availableTopics}
                    initialSelectedIndex={-1}
                    allowHtml={true}
                    multiSelect={true}
                    onMultiSelect={(selectedItems, selectedIndices) => {
                      console.log('Selected topics:', selectedItems);
                      console.log('Selected topic indices:', selectedIndices);
                      setSelectedTopics(selectedItems);
                    }}
                    onItemSelect={(item, index) => {
                      console.log('Single selected topic:', item, 'at index:', index);
                    }}
                  />
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
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#ffd246' }}>
                  <p>Please select subjects in the previous step to see available topics! 👆</p>
                </div>
              )}
            </Step>
            
            <Step>
              <h2>👤 Tell us about yourself:</h2>
              <input 
                type="text"
                value={name} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
                placeholder="Your name?" 
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '2px solid #733f10',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </Step>
          </Stepper>
        </div>

        <div id="page-container">
          <PageContainer></PageContainer>
        </div>
      </div>
    </>
  );
};

export default App;
          
          {/* <GraphRenderer /> */}
{/*           
          <div style={{ 
            maxWidth: '3000px',
            width: '100%',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}> 
          </div>
        </div>
      </body>
    </>
  );
};

export default App;
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
          </div>
        </div>
      </body>
    </>
  );
};
export default App; */}
