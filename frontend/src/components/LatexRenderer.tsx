import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface LatexRendererProps {
  text: string;
  displayMode?: boolean;
}

const LatexRenderer: React.FC<LatexRendererProps> = ({ text, displayMode = false }) => {
  // Split the text into LaTeX and non-LaTeX parts
  const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

  return (
    <div className="latex-renderer">
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          // Block math mode
          const math = part.slice(2, -2);
          return <BlockMath key={index} math={math} />;
        } else if (part.startsWith('$') && part.endsWith('$')) {
          // Inline math mode
          const math = part.slice(1, -1);
          return <InlineMath key={index} math={math} />;
        } else {
          // Regular text
          return <span key={index}>{part}</span>;
        }
      })}
    </div>
  );
};

export default LatexRenderer; 