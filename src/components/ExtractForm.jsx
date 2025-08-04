import React, { useState, useEffect, useRef } from 'react';
import DecodedQRDisplay from './DecodedQRDisplay'; // Assuming this component exists and is functional
import { UploadCloud, ScanLine, XCircle, CheckCircle, Info } from 'lucide-react'; // Import Lucide icons

function ExtractForm() {
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [decodedData, setDecodedData] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(''); // State for custom messages (success/error/info)
    const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

    const messageTimeoutRef = useRef(null); // Ref for message timeout

    // Function to show custom messages
    const showMessageBox = (msg, type = 'info') => {
        setMessage(msg);
        setMessageType(type);
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }
        messageTimeoutRef.current = setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    // Create object URL for preview when file changes
    useEffect(() => {
        if (!file) {
            setFilePreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setFilePreview(objectUrl);

        // Cleanup the URL object when component unmounts or file changes
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    // Cleanup message timeout on unmount
    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
        };
    }, []);

    const handleExtract = async (e) => {
        e.preventDefault();
        if (!file) {
            showMessageBox('Please upload a watermarked image to extract data.', 'error');
            setDecodedData('');
            return;
        }
        showMessageBox(''); // Clear previous messages
        setDecodedData('');
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Note: Replace 'http://localhost:8000/extract' with your actual backend URL
            const response = await fetch('https://qrmark-backend.onrender.com/extract', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.data) {
                setDecodedData(result.data);
                showMessageBox('QR code extracted successfully!', 'success');
            } else {
                setDecodedData('❌ Failed to decode QR from image.');
                showMessageBox('Failed to decode QR from image. No hidden data found or image is corrupted.', 'error');
            }
        } catch (error) {
            console.error("Extraction error:", error);
            setDecodedData('❌ Error occurred while decoding.');
            showMessageBox(`An error occurred during extraction: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Changed bg-white to bg-qr-main-light dark:bg-qr-main-dark for dark mode blending
        <div className="max-w-xl mx-auto p-4 md:p-6 bg-qr-main-light dark:bg-qr-main-dark shadow-xl rounded-xl space-y-6">
            <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-6">Extract QR Code</h2>

            {/* Custom Message Box */}
            {message && (
                <div className={`p-3 rounded-lg flex items-center space-x-2 transition-all duration-300 ease-in-out
                    ${messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-800 dark:text-green-100 dark:border-green-700' : ''}
                    ${messageType === 'error' ? 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-800 dark:text-red-100 dark:border-red-700' : ''}
                    ${messageType === 'info' ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:border-blue-700' : ''}
                `}>
                    {messageType === 'success' && <CheckCircle size={20} />}
                    {messageType === 'error' && <XCircle size={20} />}
                    {messageType === 'info' && <Info size={20} />}
                    <p className="flex-1 text-sm font-medium">{message}</p>
                </div>
            )}

            <form onSubmit={handleExtract} className="space-y-5">
                {/* File Input */}
                <div>
                    <label htmlFor="image-upload-extract" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select Watermarked Image
                    </label>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="image-upload-extract" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-300" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF</p>
                            </div>
                            <input
                                id="image-upload-extract"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden"
                            />
                        </label>
                    </div>
                    {file && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">Selected file: <span className="font-medium">{file.name}</span></p>
                    )}
                </div>

                {/* Image Preview */}
                {filePreview && (
                    <div className="mt-4 text-center bg-gray-900 p-3 rounded-lg shadow-inner border border-gray-700">
                        <h4 className="text-md font-semibold text-gray-200 dark:text-gray-300 mb-2">Image Preview:</h4>
                        <img
                            src={filePreview}
                            alt="Preview"
                            className="max-w-full h-auto mx-auto rounded-lg object-contain border border-gray-600 dark:border-gray-500"
                            style={{ maxHeight: '300px' }} // Limit height for larger screens
                        />
                    </div>
                )}

                {/* Extract Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg shadow-md transition-colors duration-300
                        ${loading ? 'bg-gray-400 cursor-wait' : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Extracting...
                        </>
                    ) : (
                        <>
                            <ScanLine size={20} className="mr-2" /> Extract QR
                        </>
                    )}
                </button>
            </form>

            {/* Decoded Data Display */}
            {decodedData && (
                <div className="mt-8">
                    <DecodedQRDisplay decodedData={decodedData} />
                </div>
            )}
        </div>
    );
}

export default ExtractForm;
