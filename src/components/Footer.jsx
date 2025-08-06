import React from 'react';
import { Github, Linkedin, Heart, Code } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">QR</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                QRMark
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Real-time invisible QR watermarking platform using advanced DWT technology. 
                            Embed and extract QR codes seamlessly in your browser.
                        </p>
                    </div>

                    {/* Technology */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Built With</h3>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center">
                                <Code className="w-4 h-4 mr-2" />
                                React + Tailwind CSS
                            </div>
                            <div className="flex items-center">
                                <Code className="w-4 h-4 mr-2" />
                                FastAPI + OpenCV
                            </div>
                            <div className="flex items-center">
                                <Code className="w-4 h-4 mr-2" />
                                DWT in YCbCr Color Space
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Connect</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/dipanshumodi31/qrmark"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                title="GitHub Repository"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/dipanshu-modi-75bb57278/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                title="LinkedIn Profile"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 mx-1 text-red-500" />
                        <span>by Dipanshu Modi</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
                        © 2025 QRMark. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;