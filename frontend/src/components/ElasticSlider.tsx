import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const elasticSliderStyles = `
.slider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}

.slider-wrapper {
  display: flex;
  width: 100%;
  touch-action: none;
  user-select: none;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.slider-root {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 600px;
  flex-grow: 1;
  cursor: grab;
  touch-action: none;
  user-select: none;
  align-items: center;
  padding: 1rem 0;
}

.slider-root:active {
  cursor: grabbing;
}

.slider-track-wrapper {
  display: flex;
  flex-grow: 1;
}

.slider-track {
  position: relative;
  height: 100%;
  flex-grow: 1;
  overflow: hidden;
  border-radius: 9999px;
  background-color: rgba(128, 128, 128, 0.4);
}

.slider-range {
  position: absolute;
  height: 100%;
  background-color: #888;
  border-radius: 9999px;
}

.value-indicator {
  color: #808080;
  position: absolute;
  transform: translateY(-1rem);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.icon {
  width: 24px;
  height: 24px;
  color: #888;
}

.icon.dark {
  color: #ddd;
}
`

const MAX_OVERFLOW = 50;

interface ElasticSliderProps {
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  startingValue?: number;
  maxValue?: number;
  className?: string;
  isStepped?: boolean;
  stepSize?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (value: number | [number, number]) => void;
  renderValue?: (value: number | [number, number]) => React.ReactNode;
  title?: string;
}

const ElasticSlider: React.FC<ElasticSliderProps> = ({
  value,
  defaultValue = 50,
  startingValue = 0,
  maxValue = 100,
  className = "",
  isStepped = false,
  stepSize = 1,
  leftIcon = <RiArrowLeftSLine />,
  rightIcon = <RiArrowRightSLine />,
  onChange,
  renderValue,
  title,
}) => {
  return (
    <div className={`slider-container ${className}`}>
      <Slider
        value={value}
        defaultValue={defaultValue}
        startingValue={startingValue}
        maxValue={maxValue}
        isStepped={isStepped}
        stepSize={stepSize}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        onChange={onChange}
        renderValue={renderValue}
        title={title}
      />
    </div>
  );
};

interface SliderProps {
  value?: number | [number, number];
  defaultValue: number | [number, number];
  startingValue: number;
  maxValue: number;
  isStepped: boolean;
  stepSize: number;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  onChange?: (value: number | [number, number]) => void;
  renderValue?: (value: number | [number, number]) => React.ReactNode;
  title?: string;
}

