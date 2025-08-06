import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import EmbedWorkflow from './components/EmbedWorkflow';
import ExtractWorkflow from './components/ExtractWorkflow';
import { Sun, Moon } from 'lucide-react';

function App() {
    const [currentView, setCurrentView] = useState('hero'); // 'hero', 'embed', 'extract'
    const [darkMode, setDarkMode] = useState(() => {
        try {
            const storedTheme = localStorage.getItem('theme');
            return storedTheme === 'dark';
        } catch (error) {
            console.warn("Failed to read theme from localStorage, defaulting to light mode:", error);
            return false;
        }
    });

    useEffect(() => {
        const html = document.documentElement;
        if (darkMode) {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    const navigateToView = (view) => {
        setCurrentView(view);
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${
            darkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            <Header 
                currentView={currentView}
                onNavigate={navigateToView}
                darkMode={darkMode}
                onToggleDarkMode={toggleDarkMode}
            />
            
            <main className="relative">
                {currentView === 'hero' && (
                    <HeroSection onNavigate={navigateToView} />
                )}
                
                {currentView === 'embed' && (
                    <EmbedWorkflow onNavigate={navigateToView} />
                )}
                
                {currentView === 'extract' && (
                    <ExtractWorkflow onNavigate={navigateToView} />
                )}
            </main>
            
            <Footer />
        </div>
    );
}

export default App;