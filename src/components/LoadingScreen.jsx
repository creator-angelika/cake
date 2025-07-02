// src/components/LoadingScreen.jsx
import './LoadingScreen.css';

function LoadingScreen({ onStart }) {
  return (
    <div className="loading-screen">
      <div className="loader-circle"></div>
      <button className="start-button" onClick={onStart}>
        Tap to Start 🎵
      </button>
    </div>
  );
}

export default LoadingScreen;
