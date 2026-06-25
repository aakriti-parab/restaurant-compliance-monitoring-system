import { useState } from "react";
import "./ImageUpload.css";

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log(data);

      setAnalysis(data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <>

      <div className="top-section">

        <div className="upload-card">

          <div className="upload-icon">
            ☁️
          </div>

          <h2>Upload Restaurant Image</h2>

          <p>
            JPG • PNG • WEBP
          </p>

          <label className="upload-btn">

            Browse Image

            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              hidden
            />

          </label>

          {selectedFile && (
            <p className="filename">
              {selectedFile.name}
            </p>
          )}

        </div>

        <div className="preview-card">

          <h2>Image Preview</h2>

          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="preview-image"
            />
          ) : (
            <div className="empty-preview">
              No Image Selected
            </div>
          )}

        </div>

      </div>

      {loading && (
        <div className="loading-card">

          <div className="loader"></div>

          <h2>AI is analyzing your restaurant...</h2>

          <p>This usually takes 2–5 seconds.</p>

        </div>
      )}

      {analysis && (

        <div className="report-card">

          <h2>
            🤖 Compliance Report
          </h2>

          <div className="stats">

            <div className="stat">
              <h3>🧢 Cap</h3>
              <span>{analysis.cap}</span>
            </div>

            <div className="stat">
              <h3>🧤 Gloves</h3>
              <span>{analysis.gloves}</span>
            </div>

            <div className="stat">
              <h3>👨 Behind Counter</h3>
              <span>{analysis.behind_counter}</span>
            </div>

            <div className="stat">
              <h3>👥 Front Counter</h3>
              <span>{analysis.front_counter}</span>
            </div>

            <div className="stat">
              <h3>🍽 Occupied Tables</h3>
              <span>{analysis.occupied_tables}</span>
            </div>

            <div className="stat">
              <h3>🪑 Empty Tables</h3>
              <span>{analysis.empty_tables}</span>
            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default ImageUpload;