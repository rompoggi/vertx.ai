import React, {
    useState,
    Children,
    useRef,
    useLayoutEffect,
    HTMLAttributes,
    ReactNode,
  } from "react";
  import { motion, AnimatePresence, Variants } from "framer-motion";
  
const stepperStyles = `
.outer-container {
    // display: flex;
    min-height: 100%;
    flex: 1 1 0%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

@media (min-width: 640px) {
    .outer-container {
        aspect-ratio: 4 / 3;
    }
}

@media (min-width: 768px) {
    .outer-container {
        aspect-ratio: 2 / 1;
    }
}

.step-circle-container {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 48rem;
    height: 700px; /* Fixed height instead of min-height */
    background: rgba(0, 0, 0, 0.65);
    border-radius: 2rem; /* Uniform border radius for all corners */
    box-shadow: 0px 0px 6px 6px rgba(184, 129, 1, 0.10),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
}

.step-indicator-row {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 2rem;
}

.step-content-default {
    position: relative;
    overflow: hidden;
    flex: 1; /* Take remaining space above footer */
    display: flex;
    flex-direction: column;
}

.step-default {
    padding: 2rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: visible;
}

.footer-container {
    height: 100px; /* Fixed height */
    padding: 0 2rem; /* Remove top/bottom padding */
    border-top: 1px solid rgba(255, 210, 70, 0.2);
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0 0 2rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Spread buttons to opposite sides */
}

.footer-nav {
    margin: 0;
    display: flex;
    align-items: center;
    width: 100%; /* Take full width */
    justify-content: space-between; /* Always spread buttons */
}

.footer-nav.spread {
    justify-content: space-between;
}

.footer-nav.end {
    justify-content: flex-end;
}

.footer-nav.end {
    justify-content: flex-end;
}

.back-button {
    transition: all 300ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: rgba(115, 63, 16, 0.8);
    border: 2px solid rgba(255, 210, 70, 0.3);
    color: #fffac2;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: -0.025em;
    padding: 12px 24px;
    cursor: pointer;
    min-width: 100px;
    position: relative;
    overflow: hidden;
}

.back-button:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 210, 70, 0.1), transparent);
    transition: left 0.5s;
}

.back-button:hover:before {
    left: 100%;
}

.back-button:hover {
    background: rgba(115, 63, 16, 1);
    border-color: rgba(255, 210, 70, 0.6);
    color: #ffd246;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(226, 113, 0, 0.3);
}

.back-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(226, 113, 0, 0.2);
}

.back-button.inactive {
    pointer-events: none;
    opacity: 0.5;
    color: #733f10;
    background: rgba(115, 63, 16, 0.3);
    border-color: rgba(255, 210, 70, 0.1);
    cursor: not-allowed;
}

.next-button {
    transition: all 300ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: linear-gradient(135deg, #e27100 0%, #ffd246 100%);
    border: none;
    color: #1a1000;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: -0.025em;
    padding: 12px 28px;
    cursor: pointer;
    min-width: 120px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(226, 113, 0, 0.4);
}

.next-button:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.next-button:hover:before {
    left: 100%;
}

.next-button:hover {
    background: linear-gradient(135deg, #ffd246 0%, #ffed4e 100%);
    color: #2d1600;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(226, 113, 0, 0.5);
}
}

.next-button:active {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(226, 113, 0, 0.3);
}

.step-indicator {
    position: relative;
    cursor: pointer;
    outline: none;
}

.step-indicator-inner {
    display: flex;
    height: 2rem;
    width: 2rem;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    font-weight: 600;
}

.active-dot {
    height: 0.75rem;
    width: 0.75rem;
    border-radius: 9999px;
    background-color: #fefce8;
}

.step-number {
    font-size: 0.875rem;
}

.step-connector {
    position: relative;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    height: 0.125rem;
    flex: 1;
    overflow: hidden;
    border-radius: 0.25rem;
    background-color: rgba(226, 113, 0, 0.5);
}

.step-connector-inner {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
}

.check-icon {
    height: 1rem;
    width: 1rem;
    color: #ffd246;
}
`
  
  interface StepperProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    initialStep?: number;
    onStepChange?: (step: number) => void;
    onFinalStepCompleted?: () => void;
    stepCircleContainerClassName?: string;
    stepContainerClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
    backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    backButtonText?: string;
    nextButtonText?: string;
    disableStepIndicators?: boolean;
    renderStepIndicator?: (props: RenderStepIndicatorProps) => ReactNode;
  }
  
  interface RenderStepIndicatorProps {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }
  
  const Stepper: React.FC<StepperProps> = ({
    children,
    initialStep = 1,
    onStepChange = () => {},
    onFinalStepCompleted = () => {},
    stepCircleContainerClassName = "",
    stepContainerClassName = "",
    contentClassName = "",
    footerClassName = "",
    backButtonProps = {},
    nextButtonProps = {},
    backButtonText = "Back",
    nextButtonText = "Continue",
    disableStepIndicators = false,
    renderStepIndicator,
    ...rest
  }) => {
    const [currentStep, setCurrentStep] = useState<number>(initialStep);
    const [direction, setDirection] = useState<number>(0);
    const stepsArray = Children.toArray(children);
    const totalSteps = stepsArray.length;
    const isCompleted = currentStep > totalSteps;
    const isLastStep = currentStep === totalSteps;
  
    const updateStep = (newStep: number) => {
      setCurrentStep(newStep);
      if (newStep > totalSteps) {
        onFinalStepCompleted();
      } else {
        onStepChange(newStep);
      }
    };
  
    const handleBack = () => {
      if (currentStep > 1) {
        setDirection(-1);
        updateStep(currentStep - 1);
      }
    };
  
    const handleNext = () => {
      if (!isLastStep) {
        setDirection(1);
        updateStep(currentStep + 1);
      }
    };
  
    const handleComplete = () => {
      setDirection(1);
      updateStep(totalSteps + 1);
    };
  
    return (
      <div className="outer-container" {...rest}>
        <div
          className={`step-circle-container ${stepCircleContainerClassName}`}
          style={{ border: "1px solid #222" }}
        >
          <div className={`step-indicator-row ${stepContainerClassName}`}>
            {stepsArray.map((_, index) => {
              const stepNumber = index + 1;
              const isNotLastStep = index < totalSteps - 1;
              return (
                <React.Fragment key={stepNumber}>
                  {renderStepIndicator ? (
                    renderStepIndicator({
                      step: stepNumber,
                      currentStep,
                      onStepClick: (clicked) => {
                        setDirection(clicked > currentStep ? 1 : -1);
                        updateStep(clicked);
                      },
                    })
                  ) : (
                    <StepIndicator
                      step={stepNumber}
                      disableStepIndicators={disableStepIndicators}
                      currentStep={currentStep}
                      onClickStep={(clicked) => {
                        setDirection(clicked > currentStep ? 1 : -1);
                        updateStep(clicked);
                      }}
                    />
                  )}
                  {isNotLastStep && (
                    <StepConnector isComplete={currentStep > stepNumber} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
  
          <StepContentWrapper
            isCompleted={isCompleted}
            currentStep={currentStep}
            direction={direction}
            className={`step-content-default ${contentClassName}`}
          >
            {stepsArray[currentStep - 1]}
          </StepContentWrapper>
  
          {!isCompleted && (
            <div className={`footer-container ${footerClassName}`}>
              <div className="footer-nav">
                {currentStep !== 1 ? (
                  <button
                    onClick={handleBack}
                    className="back-button"
                    {...backButtonProps}
                  >
                    {backButtonText}
                  </button>
                ) : (
                  <div></div> /* Empty div to maintain space on left when no Previous button */
                )}
                <button
                  onClick={isLastStep ? handleComplete : handleNext}
                  className="next-button"
                  {...nextButtonProps}
                >
                  {isLastStep ? "Complete" : nextButtonText}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default Stepper;
  
  interface StepContentWrapperProps {
    isCompleted: boolean;
    currentStep: number;
    direction: number;
    children: ReactNode;
    className?: string;
  }
  
  function StepContentWrapper({
    isCompleted,
    currentStep,
    direction,
    children,
    className,
  }: StepContentWrapperProps) {
    const [parentHeight, setParentHeight] = useState<number>(0);
  
    return (
      <motion.div
        className={className}
        style={{ position: "relative", overflow: "hidden" }}
        animate={{ height: isCompleted ? 0 : parentHeight }}
        transition={{ type: "spring", duration: 0.4 }}
      >
        <AnimatePresence initial={false} mode="sync" custom={direction}>
          {!isCompleted && (
            <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
              {children}
            </SlideTransition>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
  
  interface SlideTransitionProps {
    children: ReactNode;
    direction: number;
    onHeightReady: (h: number) => void;
  }
  
  function SlideTransition({ children, direction, onHeightReady }: SlideTransitionProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
  
    useLayoutEffect(() => {
      if (containerRef.current) {
        onHeightReady(containerRef.current.offsetHeight);
      }
    }, [children, onHeightReady]);
  
    return (
      <motion.div
        ref={containerRef}
        custom={direction}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.4 }}
        style={{ position: "absolute", left: 0, right: 0, top: 0 }}
      >
        {children}
      </motion.div>
    );
  }
  
  const stepVariants: Variants = {
    enter: (dir: number) => ({
      x: dir >= 0 ? "-100%" : "100%",
      opacity: 0,
    }),
    center: {
      x: "0%",
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir >= 0 ? "50%" : "-50%",
      opacity: 0,
    }),
  };
  
  interface StepProps {
    children: ReactNode;
  }
  
  export function Step({ children }: StepProps): JSX.Element {
    return <div className="step-default">{children}</div>;
  }
  
  interface StepIndicatorProps {
    step: number;
    currentStep: number;
    onClickStep: (step: number) => void;
    disableStepIndicators?: boolean;
  }
  
  function StepIndicator({
    step,
    currentStep,
    onClickStep,
    disableStepIndicators,
  }: StepIndicatorProps) {
    const status =
      currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";
  
    const handleClick = () => {
      if (step !== currentStep && !disableStepIndicators) {
        onClickStep(step);
      }
    };
  
    return (
      <>
      <style>{stepperStyles}</style>
      <motion.div
        onClick={handleClick}
        className="step-indicator"
        animate={status}
        initial={false}
      >
        <motion.div
          variants={{
            inactive: { scale: 1, backgroundColor: "#a46304", color: "#fefce8" },
            active: { scale: 1, backgroundColor: "#efb603", color: "black" },
            complete: { scale: 1, backgroundColor: "#efb603", color: "white" },
          }}
          transition={{ duration: 0.3 }}
          className="step-indicator-inner"
        >
          {status === "complete" ? (
            <CheckIcon className="check-icon" />
          ) : status === "active" ? (
            <div className="active-dot" />
          ) : (
            <span className="step-number">{step}</span>
          )}
        </motion.div>
      </motion.div>
      </>
    );
  }
  
  interface StepConnectorProps {
    isComplete: boolean;
  }
  
  function StepConnector({ isComplete }: StepConnectorProps) {
    const lineVariants: Variants = {
      incomplete: { width: 0, backgroundColor: "transparent" },
      complete: { width: "100%", backgroundColor: "#efb603" },
    };
  
    return (
      <div className="step-connector">
        <motion.div
          className="step-connector-inner"
          variants={lineVariants}
          initial={false}
          animate={isComplete ? "complete" : "incomplete"}
          transition={{ duration: 0.4 }}
        />
      </div>
    );
  }
  interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}
  
  function CheckIcon(props: CheckIconProps) {
    return (
      <svg {...props} fill="none" stroke="#fefce8" strokeWidth={2} viewBox="0 0 24 24">
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  }
  
  