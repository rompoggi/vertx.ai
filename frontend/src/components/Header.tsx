import React from 'react';
import Logo from './Logo.tsx';

const headerStyles = `
.app-header {
  width: 100%;
  background: linear-gradient(90deg,rgb(103, 33, 1) 0%, #FFBC1B 50%, rgb(103, 33, 1) 100%);
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 0;
}

.app-header::after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, #FFFBEA 0%, #432005 100%);
  pointer-events: none;
}

.logo {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #FFBC1B 0%, #E27100 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.menu {
  display: flex;
  align-items: center;
  gap: 24px;
}

.menu-link {
  color: #FFF2C5;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  margin-right: 8px;
  transition: color 0.2s;
}
.menu-link:hover {
  color: #FFD246;
}

.status {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #FFFBEA;
  margin-right: 16px;
}
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10B981;
  margin-right: 8px;
}

.get-started-btn {
  background: linear-gradient(90deg, #ffd246 0%, #e27100 100%);
  color: #222;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 1.1rem;
  font-weight: 600,
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  margin-left: 8px;
  boxShadow: '0 2px 12px rgba(226,113,0,0.12)';
}
.get-started-btn:hover {
  background: #FFBC1B;
  color: #BB4D02;
}
`;

const Header: React.FC = () => {
  return (
    <>
    <style>{headerStyles}</style>
    <header className="app-header">
      <Logo />
      <nav className="menu">
        <div className="status">
          <span className="status-dot" /> Up &amp; Running
        </div>
        <a className="menu-link" href="#docs">GitHub</a>
        <a className="menu-link" href="#signin">Demo</a>
        <button className="get-started-btn">Get Started</button>      </nav>
    </header>
    </>
  );
};

export default Header;
