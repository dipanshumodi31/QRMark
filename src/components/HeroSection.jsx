import React, { useEffect, useState } from 'react';
import { ArrowRight, Zap, Shield, Camera, Download, Sparkles } from 'lucide-react';

function HeroSection({ onNavigate }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Real-Time Processing",
            description: "Instant QR embedding and extraction in your browser"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Invisible Watermarks",
            description: "DWT-based embedding in YCbCr color space"
        },
        {
            icon: <Camera className="w-6 h-6" />,
            title: "Camera Integration",
            description: "Capture images directly or upload existing ones"
        }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className={`text-center transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8 animate-bounce">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Advanced DWT Watermarking Technology
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Real-Time Invisible
                        </span>
                        <br />
                        QR Watermarking
                        <br />
                        <span className="text-gray-600 dark:text-gray-300 text-3xl sm:text-4xl lg:text-5xl">
                            in Your Browser
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Upload or capture an image, embed a QR code invisibly using advanced DWT technology, 
                        and verify extraction — even after print-scan cycles. All processing happens locally in your browser.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <button
                            onClick={() => onNavigate('embed')}
                            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                            Start Embedding
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <button
                            onClick={() => onNavigate('extract')}
                            className="group inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            <Camera className="w-5 h-5 mr-2" />
                            Try Extraction
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Demo Preview */}
                <div className={`mt-20 transition-all duration-1000 delay-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                See QRMark in Action
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Watch how invisible QR codes are embedded and extracted
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="text-center">
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 mb-4 min-h-[200px] flex items-center justify-center">
                                    <div className="text-gray-500 dark:text-gray-400">
                                        <Camera className="w-16 h-16 mx-auto mb-4" />
                                        <p className="font-medium">Original Image</p>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Before Embedding</h3>
                            </div>
                            
                            <div className="text-center">
                                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-2xl p-8 mb-4 min-h-[200px] flex items-center justify-center">
                                    <div className="text-indigo-600 dark:text-indigo-400">
                                        <Shield className="w-16 h-16 mx-auto mb-4" />
                                        <p className="font-medium">QR Embedded</p>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">After Embedding</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;