import React, { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import ExtractForm from './components/ExtractForm';
import { Sun, Moon } from 'lucide-react'; // Import Lucide icons for theme toggle

function App() {
    const [activeTab, setActiveTab] = useState('embed');
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

    // Determine current theme colors based on darkMode state
    const currentTheme = darkMode ? {
        bg: 'bg-qr-dark-bg',
        sidebarBg: 'bg-qr-sidebar-dark',
        mainBg: 'bg-qr-main-dark',
        text: 'text-qr-text-light',
        primaryAccent: 'text-qr-primary-accent',
        buttonBg: 'bg-qr-primary-accent', // Active button background
        buttonText: 'text-qr-btn-text-dark-contrast', // Active button text
        shadow: 'shadow-2xl'
    } : {
        bg: 'bg-qr-light-bg',
        sidebarBg: 'bg-qr-sidebar-light',
        mainBg: 'bg-qr-main-light',
        text: 'text-qr-text-dark',
        primaryAccent: 'text-qr-primary-light-accent',
        buttonBg: 'bg-qr-primary-light-accent',
        buttonText: 'text-qr-btn-text-light-contrast',
        shadow: 'shadow-lg'
    };

    return (
        // Main container: Ensure it's a flex container that stretches vertically
        // and its children (sidebar and main content) can grow.
        <div className={`min-h-screen flex flex-col lg:flex-row ${currentTheme.bg} ${currentTheme.text} font-inter transition-colors duration-300`}>

            {/* Sidebar / Mobile Top Navigation */}
            {/* Added flex-grow lg:flex-grow to make it expand vertically alongside main content */}
            <nav className={`w-full lg:w-64 xl:w-72 flex-shrink-0
                            ${currentTheme.sidebarBg} ${currentTheme.shadow}
                            px-6 py-6 rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl
                            flex flex-col lg:items-start transition-colors duration-300
                            lg:py-10 // Adjusted padding to match main content's top alignment
                            flex-grow lg:flex-grow-0 // Added flex-grow for mobile, reset for desktop
                            `}>
                {/* QRMark Title */}
                {/* Re-added margin-bottom for desktop to push buttons down from the title */}
                <h1 className={`font-bold text-5xl lg:text-4xl xl:text-5xl ${currentTheme.primaryAccent} transition-colors duration-300 text-center lg:text-left mb-4 lg:mb-20`}>
                    QRMark
                </h1>
                
                {/* Navigation Links - Horizontal on mobile, Vertical on desktop */}
                {/* Removed lg:mt-auto lg:mb-auto to prevent vertical centering */}
                {/* You can now adjust vertical position using 'mt-X' or 'pt-X' here if needed */}
                <div className="flex flex-row lg:flex-col gap-3 w-full justify-center lg:justify-start">
                    <button
                        onClick={() => setActiveTab('embed')}
                        className={`py-3 px-4 rounded-lg font-semibold text-lg whitespace-nowrap
                                    transition-all duration-300 ease-in-out
                                    ${activeTab === 'embed'
                                        ? `${currentTheme.buttonBg} ${currentTheme.buttonText} shadow-md` // Active state
                                        : `bg-transparent text-gray-700 hover:bg-qr-btn-hover-light` + // Light mode inactive
                                          ` dark:bg-qr-sidebar-dark dark:text-gray-200 dark:hover:bg-qr-btn-hover-dark` // Dark mode inactive
                                    }`}
                    >
                        Embed QR Code
                    </button>
                    <button
                        onClick={() => setActiveTab('extract')}
                        className={`py-3 px-4 rounded-lg font-semibold text-lg whitespace-nowrap
                                    transition-all duration-300 ease-in-out
                                    ${activeTab === 'extract'
                                        ? `${currentTheme.buttonBg} ${currentTheme.buttonText} shadow-md` // Active state
                                        : `bg-transparent text-gray-700 hover:bg-qr-btn-hover-light` + // Light mode inactive
                                          ` dark:bg-qr-sidebar-dark dark:text-gray-200 dark:hover:bg-qr-btn-hover-dark` // Dark mode inactive
                                    }`}
                    >
                        Extract QR Code
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            {/* Added flex-grow to ensure main content always grows to fill available space */}
            <main className={`flex-1 w-full overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center h-full`}>
                <div className={`
                    ${currentTheme.mainBg} ${currentTheme.shadow}
                    p-6 sm:p-8 lg:p-10 rounded-2xl relative flex flex-col w-full max-w-4xl // Added w-full max-w-4xl to control card width
                `}>
                    {/* Header for main content */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-2xl sm:text-3xl font-extrabold flex-1 text-gray-800 dark:text-gray-100`}>
                            {activeTab === 'embed' ? 'Embed QR Code into Image' : 'Extract QR Code from Image'}
                        </h2>
                        {/* Dark mode toggle button */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full
                                       bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                                       hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                                       transition-colors duration-300 flex-shrink-0"
                            aria-label="Toggle light/dark mode"
                            title="Toggle light/dark mode"
                        >
                            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                        </button>
                    </div>

                    {/* Content for the active tab */}
                    <div className="flex-1"> {/* This div ensures the forms take available space */}
                        {activeTab === 'embed' && <UploadForm />}
                        {activeTab === 'extract' && <ExtractForm />}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