const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  defaultValue,
  startingValue,
  maxValue,
  isStepped,
  stepSize,
  leftIcon,
  rightIcon,
  onChange,
  renderValue,
  title,
}) => {
  const isRange = Array.isArray(defaultValue);
  const [value, setValue] = useState<number | [number, number]>(
    controlledValue !== undefined ? controlledValue : defaultValue
  );
  const sliderRef = useRef<HTMLDivElement>(null);
  // const [region, setRegion] = useState<"left" | "middle" | "right">("middle");
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);
  const [activeHandle, setActiveHandle] = useState<0 | 1 | null>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useMotionValueEvent(clientX, "change", (latest: number) => {
    if (sliderRef.current) {
      const { left, right } = sliderRef.current.getBoundingClientRect();
      let newValue: number;
      if (latest < left) {
        // setRegion("left");
        newValue = left - latest;
      } else if (latest > right) {
        // setRegion("right");
        newValue = latest - right;
      } else {
        // setRegion("middle");
        newValue = 0;
      }
      overflow.jump(decay(newValue, MAX_OVERFLOW));
    }
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons > 0 && sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      let newValue =
        startingValue +
        ((e.clientX - left) / width) * (maxValue - startingValue);
      if (isStepped) {
        newValue = Math.round(newValue / stepSize) * stepSize;
      }
      newValue = Math.min(Math.max(newValue, startingValue), maxValue);
      setValue(newValue);
      if (onChange) onChange(newValue);
      clientX.jump(e.clientX);
    }
  };

  // const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
  //   handlePointerMove(e);
  //   e.currentTarget.setPointerCapture(e.pointerId);
  // };

  const handlePointerUp = () => {
    animate(overflow, 0, { type: "spring", bounce: 0.5 });
  };

  const getRangePercentage = (): number => {
    if (Array.isArray(value)) return 0;
    const totalRange = maxValue - startingValue;
    if (totalRange === 0) return 0;
    return ((value - startingValue) / totalRange) * 100;
  };

  const handlePointerDownRange = (handleIdx: 0 | 1) => (e: React.PointerEvent<HTMLDivElement>) => {
    setActiveHandle(handleIdx);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMoveRange = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeHandle !== null && sliderRef.current && isRange && Array.isArray(value)) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      let newValue =
        startingValue +
        ((e.clientX - left) / width) * (maxValue - startingValue);
      if (isStepped) {
        newValue = Math.round(newValue / stepSize) * stepSize;
      }
      newValue = Math.min(Math.max(newValue, startingValue), maxValue);
      let [min, max] = value;
      if (activeHandle === 0) {
        min = Math.min(newValue, max - stepSize);
      } else {
        max = Math.max(newValue, min + stepSize);
      }
      const nextValue: [number, number] = [min, max];
      setValue(nextValue);
      if (onChange) onChange(nextValue);
    }
  };

  const handlePointerUpRange = () => {
    setActiveHandle(null);
    animate(overflow, 0, { type: "spring", bounce: 0.5 });
  };


  return (
    <>
    <style>{elasticSliderStyles}</style>
      <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minWidth: 60 }}>
            <span className="range-value" style={{ marginBottom: 4 }}>{value[0].toFixed(1)}</span>
            <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '1rem' }}>{title}</div>
            <span className="range-value" style={{ marginBottom: 4 }}>{value[1].toFixed(1)}</span>
          </div>
    </div>
    {renderValue && renderValue(value)}
      <motion.div
        onHoverStart={() => animate(scale, 1.05)}
        onHoverEnd={() => animate(scale, 1)}
        onTouchStart={() => animate(scale, 1.05)}
        onTouchEnd={() => animate(scale, 1)}
        style={{
          scale,
          opacity: useTransform(scale, [1, 1.05], [0.7, 1]),
        }}
        className="slider-wrapper"
        ref={sliderRef}
        onPointerMove={isRange ? handlePointerMoveRange : handlePointerMove}
        onPointerUp={isRange ? handlePointerUpRange : handlePointerUp}
      >
        {leftIcon}
        <div className="slider-root">
          <motion.div
            className="slider-track-wrapper"
            style={{
              scaleX: 1,
              scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
              height: useTransform(scale, [1, 1.2], [6, 12]),
              marginTop: useTransform(scale, [1, 1.2], [0, -3]),
              marginBottom: useTransform(scale, [1, 1.2], [0, -3]),
            }}
          >
            <div className="slider-track">
              {isRange && Array.isArray(value) ? (
                <>
                  <div
                    className="slider-range"
                    style={{
                      left: `${((value[0] - startingValue) / (maxValue - startingValue)) * 100}%`,
                      width: `${((value[1] - value[0]) / (maxValue - startingValue)) * 100}%`,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: `calc(${((value[0] - startingValue) / (maxValue - startingValue)) * 100}% - 8px)`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: '#FFD246',
                      cursor: 'pointer',
                      border: '2px solid #333',
                    }}
                    onPointerDown={handlePointerDownRange(0)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: `calc(${((value[1] - startingValue) / (maxValue - startingValue)) * 100}% - 8px)`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: '#FFD246',
                      cursor: 'pointer',
                      border: '2px solid #333',
                    }}
                    onPointerDown={handlePointerDownRange(1)}
                  />
                </>
              ) : (
                <>
                  <div
                    className="slider-range"
                    style={{ width: `${getRangePercentage()}%` }}
                  />
                </>
              )}
            </div>
          </motion.div>
        </div>
        {rightIcon}
      </motion.div>
    </>
  );
};

function decay(value: number, max: number): number {
  if (max === 0) {
    return 0;
  }
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}

export default ElasticSlider;
