import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

function ProcessingAnimation({ title = "Processing Image", description = "Embedding QR code invisibly..." }) {
    return (
        <div className="text-center py-12">
            <div className="relative mb-8">
                {/* Animated circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 border-4 border-indigo-400 dark:border-indigo-600 rounded-full animate-ping"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
                </div>
                
                {/* Center icon */}
                <div className="relative z-10 flex items-center justify-center w-32 h-32">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
                    <Sparkles className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                    {title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    {description}
                </p>

                {/* Progress dots */}
                <div className="flex justify-center space-x-2 mt-6">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>

                <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                    <p>Using advanced DWT technology in YCbCr color space</p>
                    <p className="mt-1">This may take a few seconds...</p>
                </div>
            </div>
        </div>
    );
}

export default ProcessingAnimation;