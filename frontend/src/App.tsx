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
import DuolingoProgressBar from './components/DuolingoProgressBar.tsx';


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
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);

  // Initialize questionnaire data from backend
  const initializeQuestionnaire = async () => {
    try {
      setError('');
      console.log('🚀 Initializing questionnaire with hardcoded data...');
      
      // Hardcoded data instead of API call
      const hardcodedData = {
        success: true,
        education_levels: [
          {
            "id": "middle_school",
            "name": "Middle School",
            "description": "Grades 6-8",
            "ages": "11-14 years"
          },
          {
            "id": "high_school",
            "name": "High School", 
            "description": "Grades 9-12",
            "ages": "14-18 years"
          },
          {
            "id": "college_early",
            "name": "College (Early)",
            "description": "Freshman & Sophomore years",
            "ages": "18-20 years"
          },
          {
            "id": "college_late",
            "name": "College (Advanced)",
            "description": "Junior & Senior years",
            "ages": "20-22 years"
          },
          {
            "id": "graduate",
            "name": "Graduate School",
            "description": "Master's & PhD programs",
            "ages": "22+ years"
          }
        ],
        subjects: [
          {"id": "math", "name": "Mathematics 🧮", "topics": ["Algebra", "Geometry", "Calculus", "Statistics"]},
          {"id": "physics", "name": "Physics ⚛️", "topics": ["Mechanics", "Electricity", "Waves", "Thermodynamics"]},
          {"id": "chemistry", "name": "Chemistry 🧪", "topics": ["Organic", "Inorganic", "Physical Chemistry"]},
          {"id": "biology", "name": "Biology 🧬", "topics": ["Genetics", "Ecology", "Anatomy", "Cell Biology"]},
          {"id": "computer_science", "name": "Computer Science 💻", "topics": ["Programming", "Algorithms", "Data Structures"]},
          {"id": "history", "name": "History ⏳", "topics": ["World History", "US History", "Ancient Civilizations"]},
          {"id": "geography", "name": "Geography 🌍", "topics": ["Physical Geography", "Human Geography", "Geopolitics"]},
          {"id": "economics", "name": "Economics 💹", "topics": ["Microeconomics", "Macroeconomics", "Personal Finance"]},
          {"id": "psychology", "name": "Psychology 🧠", "topics": ["Cognitive", "Social", "Developmental"]},
          {"id": "literature", "name": "Literature �", "topics": ["American Literature", "World Literature", "Poetry"]},
          {"id": "english", "name": "English 🇺🇸", "topics": ["Grammar", "Writing", "Literature"]},
          {"id": "spanish", "name": "Spanish 🇪🇸", "topics": ["Conversation", "Grammar", "Culture"]},
          {"id": "french", "name": "French 🇫🇷", "topics": ["Conversation", "Grammar", "Culture"]},
          {"id": "other_languages", "name": "Other Languages 🌐", "topics": ["German", "Mandarin", "Japanese"]}
        ]
      };
      
      console.log('📦 Using hardcoded data:', hardcodedData);
      
      if (hardcodedData.success) {
        console.log('✅ Hardcoded data loaded successfully');
        
        // Set education levels for US system
        const levels = hardcodedData.education_levels.map((level: any) => 
          `<strong>${level.name}</strong> (${level.description})`
        );
        console.log('🎓 Education levels processed:', levels);
        setEducationLevels(levels);
        
        // Store raw subjects data for later use
        console.log('📚 Raw subjects data:', hardcodedData.subjects);
        console.log('📚 Number of subjects:', hardcodedData.subjects.length);
        
        setSubjectsData(hardcodedData.subjects);
        console.log('💾 subjectsData state updated with', hardcodedData.subjects.length, 'subjects');
        
        // Process subjects (now flattened without categories)
        const allSubjects: string[] = hardcodedData.subjects.map((subject: any) => 
          `${subject.name} (${subject.topics.join(', ')})`
        );
        console.log('🔄 Processed subjects for display:', allSubjects);
        setSubjects(allSubjects);
        
        // Mark data as loaded
        setIsDataLoaded(true);
        console.log('✅ Data marked as loaded');
        
        console.log('🎉 Questionnaire initialized successfully with hardcoded data!');
      } else {
        console.error('❌ Hardcoded data failed - success is false');
        setError('Failed to initialize questionnaire data');
      }
    } catch (err) {
      console.error('💥 Initialization error:', err);
      setError('Error initializing questionnaire. Please try again.');
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
    console.log('=== updateAvailableTopics DEBUG ===');
    console.log('selectedItems:', selectedItems);
    console.log('selectedIndices:', selectedIndices);
    console.log('isDataLoaded:', isDataLoaded);
    console.log('subjectsData length:', subjectsData.length);
    
    if (!isDataLoaded || !subjectsData || subjectsData.length === 0) {
      console.warn('subjectsData is not loaded yet, retrying in 200ms...');
      // Retry after a short delay to allow data to load
      setTimeout(() => {
        if (subjectsData.length > 0) {
          console.log('Retrying updateAvailableTopics with loaded data');
          updateAvailableTopics(selectedItems, selectedIndices);
        } else {
          console.error('subjectsData still not loaded after retry');
        }
      }, 200);
      return;
    }
    
    console.log('Full subjectsData:', JSON.stringify(subjectsData, null, 2));
    
    const selectedSubjectObjects = selectedIndices.map(index => {
      console.log(`Processing index ${index}`);
      if (index >= 0 && index < subjectsData.length) {
        const subject = subjectsData[index];
        console.log(`Subject at index ${index}:`, JSON.stringify(subject, null, 2));
        return subject;
      }
      console.warn('Invalid index:', index);
      return null;
    }).filter(subject => subject !== null);
    
    console.log('selectedSubjectObjects count:', selectedSubjectObjects.length);
    console.log('selectedSubjectObjects:', JSON.stringify(selectedSubjectObjects, null, 2));
    setSelectedSubjects(selectedSubjectObjects);
    
    // Collect all topics from selected subjects
    const allTopics: string[] = [];
    selectedSubjectObjects.forEach((subject, subjectIndex) => {
      console.log(`Processing subject ${subjectIndex}:`, subject);
      console.log(`Subject has topics?`, 'topics' in subject);
      console.log(`Topics value:`, subject.topics);
      console.log(`Topics is array?`, Array.isArray(subject.topics));
      
      if (subject && subject.topics && Array.isArray(subject.topics)) {
        console.log(`Adding topics from ${subject.name}:`, subject.topics);
        subject.topics.forEach((topic: string, topicIndex: number) => {
          const topicWithSubject = `${topic} (${subject.name})`;
          allTopics.push(topicWithSubject);
          console.log(`Added topic ${topicIndex}:`, topicWithSubject);
        });
      } else {
        console.warn('Subject has no topics or topics is not an array:', {
          subject,
          hasTopics: 'topics' in subject,
          topicsValue: subject.topics,
          isArray: Array.isArray(subject.topics)
        });
      }
    });
    
    console.log('Final allTopics count:', allTopics.length);
    console.log('Final allTopics:', allTopics);
    setAvailableTopics(allTopics);
    console.log('=== END DEBUG ===');
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
        setIsQuestionnaireCompleted(true);
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

        {/* Duolingo Progress Bar */}
        <DuolingoProgressBar 
          initialProgress={0}
          onProgressChange={(progress) => {
            console.log(`🎯 Progress updated: ${progress}%`);
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
              
              // Scroll to PageContainer after completing all steps
              setTimeout(() => {
                const pageContainer = document.querySelector('#page-container');
                if (pageContainer) {
                  pageContainer.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                  console.log("Scrolled to PageContainer");
                } else {
                  console.warn("PageContainer not found for scrolling");
                }
              }, 1000); // Delay to allow form submission to complete
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
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
                Debug: availableTopics.length = {availableTopics.length}, selectedSubjects.length = {selectedSubjects.length}
              </div>
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
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
                    Debug: selectedSubjects = {JSON.stringify(selectedSubjects, null, 2)}
                  </div>
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
          <PageContainer 
            userName={name}
            selectedSubjects={selectedSubjects}
            selectedTopics={selectedTopics}
          />
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
