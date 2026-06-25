import "./App.css";
import ImageUpload from "./components/ImageUpload";

function App() {
  return (
    <div className="app">

      {/* Background Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      {/* Hero Section */}
      <header className="hero">

        <div className="hero-badge">
          AI Powered Restaurant Inspection
        </div>

        <div className="hero-icon">
          🍽️
        </div>

        <h1>
          Restaurant Compliance AI
        </h1>

        <p>
          Powered by Google Gemini 2.5 Flash Vision
        </p>

      </header>

      <ImageUpload />

      <footer className="footer">

        <div className="footer-line"></div>

        <p>
          Restaurant Compliance Monitoring System
        </p>

        <span>
          Built using React • FastAPI • Gemini AI
        </span>

      </footer>

    </div>
  );
}

export default App;