import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import { a, useSpring } from '@react-spring/web';
import Candle from './components/Candle';
import Animation from './components/Animation';
import confetti from 'canvas-confetti';
import './App.css';
import LoadingScreen from './components/LoadingScreen';

function CountdownOverlay({ onComplete }) {
  const [count, setCount] = useState(5);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let timer;

    if (count > 1) {
      timer = setTimeout(() => setCount((prev) => prev - 1), 1000);
    } else if (count === 1) {
      timer = setTimeout(() => {
        setFade(true);
        setTimeout(() => {
          setCount(0);
          onComplete?.();
        }, 800);
      }, 700);
    }

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  if (count <= 0) return null;

  return (
    <div className={`countdown ${fade ? 'fade-out' : ''}`}>
      <p>BLOW ON THE CANDLE IN {count}</p>
    </div>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  const [shake, setShake] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showBirthdayText, setShowBirthdayText] = useState(false);
  const audioRef = useRef(null);

  const { x } = useSpring({
    from: { x: 0 },
    to: { x: shake ? 10 : 0 },
    config: { tension: 300, friction: 5 },
    loop: shake ? { reverse: true } : false,
  });

  const startExperience = () => {
    setStarted(true);
    setShowCountdown(true);

    // Begin animations after countdown
    setTimeout(() => {
      launchConfetti();
      setShake(true);
      if (audioRef.current) {
        audioRef.current.play().catch((err) =>
          console.log('Autoplay error:', err)
        );
      }
      setTimeout(() => setShake(false), 600);
    }, 5000);
  };

  return (
    <div className="background-wrapper">
      {!started && <LoadingScreen onStart={startExperience} />}

      {started && (
        <a.div
          className="card-container"
          style={{ transform: x.to((x) => `translateX(${x}px)`) }}
        >
          <audio ref={audioRef} src="/birthday-song.mp3" preload="auto" />

          {showCountdown && (
            <CountdownOverlay
              onComplete={() => {
                setShowCountdown(false);
                setShowBirthdayText(true);
              }}
            />
          )}

          {showBirthdayText && (
            <div className="birthday-text">HAPPY BIRTHDAY!</div>
          )}

          <Canvas camera={{ position: [8, 4, 7], fov: 50 }}>
            <ambientLight intensity={1.5} />
            <hemisphereLight
              skyColor="#ffffff"
              groundColor="#444444"
              intensity={0.6}
            />
            <directionalLight
              position={[3, 5, 2]}
              intensity={0.8}
              castShadow
            />

            <group position={[0, -1.5, 0]}>
              <Animation
                scale={2.5}
                position={[0, -1.5, 0]}
                rotation={[0, 0.9, 0]}
              />
              <Candle position={[0, -1.2, 0]} />
            </group>

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={1.2}
              minPolarAngle={1.2}
            />
            <Environment
              files="/hdr/hansaplatz_1k.hdr"
              background={false}
            />
          </Canvas>
        </a.div>
      )}
    </div>
  );
}

function launchConfetti() {
  const duration = 8000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 40,
    spread: 160,
    ticks: 80,
    zIndex: 1000,
    scalar: 1.6,
  };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 80 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
      })
    );
  }, 250);
}

export default App;
