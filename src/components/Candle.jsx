// src/components/Candle.jsx
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { a, useSpring } from '@react-spring/three';

export default function Candle(props) {
  const { scene } = useGLTF('/candle.glb');
  const ref = useRef();
  const [shrink, setShrink] = useState(false);

  // Preprocess the flame material and trigger shrink after 3 seconds
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase().includes('flame')) {
        child.material = child.material.clone();
        child.material.emissive = new THREE.Color(1.3, 0.5, -0.05);
        child.material.emissiveIntensity = 1.9;
        child.material.toneMapped = true;
      }
    });

    const timer = setTimeout(() => setShrink(true), 5000);
    return () => clearTimeout(timer);
  }, [scene]);

  const { scale } = useSpring({
    scale: shrink ? 0 : 1.2,
    config: { tension: 100, friction: 10 },
  });

  return (
    <a.primitive
      ref={ref}
      object={scene}
      scale={scale.to((s) => [s, s, s])}
      position={[0, -1.2, 0]} 
      {...props}
    />
  );
}
