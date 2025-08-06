import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

function ImageUpload({ onFileSelect }) {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            onFileSelect(file);
        }
    };

    const clearFile = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Image
            </h3>
            
            {!preview ? (
                <div
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                        dragActive
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={onButtonClick}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                    />
                    
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                                Drop your image here
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                or click to browse files
                            </p>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-2xl shadow-lg"
                    />
                    <button
                        onClick={clearFile}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        Image selected
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImageUpload;