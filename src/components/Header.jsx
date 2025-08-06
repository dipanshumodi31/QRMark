import React from 'react';
import { Sun, Moon, Github, FileText } from 'lucide-react';

function Header({ currentView, onNavigate, darkMode, onToggleDarkMode }) {
    const navItems = [
        { id: 'hero', label: 'Home', active: currentView === 'hero' },
        { id: 'embed', label: 'Embed', active: currentView === 'embed' },
        { id: 'extract', label: 'Extract', active: currentView === 'extract' },
    ];

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div 
                        className="flex items-center cursor-pointer group"
                        onClick={() => onNavigate('hero')}
                    >
                        <img
                            src="/two.svg"
                            alt="QRMark Logo"
                            className="w-8 h-8 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200"
                        />
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            QRMark
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    item.active
                                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-3">
                        {/* External links */}
                        <a
                            href="https://github.com/dipanshumodi31/qrmark"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                            title="GitHub Repository"
                        >
                            <Github size={20} />
                        </a>
                        
                        {/* Dark mode toggle */}
                        <button
                            onClick={onToggleDarkMode}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                            title="Toggle theme"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <select
                                value={currentView}
                                onChange={(e) => onNavigate(e.target.value)}
                                className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300"
                            >
                                <option value="hero">Home</option>
                                <option value="embed">Embed</option>
                                <option value="extract">Extract</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;