import React, { useState } from 'react';
import axios from 'axios';
import ElasticSlider from './ElasticSlider.tsx';
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";


const graphRendererStyles = `
.graph-container {
  background: rgba(30, 30, 30, 0.85);
  border-radius: 16px;
  padding: 32px 24px;
  width: 100%;
  max-width: 800px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: 2px solid #FFD246;
}

.function-input-container {
  display: flex;
  gap: 16px;
  align-items: center;
}

.function-input {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1.5px solid #FFD246;
  background: #18192A;
  color: #fff;
  font-size: 1rem;
  font-family: 'Courier New', monospace;
}

.function-input:focus {
  outline: none;
  border-color: #FFBC1B;
}

.plot-button {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: #FFD246;
  color: #432005;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.plot-button:hover {
  background: #FFBC1B;
}

.graph-frame {
  width: 100%;
  height: 400px;
  background: #18192A;
  border-radius: 8px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.graph-frame img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.error-message {
  color: #ff4444;
  font-size: 0.95rem;
  margin-top: 8px;
}

.placeholder-text {
  color: #666;
  font-style: italic;
}

.range-container {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 8px;
}

.range-input {
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #333;
  outline: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #FFD246;
  cursor: pointer;
  transition: background 0.2s;
}

.range-input::-webkit-slider-thumb:hover {
  background: #FFBC1B;
}

.range-value {
  min-width: 60px;
  color: #fff;
  font-size: 0.9rem;
  text-align: center;
}

.range-label {
  color: #fff;
  font-size: 0.9rem;
  min-width: 40px;
}

.slider-row {
  display: flex;
  flex-direction: row;
  gap: 32px;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 8px;
}

.slider-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 180px;
}
`;

interface GraphRendererProps {
  className?: string;
}

const GraphRenderer: React.FC<GraphRendererProps> = ({ className = '' }) => {
  const [functionString, setFunctionString] = useState('');
  const [graphImage, setGraphImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [[xMin, xMax], setXRange] = useState<[number, number]>([-1, 1]);

  const handlePlot = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:8000/api/plot', {
        text: functionString,
        xMin: xMin,
        xMax: xMax
      });

      setGraphImage(response.data.imageData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error plotting function. Please check your input.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{graphRendererStyles}</style>
      <div className={`graph-container ${className}`}>
        <div className="function-input-container">
          <input
            type="text"
            className="function-input"
            value={functionString}
            onChange={(e) => setFunctionString(e.target.value)}
            placeholder="Enter function (e.g., f(x) = sin(x), f(x) = x^2 + 2*x + 1)"
          />
          <button 
            className="plot-button"
            onClick={handlePlot}
            disabled={isLoading}
          >
            {isLoading ? 'Plotting...' : 'Plot'}
          </button>
        </div>

        <div className="slider-row">
          <div className="slider-col" style={{width: '100%'}}>
            <ElasticSlider
              value={[xMin, xMax]}
              defaultValue={[xMin, xMax]}
              startingValue={-2}
              maxValue={2}
              isStepped
              stepSize={0.1}
              leftIcon={<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><RiArrowLeftSLine /> Min</span>}
              rightIcon={<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Max <RiArrowRightSLine /></span>}
              onChange={(value) => Array.isArray(value) && setXRange(value)}
              title="x min / x max:"
            />
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="graph-frame">
          {graphImage ? (
            <img src={graphImage} alt="Function plot" />
          ) : (
            <span className="placeholder-text">
              Try functions like: sin(x), cos(x), x^2, exp(x), sqrt(x)
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default GraphRenderer; 