'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { AgentState } from '../../types/research';

interface OrbitProps {
  agents: AgentState[];
  isProcessing: boolean;
}

export function Orbit({ agents, isProcessing }: OrbitProps) {
  return (
    <div className="h-full w-full absolute inset-0 -z-10 bg-gradient-to-b from-[#020202] to-[#0a0a0a]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <fog attach="fog" args={['#050505', 5, 20]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4D96FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6D28D9" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <group>
          <Attractor isProcessing={isProcessing} />
          <AgentSwarm agents={agents} />
        </group>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      
      {/* Overlay vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)]" />
    </div>
  );
}

function Attractor({ isProcessing }: { isProcessing: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Pulsing effect
    const scale = 1 + Math.sin(time * 2) * 0.05 + (isProcessing ? Math.sin(time * 8) * 0.1 : 0);
    meshRef.current.scale.set(scale, scale, scale);
    
    // Rotation
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <meshPhysicalMaterial 
          color={isProcessing ? "#4D96FF" : "#222"}
          emissive={isProcessing ? "#4D96FF" : "#000"}
          emissiveIntensity={isProcessing ? 0.5 : 0}
          roughness={0.2}
          metalness={0.8}
          transmission={0.6}
          thickness={2}
          wireframe={!isProcessing}
        />
      </mesh>
      
      {/* Core glow */}
      <mesh scale={0.8}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={isProcessing ? "#ffffff" : "#444"} transparent opacity={0.5} />
      </mesh>
    </Float>
  );
}

function AgentSwarm({ agents }: { agents: AgentState[] }) {
  // Create dummy agents with deterministic values based on index
  const dummyCount = 8;
  const dummies = useMemo(() => Array.from({ length: dummyCount }).map((_, i) => {
    // Deterministic pseudo-random based on index
    const seed = i * 0.618033988749; // Golden ratio for good distribution
    return {
      id: `idle-${i}`,
      angle: (i / dummyCount) * Math.PI * 2,
      radius: 3 + (((seed * 100) % 1) * 2),
      speed: 0.2 + (((seed * 200) % 1) * 0.3),
      yOffset: ((((seed * 300) % 1) - 0.5) * 2)
    };
  }), []);

  return (
    <group>
      {dummies.map((d) => (
        <AgentNode 
          key={d.id} 
          angle={d.angle} 
          radius={d.radius} 
          speed={d.speed} 
          yOffset={d.yOffset}
          active={agents.length > 0}
        />
      ))}
    </group>
  );
}

interface AgentNodeProps {
  angle: number;
  radius: number;
  speed: number;
  yOffset: number;
  active: boolean;
}

function AgentNode({ angle, radius, speed, yOffset, active }: AgentNodeProps) {
  const ref = useRef<THREE.Group>(null);
  const [vec] = useState(() => new THREE.Vector3());
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const currentAngle = angle + time * speed;
    
    // Orbit logic
    const x = Math.cos(currentAngle) * radius;
    const z = Math.sin(currentAngle) * radius;
    const y = yOffset + Math.sin(time + angle) * 0.5;
    
    ref.current.position.set(x, y, z);
    ref.current.lookAt(vec.set(0, 0, 0));
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color={active ? "#6D28D9" : "#444"} 
          emissive={active ? "#6D28D9" : "#000"}
          emissiveIntensity={active ? 2 : 0}
        />
      </mesh>
    </group>
  );
}

export default Orbit;