import React, { useState, useRef } from "react";
import { Copy, Check } from 'lucide-react'; // Import Lucide icons for copy

function DecodedQRDisplay({ decodedData }) {
    const [copied, setCopied] = useState(false);
    const messageTimeoutRef = useRef(null); // Ref for message timeout

    // Function to handle copying text to clipboard
    const copyToClipboard = () => {
        if (!decodedData) return;

        // Using document.execCommand('copy') for broader compatibility in iFrames
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = decodedData;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);

        setCopied(true);
        // Clear any existing timeout
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }
        // Set a new timeout to reset the copied state
        messageTimeoutRef.current = setTimeout(() => {
            setCopied(false);
        }, 2000); // Reset after 2 seconds
    };

    return (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Decoded QR Data</h3>
            
            {/* Display area for decoded data */}
            <pre
                className="bg-gray-800 text-teal-400 p-4 rounded-lg overflow-x-auto text-sm md:text-base font-mono leading-relaxed whitespace-pre-wrap break-words shadow-inner"
            >
                {decodedData}
            </pre>

            {/* Copy to Clipboard Button */}
            <button
                onClick={copyToClipboard}
                className={`mt-4 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-md transition-all duration-300
                    ${copied ? 'bg-green-600 text-white cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}
                    disabled:opacity-60`}
                disabled={!decodedData}
            >
                {copied ? (
                    <>
                        <Check size={20} className="mr-2" /> Copied!
                    </>
                ) : (
                    <>
                        <Copy size={20} className="mr-2" /> Copy to Clipboard
                    </>
                )}
            </button>
        </div>
    );
}

export default DecodedQRDisplay;
