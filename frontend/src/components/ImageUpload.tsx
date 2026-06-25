import { useState } from "react";

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      setSelectedFile(file);

      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);

      const formData = new FormData();
      formData.append("file", file);

      setLoading(true);

      fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Response received");
          console.log(data);

          setLoading(false);
          setAnalysis(data.analysis);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
      />

      {selectedFile && (
        <p>Selected Image: {selectedFile.name}</p>
      )}

      {imagePreview && (
        <div>
          <h2>Image Preview</h2>

          <img
            src={imagePreview}
            alt="Preview"
            width="450"
            style={{
              borderRadius: "10px",
              border: "2px solid #444",
            }}
          />
        </div>
      )}

      {loading && (
        <h3>Analyzing image...</h3>
      )}

      {analysis && (
        <div>
          <h2>Compliance Report</h2>

          <div
            style={{
              backgroundColor: "#1e1e2f",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "700px",
              margin: "auto",
              textAlign: "left",
              whiteSpace: "pre-wrap",
              lineHeight: "1.8",
            }}
          >
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;

