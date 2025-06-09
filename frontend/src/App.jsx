import React, { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import ExtractForm from './components/ExtractForm';
import { Sun, Moon } from 'lucide-react'; // Import Lucide icons for theme toggle

function App() {
    // State to manage which tab is active: 'embed' or 'extract'
    const [activeTab, setActiveTab] = useState('embed');
    // State to manage dark mode, initialized from localStorage or defaults to false
    const [darkMode, setDarkMode] = useState(() => {
        try {
            const storedTheme = localStorage.getItem('theme');
            return storedTheme === 'dark';
        } catch (error) {
            console.warn("Failed to read theme from localStorage, defaulting to light mode:", error);
            return false; // Default to light mode if localStorage is inaccessible
        }
    });

    // Effect to apply/remove 'dark' class to the html element
    // and save preference to localStorage
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

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    return (
        // Main container div. The 'dark:' classes here will apply
        // dark mode styles to the overall background and text color when 'dark' class is on html.
        // Child components (UploadForm, ExtractForm) explicitly use light backgrounds (bg-white)
        // so their internal elements retain readability in dark mode, unless specifically
        // styled with dark: variants inside those components.
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800
                        dark:from-gray-900 dark:to-gray-800 dark:text-gray-100
                        p-4 sm:p-6 lg:p-8 flex flex-col items-center transition-colors duration-300">

            {/* Header and Logo Section */}
            <header className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg mb-8
                               flex flex-col items-center relative transition-colors duration-300">
                {/* QRMArk Logo SVG - Directly embedded for simplicity, can be moved to its own component */}
                <svg className="w-full max-w-sm h-auto mb-4" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradientQR" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#667eea" />
                            <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                        <linearGradient id="gradientEye" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38a3a5" />
                            <stop offset="100%" stopColor="#57cc99" />
                        </linearGradient>
                    </defs>
                    {/* Base for the 'Q' with QR pattern hints */}
                    <rect x="20" y="20" width="110" height="110" rx="15" fill="url(#gradientQR)"/>
                    {/* QR code-like patterns within the 'Q' area */}
                    <rect x="35" y="35" width="20" height="20" rx="3" fill="white" opacity="0.8"/>
                    <rect x="65" y="35" width="20" height="20" rx="3" fill="white" opacity="0.8"/>
                    <rect x="35" y="65" width="20" height="20" rx="3" fill="white" opacity="0.8"/>
                    <rect x="95" y="65" width="10" height="10" rx="2" fill="white" opacity="0.6"/>
                    <rect x="65" y="95" width="20" height="20" rx="3" fill="white" opacity="0.8"/>
                    {/* 'Eye' / Lens / Hidden data symbol inside the QR area */}
                    <circle cx="75" cy="75" r="20" fill="url(#gradientEye)" opacity="0.9"/>
                    <circle cx="75" cy="75" r="8" fill="#ffffff" opacity="0.95"/>
                    <path d="M75 55 L85 65 L75 95 L65 65 Z" fill="white" opacity="0.3"/> {/* Subtle lens flare/light effect */}
                    {/* Text "QRMArk" */}
                    {/* Adjusted text fill for dark mode readability, or use original colors if preferred */}
                    <text x="150" y="85" fontFamily="Inter, sans-serif" fontSize="60" fontWeight="800" fill={darkMode ? "#cbd5e0" : "#2d3748"}>
                        Q<tspan fill="url(#gradientQR)">R</tspan>M<tspan fill="url(#gradientEye)">Ark</tspan>
                    </text>
                    {/* Subtle underline/marker for "Ark" to signify marking an image */}
                    <rect x="280" y="95" width="100" height="6" rx="3" fill="#57cc99" opacity="0.7"/>
                    <rect x="280" y="105" width="100" height="2" rx="1" fill="#764ba2" opacity="0.5"/>
                </svg>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight text-center
                                dark:text-gray-100 transition-colors duration-300">
                    Invisible QR Watermarking
                </h1>
                <p className="text-lg text-gray-600 mt-2 text-center max-w-xl
                              dark:text-gray-300 transition-colors duration-300">
                    Seamlessly embed and extract hidden QR code data in your images.
                </p>

                {/* Dark mode toggle button */}
                <button
                    onClick={toggleDarkMode}
                    className="absolute top-6 right-6 p-2 rounded-full
                               bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                               hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                               transition-colors duration-300"
                    aria-label="Toggle light/dark mode"
                    title="Toggle light/dark mode"
                >
                    {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
            </header>

            {/* Navigation Tabs */}
            <nav className="w-full max-w-4xl bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg mb-8
                               flex flex-col sm:flex-row justify-center gap-4 transition-colors duration-300">
                <button
                    onClick={() => setActiveTab('embed')}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out
                        ${activeTab === 'embed'
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                >
                    Embed QR Code
                </button>
                <button
                    onClick={() => setActiveTab('extract')}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out
                        ${activeTab === 'extract'
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                >
                    Extract QR Code
                </button>
            </nav>

            {/* Main Content Area */}
            <main className="w-full max-w-4xl bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg
                             transition-colors duration-300 overflow-hidden"> {/* overflow-hidden to prevent layout shifts */}
                {/* Render the active component */}
                {activeTab === 'embed' && <UploadForm />}
                {activeTab === 'extract' && <ExtractForm />}
            </main>
        </div>
    );
}

export default App;
