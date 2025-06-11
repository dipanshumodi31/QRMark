import React, { useState, useRef, useEffect } from 'react';
import { Camera, ImageUp, Copy, Download, XCircle, CheckCircle, Info, Send } from 'lucide-react'; // Import Lucide icons

function UploadForm() {
    const [file, setFile] = useState(null);
    const [qrData, setQrData] = useState('');
    const [alpha, setAlpha] = useState(12);
    const [outputUrl, setOutputUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(''); // State for custom messages (success/error)
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [copied, setCopied] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showCamera, setShowCamera] = useState(false);

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const messageTimeoutRef = useRef(null); // Ref to hold the timeout ID for messages

    // Function to show custom messages instead of alert()
    const showMessageBox = (msg, type = 'info') => {
        setMessage(msg);
        setMessageType(type);
        // Clear any existing timeout to prevent message from disappearing too soon
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }
        // Set a timeout to clear the message after 3 seconds
        messageTimeoutRef.current = setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    // Cleanup camera stream when component unmounts or camera is stopped
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
        };
    }, []);

    const startCamera = async () => {
        setShowCamera(true);
        setPreviewUrl(null); // Clear any previous preview when starting camera
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); // Prefer rear camera
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Use playsInline for iOS compatibility
                videoRef.current.setAttribute('playsinline', '');
                videoRef.current.play().catch(err => {
                    console.error("Video play error:", err);
                    showMessageBox("Failed to play video stream.", "error");
                });
            }
        } catch (err) {
            console.error("Camera access error:", err);
            showMessageBox("Camera access denied or unavailable. Please check your browser permissions.", "error");
            setShowCamera(false);
        }
    };

    const stopCamera = () => {
        setShowCamera(false);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setPreviewUrl(null); // Clear preview when camera is stopped
    };

    const captureImage = () => {
        if (!videoRef.current) {
            showMessageBox("Video stream not available.", "error");
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
            if (blob) {
                const preview = URL.createObjectURL(blob);
                setPreviewUrl(preview);
                // No need to stop camera immediately, allow user to review
            } else {
                showMessageBox("Failed to capture image.", "error");
            }
        }, 'image/png');
    };

    const confirmCapturedImage = () => {
        if (previewUrl) {
            fetch(previewUrl)
                .then(res => res.blob())
                .then(blob => {
                    const capturedFile = new File([blob], `captured_image_${Date.now()}.png`, { type: blob.type });
                    setFile(capturedFile);
                    setPreviewUrl(null); // Hide preview modal
                    stopCamera(); // Stop camera after confirming
                    showMessageBox("Image captured successfully!", "success");
                })
                .catch(err => {
                    console.error("Error confirming image:", err);
                    showMessageBox("Failed to confirm captured image.", "error");
                });
        }
    };

    const cancelCapturedImage = () => {
        setPreviewUrl(null); // Just hide the preview modal
        // Camera remains active, allowing user to capture again
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !qrData) {
            showMessageBox("Please select an image file and enter QR data.", "error");
            return;
        }

        showMessageBox(''); // Clear previous messages
        setOutputUrl(null);
        setCopied(false);
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('qr_data', qrData);
        formData.append('alpha', alpha);

        try {
            // Note: Replace 'http://localhost:8000/embed' with your actual backend URL
            const response = await fetch('/api/embed', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} - ${errorText}`);
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setOutputUrl(imageUrl);
            showMessageBox("QR code embedded successfully!", "success");
        } catch (err) {
            console.error("Embedding error:", err);
            showMessageBox(`Failed to process image: ${err.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const copyQrData = () => {
        if (!qrData) {
            showMessageBox("No QR data to copy.", "info");
            return;
        }
        // Using document.execCommand('copy') for broader compatibility in iFrames
        const tempInput = document.createElement('textarea');
        tempInput.value = qrData;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        setCopied(true);
        showMessageBox("QR Data copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        // Changed bg-white to bg-qr-main-light dark:bg-qr-main-dark for dark mode blending
        <div className="max-w-xl mx-auto p-4 md:p-6 bg-qr-main-light dark:bg-qr-main-dark shadow-xl rounded-xl space-y-6">
            <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-6">Embed QR Code</h2>

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

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* File Input */}
                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select Image to Watermark
                    </label>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImageUp className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-300" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF (MAX. 800x400px)</p>
                            </div>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={e => setFile(e.target.files[0])}
                                className="hidden"
                            />
                        </label>
                    </div>
                    {file && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">Selected file: <span className="font-medium">{file.name}</span></p>
                    )}
                </div>

                {/* QR Data Input & Copy */}
                <div>
                    <label htmlFor="qr-data" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Enter QR Data
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            id="qr-data"
                            type="text"
                            placeholder="e.g., Your secret message or URL"
                            value={qrData}
                            onChange={e => setQrData(e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={copyQrData}
                            disabled={!qrData || copied}
                            className={`flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition-all duration-200
                                ${copied ? 'bg-green-500 text-white cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-2 focus:ring-offset-2'}
                                disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                            <Copy size={18} className="mr-2" />
                            {copied ? 'Copied!' : 'Copy Data'}
                        </button>
                    </div>
                </div>

                {/* Alpha Slider */}
                <div>
                    <label htmlFor="alpha-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Watermark Visibility (Alpha): <strong className="text-indigo-600 dark:text-indigo-400">{alpha}</strong>
                    </label>
                    <input
                        id="alpha-range"
                        type="range"
                        min="0"
                        max="100"
                        value={alpha}
                        onChange={e => setAlpha(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                    />
                </div>

                {/* Camera Controls */}
                <div className="flex flex-wrap justify-center gap-3">
                    {!showCamera ? (
                        <button
                            type="button"
                            onClick={startCamera}
                            className="flex-1 min-w-[150px] inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <Camera size={20} className="mr-2" /> Start Camera
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={captureImage}
                                className="flex-1 min-w-[150px] inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            >
                                <Camera size={20} className="mr-2" /> Capture
                            </button>
                            <button
                                type="button"
                                onClick={stopCamera}
                                className="flex-1 min-w-[150px] inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            >
                                <XCircle size={20} className="mr-2" /> Stop
                            </button>
                        </>
                    )}
                </div>

                {/* Video Stream */}
                {showCamera && (
                    <div className="mt-4 flex justify-center">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full max-w-lg rounded-lg shadow-md border border-gray-300 dark:border-gray-600"
                        />
                    </div>
                )}

                {/* File/Captured Image Preview */}
                {file && !showCamera && (
                    <div className="mt-6 text-center">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Image to be Watermarked:</h4>
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Uploaded preview"
                            className="max-w-full h-auto mx-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 object-contain"
                            style={{ maxHeight: '300px' }} // Limit height for large images
                        />
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg shadow-md transition-colors duration-300
                        ${loading ? 'bg-gray-400 cursor-wait' : 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'}`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Embedding...
                        </>
                    ) : (
                        <>
                            <Send size={20} className="mr-2" /> Embed QR
                        </>
                    )}
                </button>
            </form>

            {/* Preview Captured Image Modal */}
            {previewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-qr-main-light dark:bg-qr-main-dark p-6 rounded-xl shadow-2xl max-w-lg w-full text-center space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">📸 Captured Image Preview</h3>
                        <img
                            src={previewUrl}
                            alt="Captured Preview"
                            className="max-w-full h-auto mx-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-600 object-contain"
                            style={{ maxHeight: '60vh' }}
                        />
                        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
                            <button
                                onClick={confirmCapturedImage}
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            >
                                <CheckCircle size={20} className="mr-2" /> Use Image
                            </button>
                            <button
                                onClick={cancelCapturedImage}
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            >
                                <XCircle size={20} className="mr-2" /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Watermarked Image Output */}
            {outputUrl && (
                <div className="mt-8 text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Watermarked Image Result</h3>
                    <img
                        src={outputUrl}
                        alt="Watermarked Output"
                        className="max-w-full h-auto mx-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 object-contain"
                        style={{ maxHeight: '400px' }}
                    />
                    <a
                        href={outputUrl}
                        download="watermarked_qrmark.png"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg shadow-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                    >
                        <Download size={20} className="mr-2" /> Download Watermarked Image
                    </a>
                </div>
            )}
        </div>
    );
}

export default UploadForm;
