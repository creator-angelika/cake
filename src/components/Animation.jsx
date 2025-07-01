import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Animation(props) {
  const group = useRef();
  const { scene, animations } = useGLTF('/cakewithanim1.glb');
  const { actions } = useAnimations(animations, group);
  const [cakeMesh, setCakeMesh] = useState(null);

  // Find the mesh named 'Cake'
  useEffect(() => {
    scene.traverse((child) => {
      if (child.name.includes('cake')) {
        setCakeMesh(child);
      }
    });

    const timer = setTimeout(() => {
      actions['Clapping']?.reset().fadeIn(0.5).play();
      actions['Clapping1']?.reset().fadeIn(0.5).play();
      actions['Cheer1']?.reset().fadeIn(0.5).play();
      actions['Cheer']?.reset().fadeIn(0.5).play();
      actions['Clap']?.reset().fadeIn(0.5).play();
      actions['Clap1']?.reset().fadeIn(0.5).play();
    }, 5000);

    return () => clearTimeout(timer);
  }, [scene, actions]);

  // Apply slow rotation to only the 'Cake' mesh
  useFrame((_, delta) => {
    if (cakeMesh) {
      cakeMesh.rotation.y += delta * 0.5;
    }
  });

  return <primitive ref={group} object={scene} {...props} />;
}
