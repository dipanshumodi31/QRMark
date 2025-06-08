import React, { useState, useEffect } from 'react';
import DecodedQRDisplay from './DecodedQRDisplay';

function ExtractForm() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [decodedData, setDecodedData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a watermarked image.');
      setDecodedData('');
      return;
    }
    setError('');
    setDecodedData('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/extract', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.data) {
        setDecodedData(result.data);
      } else {
        setDecodedData('❌ Failed to decode QR from image.');
      }
    } catch (error) {
      console.error(error);
      setDecodedData('❌ Error occurred while decoding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: '3rem auto',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Extract QR Code from Image</h1>
      <form
        onSubmit={handleExtract}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ padding: '0.5rem' }}
        />

        {/* Image preview */}
        {filePreview && (
          <div
            style={{
              marginTop: '1rem',
              textAlign: 'center',
              border: '1px solid #444',
              padding: '0.5rem',
              borderRadius: '8px',
              backgroundColor: '#111',
            }}
          >
            <img
              src={filePreview}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: 240, borderRadius: '6px' }}
            />
          </div>
        )}

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
          {loading ? 'Extracting...' : 'Extract QR'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '1rem', color: 'red' }}>
          {error}
        </div>
      )}

      {decodedData && <DecodedQRDisplay decodedData={decodedData} />}
    </div>
  );
}

export default ExtractForm;
