import React, { useState } from 'react';
import { 
    Upload, Search, ArrowLeft, CheckCircle, XCircle, 
    Copy, ExternalLink, Share2, Eye 
} from 'lucide-react';
import StepIndicator from './StepIndicator';
import ImageUpload from './ImageUpload';
import CameraCapture from './CameraCapture';
import ProcessingAnimation from './ProcessingAnimation';

function ExtractWorkflow({ onNavigate }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [file, setFile] = useState(null);
    const [decodedData, setDecodedData] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const steps = [
        { number: 1, title: 'Upload Image', description: 'Choose watermarked image' },
        { number: 2, title: 'Extract', description: 'Decode hidden QR data' },
        { number: 3, title: 'Result', description: 'View extracted content' }
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
        handleExtract(selectedFile);
    };

    const handleExtract = async (fileToProcess = file) => {
        if (!fileToProcess) {
            showMessage('Please select an image to extract from.', 'error');
            return;
        }

        setLoading(true);
        setDecodedData('');

        const formData = new FormData();
        formData.append('file', fileToProcess);

        try {
            const response = await fetch('https://qrmark-backend.onrender.com/extract', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.data) {
                setDecodedData(result.data);
                setCurrentStep(3);
                showMessage('QR code extracted successfully!', 'success');
            } else {
                setDecodedData('');
                showMessage('No QR code found in this image. Make sure it contains embedded data.', 'error');
                setCurrentStep(1);
            }
        } catch (error) {
            console.error("Extraction error:", error);
            setDecodedData('');
            showMessage(`Extraction failed: ${error.message}`, 'error');
            setCurrentStep(1);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(decodedData).then(() => {
            showMessage('Content copied to clipboard!', 'success');
        });
    };

    const openInNewTab = () => {
        if (decodedData.startsWith('http://') || decodedData.startsWith('https://')) {
            window.open(decodedData, '_blank');
        } else {
            showMessage('Content is not a valid URL', 'error');
        }
    };

    const shareContent = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'QRMark Extracted Content',
                    text: decodedData,
                });
            } catch (err) {
                copyToClipboard();
            }
        } else {
            copyToClipboard();
        }
    };

    const resetWorkflow = () => {
        setCurrentStep(1);
        setFile(null);
        setDecodedData('');
        setMessage('');
    };

    const isUrl = decodedData && (decodedData.startsWith('http://') || decodedData.startsWith('https://'));

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => onNavigate('hero')}
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </button>
                    
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Extract QR Code
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
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl mb-4">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Choose Watermarked Image
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Upload an image that contains embedded QR data
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <ImageUpload onFileSelect={handleFileSelect} />
                                <CameraCapture onFileSelect={handleFileSelect} />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Processing */}
                    {currentStep === 2 && loading && (
                        <div className="p-8">
                            <ProcessingAnimation 
                                title="Extracting QR Code"
                                description="Analyzing image for hidden QR data..."
                            />
                        </div>
                    )}

                    {/* Step 3: Results */}
                    {currentStep === 3 && decodedData && (
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl mb-4">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    QR Code Extracted!
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Successfully decoded hidden data from your image
                                </p>
                            </div>

                            {/* Image Preview */}
                            {file && (
                                <div className="mb-8 text-center">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Processed"
                                        className="max-w-full h-auto max-h-64 mx-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
                                    />
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Source: {file.name}
                                    </p>
                                </div>
                            )}

                            {/* Extracted Content */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Eye className="w-5 h-5 mr-2" />
                                    Extracted Content
                                </h3>
                                <div className="bg-gray-800 dark:bg-gray-950 text-green-400 p-4 rounded-xl font-mono text-sm break-all whitespace-pre-wrap">
                                    {decodedData}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    <Copy className="w-5 h-5 mr-2" />
                                    Copy Content
                                </button>

                                {isUrl && (
                                    <button
                                        onClick={openInNewTab}
                                        className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        <ExternalLink className="w-5 h-5 mr-2" />
                                        Open URL
                                    </button>
                                )}

                                <button
                                    onClick={shareContent}
                                    className="flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    <Share2 className="w-5 h-5 mr-2" />
                                    Share
                                </button>
                            </div>

                            {/* Try Another Button */}
                            <div className="text-center mt-8">
                                <button
                                    onClick={resetWorkflow}
                                    className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                                >
                                    Extract from another image
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExtractWorkflow;