import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDragon, faScroll } from '@fortawesome/free-solid-svg-icons';

// import { Socket } from 'socket.io-client';

const duolingoProgressBarStyles = `
.duolingo-progress-container {
  display:
  // width: 100%;
  width: 80vw;
  margin: auto;
  padding: 1.5rem;
  border-radius: 2rem;
  background: rgba(0, 0, 0, 0.65);
  box-shadow: 0px 0px 6px 6px rgba(184, 129, 1, 0.10),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
}

.duolingo-progress-wrapper {
  margin: 1.5rem;
}

.duolingo-progress-bar {
  position: relative;
  width: 100%;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.duolingo-progress-bar.pulse {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}

.duolingo-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFA500 0%, #FFD246 50%, #FFB347 100%);
  border-radius: 25px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.duolingo-progress-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

.duolingo-checkpoint {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  border: 3px solid #ddd;
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.duolingo-checkpoint.completed {
  background: #FFD246;
  border-color: #FFA500;
  transform: translate(-50%, -50%) scale(1.1);
  animation: checkpointPulse 0.6s ease-out;
}

.duolingo-progress-text {
  text-align: center;
  margin-top: 1.1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.duolingo-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

// .duolingo-btn {
//   padding: 0.75rem 1.5rem;
//   border: none;
//   border-radius: 12px;
//   font-size: 0.95rem;
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.2s ease;
//   text-decoration: none;
//   display: inline-flex;
//   align-items: center;
//   gap: 0.5rem;
// }

// .duolingo-btn-primary {
//   background: linear-gradient(135deg, #FFA500 0%, #FFD246 100%);
//   color: white;
//   box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
// }

// .duolingo-btn-primary:hover:not(:disabled) {
//   transform: translateY(-2px);
//   box-shadow: 0 6px 20px rgba(255, 165, 0, 0.4);
// }

// .duolingo-btn-primary:disabled {
//   background: #ccc;
//   cursor: not-allowed;
//   transform: none;
//   box-shadow: none;
// }

// .duolingo-btn-secondary {
//   background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
//   color: white;
//   box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
// }

// .duolingo-btn-secondary:hover {
//   transform: translateY(-2px);
//   box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
// }

.duolingo-reward-toast {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #333;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
  z-index: 9999;
  animation: toastSlideIn 0.5s ease-out forwards, toastSlideOut 0.5s ease-in 2.5s forwards;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes checkpointPulse {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.3); }
  100% { transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes toastSlideOut {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
}

// @media (max-width: 640px) {
//   .duolingo-progress-container {
//     margin: 0 auto 1rem;
//     padding: 1rem;
//   }
  
  .duolingo-checkpoint {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
}
`;

interface DuolingoProgressBarProps {
  initialProgress?: number;
  onProgressChange?: (progress: number) => void;
  enableAutoDemo?: boolean;
  startDemo?: boolean;
}

const DuolingoProgressBar: React.FC<DuolingoProgressBarProps> = ({ 
  initialProgress = 0, 
  onProgressChange,
  enableAutoDemo = true,
  startDemo = true
}) => {
  const [progress, setProgress] = useState(initialProgress);
  const [isAnimating, setIsAnimating] = useState(true);
  const [lastCheckpoint, setLastCheckpoint] = useState(-1);
  const progressBarRef = useRef<HTMLDivElement>(null);
  // const wsRef = useRef<Socket | null>(null);

  // Checkpoints positions (25%, 50%, 75%, 100%)
  const checkpoints = useMemo(() => [0, 25, 50, 75, 100], []);

  const showRewardToast = useCallback((message: string) => {
    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = 'duolingo-reward-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  }, []);

  const triggerCheckpointAnimation = useCallback((checkpoint: number) => {
    // Trigger confetti animation
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1']
      });
    }

    // Show reward message
    const reward = (checkpoint === 100) ? '🐉 Boss Defeated!' : `★ Checkpoint ${checkpoint}% Unlocked!`;
    showRewardToast(reward);
  }, [showRewardToast]);

  const updateProgress = useCallback((newProgress: number, reward?: string) => {
    const clampedProgress = Math.min(Math.max(newProgress, 0), 100);
    
    setIsAnimating(true);
    setProgress(clampedProgress);
    
    // Check for checkpoint rewards
    const currentCheckpoint = checkpoints.findIndex(cp => (clampedProgress >= cp) && (lastCheckpoint < checkpoints.indexOf(cp)));
    if ((currentCheckpoint !== -1) && (checkpoints[currentCheckpoint] > lastCheckpoint)) {
      setLastCheckpoint(checkpoints[currentCheckpoint]);
      triggerCheckpointAnimation(checkpoints[currentCheckpoint]);
    }

    // Call parent callback
    if (onProgressChange) {
      onProgressChange(clampedProgress);
    }

    // Remove animation class after animation completes
    setTimeout(() => setIsAnimating(false), 600);
  }, [lastCheckpoint, onProgressChange, triggerCheckpointAnimation, checkpoints]);

  // const connectWebSocket = useCallback(() => {
  //   try {
  //     // Import Socket.IO client dynamically
  //     import('socket.io-client').then(({ io }) => {
  //       // Connect to the Python Flask-SocketIO backend
  //       const socket = io('http://localhost:8001', {
  //         transports: ['websocket', 'polling']
  //       });
        
  //       // Store socket reference
  //       wsRef.current = socket as any;
        
  //       socket.on('connect', () => {
  //         console.log('🔗 Connected to progress Socket.IO server');
  //       });

  //       socket.on('progress_update', (data) => {
  //         console.log('📊 Received progress update:', data);
          
  //         if (data.type === 'progress_update') {
  //           updateProgress(data.progress, data.reward);
  //         }
  //       });

  //       socket.on('disconnect', () => {
  //         console.log('🔌 Socket.IO connection closed');
  //         // Reconnect after 3 seconds
  //         setTimeout(connectWebSocket, 3000);
  //       });

  //       socket.on('connect_error', (error) => {
  //         console.error('❌ Socket.IO error:', error);
  //       });
  //     }).catch((error) => {
  //       console.error('❌ Failed to load Socket.IO client:', error);
  //     });
  //   } catch (error) {
  //     console.error('❌ Failed to connect Socket.IO:', error);
  //   }
  // }, [updateProgress]);

  const loadConfetti = useCallback(() => {
    // Load canvas-confetti library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    // Initialize WebSocket connection
    // connectWebSocket();
    
    // Load canvas-confetti dynamically
    // updateProgress();
    loadConfetti();

    // Auto demo: progress 10% every 2 seconds, but only if startDemo is true
    let demoInterval; // : NodeJS.Timeout;
    if (enableAutoDemo && startDemo) {
      demoInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 10, 100);
          
          // Trigger animations and callbacks
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 600);
          
          // Check for checkpoint rewards
          const currentCheckpoint = checkpoints.findIndex(cp => newProgress >= cp && prev < cp);
          if (currentCheckpoint !== -1) {
            setLastCheckpoint(checkpoints[currentCheckpoint]);
            triggerCheckpointAnimation(checkpoints[currentCheckpoint]);
          }
          
          // Call parent callback
          if (onProgressChange) {
            onProgressChange(newProgress);
          }
          
          // Stop interval when reaching 100%
          if (newProgress >= 100) {
            clearInterval(demoInterval);
          }
          
          return newProgress;
        });
      }, 2000);
    }

    return () => {
      // if (wsRef.current) {
      //   wsRef.current.close();
      // }
      if (demoInterval) {
        clearInterval(demoInterval);
      }
    };
  }, [loadConfetti, enableAutoDemo, startDemo, checkpoints, onProgressChange, triggerCheckpointAnimation]);

  return (
    <>
      <style>{duolingoProgressBarStyles}</style>
      <div className="duolingo-progress-container">
        {/* Progress Bar */}
        <div className="duolingo-progress-wrapper" style={{ padding: "10rem;" }}>
          <div 
            ref={progressBarRef}
            className={`duolingo-progress-bar ${isAnimating ? 'pulse' : ''}`}
          >
            <div 
              className="duolingo-progress-fill"
              style={{width: `${progress}%` }}
            />
            
            {/* Checkpoints */}
            {checkpoints.map((checkpoint, index) => (
              <div
                key={checkpoint}
                className={`duolingo-checkpoint ${progress >= checkpoint ? 'completed' : ''}`}
                style={{ left: `${checkpoint}%` }}
              >
                {checkpoint === 0 ? <FontAwesomeIcon icon={faScroll} color="white" fontSize={"12px"}/> : checkpoint === 100 ? <FontAwesomeIcon icon={faDragon} /> : '★'}
              </div>
            ))}
          </div>
          
          {/* Progress Text */}
          <div className="duolingo-progress-text">
            {progress}% Complete
          </div>
        </div>
      </div>
    </>
  );
};

// Extend global Window interface for TypeScript
declare global {
  interface Window {
    confetti: any;
  }
}

export default DuolingoProgressBar;
