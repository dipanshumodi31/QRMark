import React, { useState, useRef, useEffect } from 'react';
import { Camera, Square, X, CheckCircle, RotateCcw } from 'lucide-react';

function CameraCapture({ onFileSelect }) {
    const [isActive, setIsActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [facingMode, setFacingMode] = useState('environment'); // 'user' for front, 'environment' for back
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setIsActive(true);
        } catch (err) {
            console.error("Camera access error:", err);
            alert("Camera access denied or unavailable. Please check your browser permissions.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsActive(false);
        setCapturedImage(null);
    };

    const captureImage = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);
        
        canvas.toBlob((blob) => {
            if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                setCapturedImage(imageUrl);
            }
        }, 'image/png');
    };

    const confirmCapture = () => {
        if (capturedImage) {
            fetch(capturedImage)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `captured_${Date.now()}.png`, { type: 'image/png' });
                    onFileSelect(file);
                    stopCamera();
                });
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
    };

    const switchCamera = () => {
        const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
        setFacingMode(newFacingMode);
        if (isActive) {
            stopCamera();
            setTimeout(() => {
                startCamera();
            }, 100);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Camera Capture
            </h3>

            {!isActive && !capturedImage ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center">
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                                Use Camera
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Capture image directly
                            </p>
                        </div>
                        <button
                            onClick={startCamera}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            <Camera className="w-5 h-5 mr-2" />
                            Start Camera
                        </button>
                    </div>
                </div>
            ) : isActive && !capturedImage ? (
                <div className="relative">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-48 object-cover rounded-2xl shadow-lg"
                    />
                    
                    {/* Camera Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                        <button
                            onClick={switchCamera}
                            className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                            title="Switch Camera"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                        
                        <button
                            onClick={captureImage}
                            className="p-4 bg-white text-gray-900 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        >
                            <Square className="w-6 h-6" />
                        </button>
                        
                        <button
                            onClick={stopCamera}
                            className="p-3 bg-red-500/80 backdrop-blur-sm text-white rounded-full hover:bg-red-600/80 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : capturedImage ? (
                <div className="relative">
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="w-full h-48 object-cover rounded-2xl shadow-lg"
                    />
                    
                    {/* Confirmation Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                        <button
                            onClick={retakePhoto}
                            className="px-4 py-2 bg-gray-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-gray-600/80 transition-colors"
                        >
                            Retake
                        </button>
                        
                        <button
                            onClick={confirmCapture}
                            className="px-4 py-2 bg-green-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-green-600/80 transition-colors flex items-center"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Use Photo
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default CameraCapture;