import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const chromaGridStyles = `
.chroma-grid {
  position: relative;
  width: 80%;
  // max-width: 80vw;
  height: 100%;
  // min-height: 500px;
  display: grid;
  grid-template-columns: repeat(var(--cols, 1), 1fr);
  grid-auto-rows: auto;
  justify-content: center;
  gap: 0.75rem;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;

  --x: 50%;
  --y: 50%;
  --r: 320px;
}

@media (min-width: 1601px) {
  .chroma-grid {
    --cols: 5;
    grid-template-columns: repeat(5, 320px);
    gap: 0.75rem;
    padding: 0.5rem;
  }
}

@media (max-width: 1600px) and (min-width: 971px) {
  .chroma-grid {
    --cols: 3;
    grid-template-columns: repeat(3, 320px);
    gap: 0.75rem;
    padding: 0.5rem;
  }
}

@media (max-width: 970px) {
  .chroma-grid {
    --cols: 1;
    grid-template-columns: 320px;
    gap: 0.75rem;
    padding: 0.5rem;
  }
}

.chroma-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 320px;
  min-height: 500px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #333;
  transition: border-color 0.3s ease;
  background: var(--card-gradient);
  
  --mouse-x: 50%;
  --mouse-y: 50%;
  --spotlight-color: rgba(255, 255, 255, 0.3);
}

.chroma-card:hover {
  /* border-color: var(--card-border); */
  border-color: #ffd21f;
}

.chroma-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--mouse-x) var(--mouse-y),
      var(--spotlight-color),
      transparent 70%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2;
}

.chroma-card:hover::before {
  opacity: 1;
}

.chroma-img-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 70%;
  flex: 0 0 75%;
  padding: 10px 10px 0px 10px;
  overflow: hidden;
  background: transparent;
  transition: background 0.3s ease;
}

.chroma-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
  display: block;
}

.chroma-info {
  position: relative;
  z-index: 1;
  padding: 0.75rem 1rem;
  color: #fff;
  font-family: system-ui, sans-serif;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto auto auto;
  row-gap: 0.25rem;
  column-gap: 0.75rem;
  align-items: center;
}

.first-name {
  font-weight: bold;
  font-size: 1.1rem;
}

.family-name {
  font-weight: bold;
  font-size: 1.1rem;
  grid-column: 1 / 2;
}

.handle {
  color: #aaa;
  justify-self: end;
  font-size: 1rem;
}

.role {
  color: #aaa;
  grid-column: 1 / span 2;
  font-size: 1rem;
}

.chroma-divider {
  grid-column: 1 / span 2;
  border: none;
  border-top: 1px solid rgba(255,255,255,0.15);
  margin: 0.25rem 0 0.5rem 0;
  height: 0;
}

.chroma-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  /* backdrop-filter: grayscale(1) brightness(0.78); */
  /* -webkit-backdrop-filter: grayscale(1) brightness(0.78); */
  /* background: rgba(0, 0, 0, 0.001); */
  background: var(--card-gradient);
  /* mask-image: radial-gradient(circle var(--r) at var(--x) var(--y),
      transparent 0%,
      transparent 15%,
      rgba(0, 0, 0, 0.10) 30%,
      rgba(0, 0, 0, 0.22) 45%,
      rgba(0, 0, 0, 0.35) 60%,
      rgba(0, 0, 0, 0.50) 75%,
      rgba(0, 0, 0, 0.68) 88%,
      white 100%);
  -webkit-mask-image: radial-gradient(circle var(--r) at var(--x) var(--y),
      transparent 0%,
      transparent 15%,
      rgba(0, 0, 0, 0.10) 30%,
      rgba(0, 0, 0, 0.22) 45%,
      rgba(0, 0, 0, 0.35) 60%,
      rgba(0, 0, 0, 0.50) 75%,
      rgba(0, 0, 0, 0.68) 88%,
      white 100%); */
}

.chroma-fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  /* backdrop-filter: grayscale(1) brightness(0.78); */
  /* -webkit-backdrop-filter: grayscale(1) brightness(0.78); */
  /* background: rgba(0, 0, 0, 0.001); */
  /* background: var(--card-gradient); */


  mask-image: radial-gradient(circle var(--r) at var(--x) var(--y),
      white 0%,
      /* white 15%, */
      /* rgba(255, 255, 255, 0.90) 30%, */
      /* rgba(255, 255, 255, 0.78) 45%, */
      /* rgba(255, 255, 255, 0.65) 60%, */
      /* rgba(255, 255, 255, 0.50) 75%, */
      /* rgba(255, 255, 255, 0.32) 88%, */
      transparent 100%);
  -webkit-mask-image: radial-gradient(circle var(--r) at var(--x) var(--y),
      white 0%,
      /* white 15%, */
      /* rgba(255, 255, 255, 0.90) 30%, */
      /* rgba(255, 255, 255, 0.78) 45%, */
      /* rgba(255, 255, 255, 0.65) 60%, */
      /* rgba(255, 255, 255, 0.50) 75%, */
      /* rgba(255, 255, 255, 0.32) 88%, */
      transparent 100%);

  opacity: 1;
  transition: opacity 0.25s ease;
}

.chroma-blank-row {
  grid-column: 1 / span 2;
  height: 1.2rem;
  display: block;
  content: "";
}

.chroma-name-block {
  min-height: 2.4em; /* enough for two lines */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
`;

export interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
}

export interface ChromaGridProps {
  items?: ChromaItem[];
  color?: string;
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}


type SetterFn = (v: number | string) => void;

export const ChromaGrid: React.FC<ChromaGridProps> = ({
  color ="orange",
  className = "",
  radius = 300,
  columns = 5,
  rows = 1,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const colorGrid: ChromaItem[] = [
    {
    image: "https://media.licdn.com/dms/image/v2/D4E03AQHgM8-b6YnEWA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720511882437?e=1755129600&v=beta&t=PORD_vegfkC7MhFf6qu2hSmz5xmEyRjZO_IwqBNEwZY",
    title: "Romain Poggi",
    subtitle: "Student",
    handle: "@rompoggi",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #4F46E5, #000)",
    url: "https://github.com/sarahjohnson"
  },
  {
    image: "https://media.licdn.com/dms/image/v2/D4E03AQGogY0h_hDZEA/profile-displayphoto-crop_800_800/B4EZdvwHV3GcAI-/0/1749926573991?e=1755734400&v=beta&t=oKsmvPJau6lLtvDBQ4LhmOCFNtQNyfhUcRuJ-gfPXbA",
    title: "Octave Gaspard",
    subtitle: "Student",
    handle: "@octavegaspard",
    borderColor: "#10B981",
    gradient: "linear-gradient(210deg, #10B981, #000)",
    url: "https://linkedin.com/in/mikechen"
  },
  {
    image: "https://media.licdn.com/dms/image/v2/C4E03AQHBP-RcilWHyQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1644261388068?e=1755129600&v=beta&t=yUh1nlajPhTOHdEz5PSxUFtgJ2-w_V48TKuFfwgA4iI",
    title: "Thomas Turkieh",
    subtitle: "Student",
    handle: "@thomas-turkieh",
    borderColor: "#10B981",
    gradient: "linear-gradient(165deg, #F59E0B, #000)",
    url: "https://linkedin.com/in/mikechen"
  },
  {
    image: "https://minio.binets.fr/sigma-prod/pictures/users/vianney.gauthier?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=sigma-prod%2F20250613%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250613T204148Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=47164d516f59234c50859beae7b5d00da2d2baabcf881cd732773b2fa18ae87a",
    title: "Vianney Gauthier",
    subtitle: "Student",
    handle: "@vianney-gauthier",
    borderColor: "#10B981",
    gradient: "linear-gradient(195deg, #EF4444, #000)",
    url: "https://linkedin.com/in/mikechen"
  },
  {
    image: "https://media.licdn.com/dms/image/v2/D4E03AQGUTwMLs-47BQ/profile-displayphoto-shrink_800_800/B4EZa6zHZ5HwAg-/0/1746890684558?e=1755129600&v=beta&t=M3x-9JWmLN5uFN1T-VQeS6TvT43huC5Jb_c8Prd-gSU",
    title: "Andrea Signoretti",
    subtitle: "Student",
    handle: "@andrea-signoretti",
    borderColor: "#10B981",
    gradient: "linear-gradient(225deg, #8B5CF6, #000)",
    url: "https://linkedin.com/in/mikechen"
  }
];

const orangeGrid: ChromaItem[] = [
    {
    image: "https://media.licdn.com/dms/image/v2/D4E03AQHgM8-b6YnEWA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720511882437?e=1755129600&v=beta&t=PORD_vegfkC7MhFf6qu2hSmz5xmEyRjZO_IwqBNEwZY",
    title: "Romain Poggi",
    subtitle: "Student",
    handle: "@rompoggi",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #FFE585, #000)",
    url: "https://www.linkedin.com/in/romain-poggi-95696323a/"
  },
  {
    image: "https://media.licdn.com/dms/image/v2/D4E03AQGogY0h_hDZEA/profile-displayphoto-crop_800_800/B4EZdvwHV3GcAI-/0/1749926573991?e=1755734400&v=beta&t=oKsmvPJau6lLtvDBQ4LhmOCFNtQNyfhUcRuJ-gfPXbA",
    title: "Octave Gaspard",
    subtitle: "Student",
    handle: "@octavegaspard",
    borderColor: "#10B981",
    gradient: "linear-gradient(210deg, #FFD246, #000)",
    url: "https://www.linkedin.com/in/octave-g-b47b93264/"
  },
  {
    image: "https://media.licdn.com/dms/image/v2/C4E03AQHBP-RcilWHyQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1644261388068?e=1755129600&v=beta&t=yUh1nlajPhTOHdEz5PSxUFtgJ2-w_V48TKuFfwgA4iI",
    title: "Thomas Turkieh",
    subtitle: "Student",
    handle: "@thomas-turkieh",
    borderColor: "#10B981",
    gradient: "linear-gradient(165deg, #FFBC1B, #000)",
    url: "https://media.licdn.com/dms/image/v2/C4E03AQHBP-RcilWHyQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1644261388068?e=1755734400&v=beta&t=VKUlEWRNLx4eucjgFd_TgrjoZOkAEvBS0L4tzad6UTU"
  },
  {
    image: "https://minio.binets.fr/sigma-prod/pictures/users/vianney.gauthier?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=sigma-prod%2F20250613%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250613T204148Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=47164d516f59234c50859beae7b5d00da2d2baabcf881cd732773b2fa18ae87a",
    title: "Vianney Gauthier",
    subtitle: "Student",
    handle: "@vianney-gauthier",
    borderColor: "#10B981",
    gradient: "linear-gradient(195deg, #FC9700, #000)",
    url: "https://www.linkedin.com/in/vianney-gauthier-42b308334/"
  },
  {
    image: "https://media.licdn.com/dms/image/v2/D4E03AQGUTwMLs-47BQ/profile-displayphoto-shrink_800_800/B4EZa6zHZ5HwAg-/0/1746890684558?e=1755129600&v=beta&t=M3x-9JWmLN5uFN1T-VQeS6TvT43huC5Jb_c8Prd-gSU",
    title: "Andrea Signoretti",
    subtitle: "Student",
    handle: "@andrea-signoretti",
    borderColor: "#10B981",
    gradient: "linear-gradient(225deg, #E27100, #000)",
    url: "https://www.linkedin.com/in/andrea-signoretti-a17093230/"
  }
  ];

  let data: ChromaItem[];
  if (color === 'orange') {
    data = orangeGrid;
  } else {
    data = colorGrid;
  }

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px") as SetterFn;
    setY.current = gsap.quickSetter(el, "--y", "px") as SetterFn;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <>
    <style>{chromaGridStyles}</style>
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--cols": columns,
          "--rows": rows,
        } as React.CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => {
        const [firstName, ...rest] = c.title.split(' ');
        const familyName = rest.join(' ');
        return (
          <article
            key={i}
            className="chroma-card"
            onMouseMove={handleCardMove}
            onClick={() => handleCardClick(c.url)}
            style={
              {
                "--card-border": c.borderColor || "transparent",
                "--card-gradient": c.gradient,
                cursor: c.url ? "pointer" : "default",
              } as React.CSSProperties
            }
          >
            <div className="chroma-img-wrapper">
              <img src={c.image} alt={c.title} loading="lazy" />
            </div>
            <footer className="chroma-info">
              <span className="chroma-name-block">
                <span className="first-name">{firstName}</span>
                <span className="family-name">{familyName}</span>
              </span>
              <span className="handle">{c.handle}</span>
              <span className="chroma-blank-row"></span>
              <span className="role" style={{ gridColumn: "1 / span 2" }}>
                Student @ Ecole Polytechnique
              </span>
            </footer>
          </article>
        );
      })}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
    </>
  );
};

export default ChromaGrid; 