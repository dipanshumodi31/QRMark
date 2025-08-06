import React, { useState, useRef, useEffect } from 'react';
import { 
    Upload, Camera, Type, Zap, Download, ArrowLeft, 
    CheckCircle, XCircle, Eye, EyeOff, Copy, Sparkles 
} from 'lucide-react';
import StepIndicator from './StepIndicator';
import ImageUpload from './ImageUpload';
import CameraCapture from './CameraCapture';
import ProcessingAnimation from './ProcessingAnimation';

function EmbedWorkflow({ onNavigate }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [file, setFile] = useState(null);
    const [qrData, setQrData] = useState('');
    const [alpha, setAlpha] = useState(12);
    const [outputUrl, setOutputUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showCamera, setShowCamera] = useState(false);

    const steps = [
        { number: 1, title: 'Upload Image', description: 'Choose or capture an image' },
        { number: 2, title: 'Enter Data', description: 'Add text or URL to embed' },
        { number: 3, title: 'Process', description: 'Embed QR invisibly' },
        { number: 4, title: 'Download', description: 'Get your watermarked image' }
    ];

    const showMessage = (msg, type = 'info') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 4000);
    };

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile);
        setCurrentStep(2);
        showMessage('Image uploaded successfully!', 'success');
    };

    const handleNext = () => {
        if (currentStep === 2 && qrData.trim()) {
            setCurrentStep(3);
            handleEmbed();
        }
    };

    const handleEmbed = async () => {
        if (!file || !qrData) {
            showMessage('Please select an image and enter QR data.', 'error');
            return;
        }

        setLoading(true);
        setOutputUrl(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('qr_data', qrData);
        formData.append('alpha', alpha);

        try {
            const response = await fetch('https://qrmark-backend.onrender.com/embed', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setOutputUrl(imageUrl);
            setCurrentStep(4);
            showMessage('QR code embedded successfully!', 'success');
        } catch (err) {
            console.error("Embedding error:", err);
            showMessage(`Failed to process image: ${err.message}`, 'error');
            setCurrentStep(2);
        } finally {
            setLoading(false);
        }
    };

    const copyQrData = () => {
        navigator.clipboard.writeText(qrData).then(() => {
            showMessage('QR data copied to clipboard!', 'success');
        });
    };

    const resetWorkflow = () => {
        setCurrentStep(1);
        setFile(null);
        setQrData('');
        setOutputUrl(null);
        setShowComparison(false);
        setMessage('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => onNavigate('hero')}
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </button>
                    
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Embed QR Code
                    </h1>
                    
                    <button
                        onClick={resetWorkflow}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        Reset
                    </button>
                </div>

                {/* Step Indicator */}
                <StepIndicator steps={steps} currentStep={currentStep} />

                {/* Message Display */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
                        messageType === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700' :
                        messageType === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                    }`}>
                        {messageType === 'success' && <CheckCircle className="w-5 h-5" />}
                        {messageType === 'error' && <XCircle className="w-5 h-5" />}
                        <span className="font-medium">{message}</span>
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Step 1: Upload Image */}
                    {currentStep === 1 && (
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl mb-4">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Choose Your Image
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Upload an existing image or capture one with your camera
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <ImageUpload onFileSelect={handleFileSelect} />
                                <CameraCapture onFileSelect={handleFileSelect} />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Enter QR Data */}
                    {currentStep === 2 && (
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl mb-4">
                                    <Type className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Enter QR Data
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Add the text or URL you want to embed invisibly
                                </p>
                            </div>

                            {/* Image Preview */}
                            {file && (
                                <div className="mb-8 text-center">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Selected"
                                        className="max-w-full h-auto max-h-64 mx-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
                                    />
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Selected: {file.name}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* QR Data Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        QR Code Data
                                    </label>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={qrData}
                                            onChange={(e) => setQrData(e.target.value)}
                                            placeholder="Enter URL, text, or any data to embed..."
                                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                                        />
                                        <button
                                            onClick={copyQrData}
                                            disabled={!qrData}
                                            className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Copy className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Alpha Slider */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Embedding Strength: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{alpha}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="50"
                                        value={alpha}
                                        onChange={(e) => setAlpha(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span>Subtle</span>
                                        <span>Strong</span>
                                    </div>
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={handleNext}
                                    disabled={!qrData.trim()}
                                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                                >
                                    <Zap className="w-5 h-5 mr-2" />
                                    Embed QR Code
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Processing */}
                    {currentStep === 3 && loading && (
                        <div className="p-8">
                            <ProcessingAnimation />
                        </div>
                    )}

                    {/* Step 4: Download Result */}
                    {currentStep === 4 && outputUrl && (
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl mb-4">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    QR Code Embedded Successfully!
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Your image now contains an invisible QR code
                                </p>
                            </div>

                            {/* Image Comparison */}
                            <div className="mb-8">
                                <div className="flex items-center justify-center mb-4">
                                    <button
                                        onClick={() => setShowComparison(!showComparison)}
                                        className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        {showComparison ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                        {showComparison ? 'Hide' : 'Show'} Comparison
                                    </button>
                                </div>

                                {showComparison ? (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="text-center">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Original</h3>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Original"
                                                className="w-full h-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">With QR Embedded</h3>
                                            <img
                                                src={outputUrl}
                                                alt="Watermarked"
                                                className="w-full h-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <img
                                            src={outputUrl}
                                            alt="Watermarked Result"
                                            className="max-w-full h-auto max-h-96 mx-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Download Button */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href={outputUrl}
                                    download="qrmark-embedded.png"
                                    className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Download Image
                                </a>
                                
                                <button
                                    onClick={() => onNavigate('extract')}
                                    className="flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Test Extraction
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmbedWorkflow;