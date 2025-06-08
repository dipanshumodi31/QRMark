import React, { useState } from "react";

function DecodedQRDisplay({ decodedData }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!decodedData) return;

    navigator.clipboard.writeText(decodedData).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }).catch((err) => {
      console.error("Failed to copy!", err);
    });
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>Decoded QR Data:</h3>
      <pre
        style={{
          backgroundColor: "#1e1e1e",
          color: "#00b8d9",
          padding: "1rem",
          borderRadius: "8px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {decodedData}
      </pre>

      <button
        onClick={copyToClipboard}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: copied ? "#0284C7" : "#00B8D9",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
          transition: "background-color 0.3s ease",
        }}
      >
        {copied ? "Copied ✓" : "Copy to Clipboard"}
      </button>
    </div>
  );
}

export default DecodedQRDisplay;
