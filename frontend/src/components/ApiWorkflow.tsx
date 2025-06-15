import React from 'react';
import Logo from './Logo.tsx';
import LatexRenderer from './LatexRenderer.tsx';

interface ApiWorkflowProps {
  inputText: string;
  setInputText: (text: string) => void;
  processedText: string;
  processText: () => void;
  error?: string;
}

const apiFlowStyles = `
.api-flow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 48px 0 56px 0;
  gap: 0;
}
.api-flow-box {
  background: rgba(30, 30, 30, 0.85);
  border-radius: 16px;
  padding: 32px 24px;
  min-width: 220px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.12);
  border: 2px solid #FFD246;
  position: relative;
}
.api-flow-box.input-box,
.api-flow-box.output-box {
  background: #23222b;
  border: 2px solid #FFD246;
  border-radius: 16px;
  min-width: 260px;
  min-height: 120px;
  padding: 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.api-flow-box.output-box {
  color: #fff;
  font-style: italic;
  font-weight: 600;
  font-size: 1.05rem;
}
.api-flow-box.input-box input {
  width: 180px;
  padding: 10px;
  border-radius: 8px;
  border: 1.5px solid #FFD246;
  margin-bottom: 12px;
  background: #18192A;
  color: #fff;
  font-size: 1rem;
}
.api-flow-box.input-box button {
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  background: #FFD246;
  color: #432005;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.api-flow-box.input-box button:hover {
  background: #FFBC1B;
}
.api-box {
  background: linear-gradient(90deg, #FFD246 0%, #E27100 100%);
  color: #432005;
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 160px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 0 24px 0 rgba(255, 210, 70, 0.15);
}
.output-box {
  background: #18192A;
  color: #FFD246;
  font-size: 1.1rem;
  min-width: 220px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FFD246;
}
.api-flow-line {
  width: 80px;
  height: 5px;
  background: linear-gradient(90deg, #E27100 0%, #FFD246 50%, #E27100 100%);
  background-size: 200% 100%;
  background-position: 0% 0%;
  animation: flow-line 2s linear infinite;
  margin: 0 8px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.api-flow-line-reverse {
  width: 80px;
  height: 5px;
  background: linear-gradient(270deg, #FFD246 0%, #E27100 50%, #FFD246 100%);
  background-size: 200% 100%;
  background-position: 0% 0%;
  animation: flow-line-reverse 2s linear infinite;
  margin: 0 8px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

@keyframes flow-line {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: -100% 0%;
  }
  100% {
    background-position: 0% 0%;
  }
}
@keyframes flow-line-reverse {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 0%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.placeholder {
  color: #aaa;
  font-style: italic;
}
.error-message {
  color: #ff4444;
  font-size: 0.95rem;
  margin-top: 8px;
}
`;

const ApiWorkflow: React.FC<ApiWorkflowProps> = ({
  inputText,
  setInputText,
  processedText,
  processText,
  error
}) => (
  <>
    <style>{apiFlowStyles}</style>
    <div className="api-flow-container">
      <div className="api-flow-box input-box">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text or LaTeX (use $ for inline, $$ for block)"
        />
        <button onClick={processText}>Submit</button>
        {error && <div className="error-message">{error}</div>}
      </div>
      <div className="api-flow-line" />
      <div className="api-flow-box api-box">
        <Logo variant="dark" />
        <div style={{ fontWeight: 700, marginTop: 4 }}>API</div>
      </div>
      <div className="api-flow-line-reverse" />
      <div className="api-flow-box output-box">
        {processedText ? (
          <LatexRenderer text={processedText} />
        ) : (
          <span className="placeholder">Processed text will appear here</span>
        )}
      </div>
    </div>
  </>
);

export default ApiWorkflow; 