// src/components/Balloon.js
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';

export default function Balloon({ delay = 1000, floatTo = 1 }) {
  const { scene } = useGLTF('/H1.glb');
  const ref = useRef();

  const [visible, setVisible] = useState(false);
  const [yPos, setYPos] = useState(-1.5); // Same level as cake

  // Show balloon after delay
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Float it upward only after it appears
  useFrame((_, delta) => {
    if (visible && ref.current && yPos < floatTo) {
      const newY = yPos + delta * 0.5; // smooth float speed
      setYPos(newY);
      ref.current.position.y = newY;
    }
  });

  if (!visible) return null;

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1.2}
      position={[0, yPos, -0.5]} // ✅ right behind the cake
      rotation={[0, 0, 0]}       // ✅ no rotation
    />
  );
}
