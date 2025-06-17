import React, { useRef } from "react";

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const spotlightCardStyles = `
.card-spotlight {
  position: relative;
  border-radius: 1.5rem;
  border: 1px solid #222;
  background-color: #111;
  width: 400px;
  text-align: center;
  align: 'center';
  padding: 2rem;
  overflow: hidden;
  --mouse-x: 50%;
  --mouse-y: 50%;
  --spotlight-color: rgba(255, 255, 255, 0.05);
}
.card-spotlight::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 90%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.card-spotlight:hover::before,
.card-spotlight:focus-within::before {
  opacity: 0.6;
}
`;

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(225, 15, 15, 0.25)"
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };

  return (
    <>
      <style>{spotlightCardStyles}</style>
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        className={`card-spotlight ${className}`}
      >
        {children}
      </div>
    </>
  );
};

export default SpotlightCard;