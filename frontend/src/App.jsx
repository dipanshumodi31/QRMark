import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import ExtractForm from './components/ExtractForm';

function App() {
  const [activeTab, setActiveTab] = useState('embed');
  const [darkMode, setDarkMode] = useState(true);

  // Define theme colors
  const themes = {
    dark: {
      background: '#121212',
      sidebarBg: '#1f1f1f',
      mainBg: '#222',
      text: '#e0e0e0',
      primary: '#4fc3f7',
      buttonText: '#121212',
      buttonBg: '#4fc3f7',
      buttonHoverBg: '#333',
      boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
    },
    light: {
      background: '#f5f5f5',
      sidebarBg: '#e0e0e0',
      mainBg: '#fff',
      text: '#121212',
      primary: '#0077cc',
      buttonText: '#fff',
      buttonBg: '#0077cc',
      buttonHoverBg: '#005fa3',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    },
  };

  const theme = darkMode ? themes.dark : themes.light;

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: theme.background,
        color: theme.text,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Sidebar */}
      <nav
        style={{
          width: '240px',
          backgroundColor: theme.sidebarBg,
          boxShadow: `2px 0 8px rgba(0,0,0,${darkMode ? '0.8' : '0.3'})`,
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          transition: 'all 0.3s ease',
        }}
      >
        <h1
          style={{
            marginBottom: '2.5rem',
            fontWeight: '700',
            fontSize: '3rem',
            color: theme.primary,
            userSelect: 'none',
            transition: 'color 0.3s ease',
          }}
        >
          QRMark
        </h1>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle light/dark mode"
          title="Toggle light/dark mode"
          style={{
            position: "absolute",
            top: "2rem",
            right: "2.2rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >{darkMode ? (
            // Moon icon for dark mode
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill={theme.buttonBg}
              viewBox="0 0 21 21"
              
            >
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            </svg>
          ) : (
            // Sun icon for light mode
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill={theme.buttonBg}
            viewBox="0 0 24 24"
            >
            <circle cx="12" cy="12" r="5" />
            <g stroke={theme.buttonBg} strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
            </g>
            </svg>
          )}
        </button>

        {/* Tabs */}
        {['embed', 'extract'].map((tab) => {
          const label = tab === 'embed' ? 'Embed QR Code' : 'Extract QR Code';
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: isActive ? theme.buttonBg : 'transparent',
                border: 'none',
                color: isActive ? theme.buttonText : (darkMode ? '#bbb' : '#444'),
                cursor: 'pointer',
                borderRadius: '8px',
                fontWeight: isActive ? '700' : '500',
                fontSize: '1rem',
                textAlign: 'left',
                boxShadow: isActive
                  ? `0 4px 12px ${theme.buttonBg}AA`
                  : 'none',
                transition:
                  'background-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = theme.buttonHoverBg;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main
        style={{
          flexGrow: 1,
          padding: '2.5rem 3rem',
          overflowY: 'auto',
          backgroundColor: theme.mainBg,
          margin: '1.5rem',
          borderRadius: '16px',
          boxShadow: theme.boxShadow,
          transition: 'all 0.3s ease',
        }}
      >
        {activeTab === 'embed' && <UploadForm darkMode={darkMode} />}
        {activeTab === 'extract' && <ExtractForm darkMode={darkMode} />}
      </main>
    </div>
  );
}

export default App;
