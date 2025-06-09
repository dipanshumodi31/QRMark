import React, { useState, useRef } from 'react';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [qrData, setQrData] = useState('');
  const [alpha, setAlpha] = useState(12);
  const [outputUrl, setOutputUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const buttonStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '0.5rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    border: 'none'
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Camera access denied or unavailable.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    setShowCamera(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      const preview = URL.createObjectURL(blob);
      setPreviewUrl(preview);
    }, 'image/png');
  };

  const confirmCapturedImage = () => {
    fetch(previewUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'captured.png', { type: blob.type });
        setFile(file);
        setPreviewUrl(null);
        stopCamera();
      });
  };

  const cancelCapturedImage = () => setPreviewUrl(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !qrData) {
      setError("Please select a file and enter QR data.");
      return;
    }

    setError('');
    setOutputUrl(null);
    setCopied(false);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('qr_data', qrData);
    formData.append('alpha', alpha);

    try {
      const response = await fetch('https://qrmark-2hj6.onrender.com/embed', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setOutputUrl(imageUrl);
    } catch (err) {
      console.error(err);
      setError('Failed to process image.');
    } finally {
      setLoading(false);
    }
  };

  const copyQrData = () => {
    if (!qrData) return;
    navigator.clipboard.writeText(qrData).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1 style={{ textAlign: 'center' }}>Embed QR Code into Image</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files[0])}
            style={{ flex: 1 }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          {showCamera ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                style={{ width: '100%', maxHeight: '300px', borderRadius: '8px', marginBottom: '1rem' }}
              />
              <div style={{ marginBottom: '1rem' }}>
                <button type="button" onClick={captureImage} style={buttonStyle}>
                  📸 Capture Now
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  style={{ ...buttonStyle, backgroundColor: '#f44336', marginLeft: '1rem' }}
                >
                  ❌ Stop Camera
                </button>
              </div>
            </>
          ) : (
            <button type="button" onClick={startCamera} style={buttonStyle}>
              🎥 Start Camera
            </button>
          )}
        </div>
        
        {file && (
        <div style={{ textAlign: 'center' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>📷 Image to be Watermarked:</h4>
            <img
            src={URL.createObjectURL(file)}
            alt="Uploaded preview"
            style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '8px',
                border: '1px solid #aaa',
                marginBottom: '1rem',
            }}
            />
        </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="QR Data"
            value={qrData}
            onChange={e => setQrData(e.target.value)}
            style={{ flexGrow: 1, padding: '0.5rem' }}
          />
          <button
            type="button"
            onClick={copyQrData}
            disabled={!qrData}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: copied ? '#4caf50' : '#00b8d9',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: qrData ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.3s',
            }}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>

        <label>
          Alpha: <strong>{alpha}</strong>
          <input
            type="range"
            min="0"
            max="100"
            value={alpha}
            onChange={e => setAlpha(e.target.value)}
            style={{ width: '100%' }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            backgroundColor: '#00b8d9',
            color: 'white',
            fontWeight: '600',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Embedding...' : 'Embed QR'}
        </button>
      </form>

      {previewUrl && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#222',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '90%',
            maxHeight: '90%',
            textAlign: 'center',
            color: '#fff',
          }}>
            <h3>📸 Preview Captured Image</h3>
            <img
              src={previewUrl}
              alt="Captured Preview"
              style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '8px', margin: '1rem 0' }}
            />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={confirmCapturedImage}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#4caf50',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ✅ Use Image
              </button>
              <button
                onClick={cancelCapturedImage}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#f44336',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '1rem', color: 'red' }}>
          {error}
        </div>
      )}

      {outputUrl && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Watermarked Image Preview</h3>
          <img
            src={outputUrl}
            alt="Watermarked Output"
            style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <br />
          <a
            href={outputUrl}
            download="watermarked.png"
            style={{
              marginTop: '0.5rem',
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: '#00b8d9',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
