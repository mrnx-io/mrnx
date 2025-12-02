'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { AgentState } from '../../types/research';

interface OrbitProps {
  agents: AgentState[];
  isProcessing: boolean;
}

export function Orbit({ agents, isProcessing }: OrbitProps) {
  return (
    <div className="h-full w-full absolute inset-0 -z-10 bg-[#020202]">
      <Canvas camera={{ position: [0, 0, 12], fov: 40 }}>
        <fog attach="fog" args={['#020202', 5, 30]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#4D96FF" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#6D28D9" />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
        
        <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />
        
        <group>
          <Attractor isProcessing={isProcessing} />
          <AgentSwarm agents={agents} isProcessing={isProcessing} />
        </group>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={isProcessing ? 1 : 0.3} 
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      
      {/* Cinematic Vignette & Grain */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay" />
    </div>
  );
}

function Attractor({ isProcessing }: { isProcessing: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Pulsing effect
    const scale = 1 + Math.sin(time * 1.5) * 0.05 + (isProcessing ? Math.sin(time * 10) * 0.05 : 0);
    meshRef.current.scale.set(scale, scale, scale);
    
    // Rotation
    meshRef.current.rotation.x = time * 0.15;
    meshRef.current.rotation.y = time * 0.2;
    
    // Glow pulse
    const glowScale = 1.2 + Math.sin(time * 2) * 0.1;
    glowRef.current.scale.set(glowScale, glowScale, glowScale);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      {/* Main Core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshPhysicalMaterial 
          color={isProcessing ? "#4D96FF" : "#1a1a1a"}
          emissive={isProcessing ? "#4D96FF" : "#000"}
          emissiveIntensity={isProcessing ? 0.8 : 0}
          roughness={0.1}
          metalness={0.9}
          transmission={0.2}
          thickness={2}
          wireframe={true}
        />
      </mesh>
      
      {/* Inner Core */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color={isProcessing ? "#ffffff" : "#000"} />
      </mesh>

      {/* Outer Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial 
          color={isProcessing ? "#4D96FF" : "#1a1a1a"} 
          transparent 
          opacity={isProcessing ? 0.1 : 0.02} 
          side={THREE.BackSide}
        />
      </mesh>
    </Float>
  );
}

function AgentSwarm({ agents, isProcessing }: { agents: AgentState[], isProcessing: boolean }) {
  // Create dummy agents with deterministic values based on index
  const dummyCount = 12;
  const dummies = useMemo(() => Array.from({ length: dummyCount }).map((_, i) => {
    const seed = i * 0.618033988749;
    return {
      id: `idle-${i}`,
      angle: (i / dummyCount) * Math.PI * 2,
      radius: 3.5 + (((seed * 100) % 1) * 3),
      speed: 0.1 + (((seed * 200) % 1) * 0.2),
      yOffset: ((((seed * 300) % 1) - 0.5) * 3),
      color: i % 2 === 0 ? "#6D28D9" : "#4D96FF"
    };
  }), []);

  return (
    <group>
      {dummies.map((d) => (
        <AgentNode 
          key={d.id} 
          {...d}
          active={isProcessing}
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
  color: string;
  active: boolean;
}

function AgentNode({ angle, radius, speed, yOffset, color, active }: AgentNodeProps) {
  const ref = useRef<THREE.Group>(null);
  const [vec] = useState(() => new THREE.Vector3());
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const currentSpeed = active ? speed * 3 : speed;
    const currentAngle = angle + time * currentSpeed;
    
    // Orbit logic
    const x = Math.cos(currentAngle) * radius;
    const z = Math.sin(currentAngle) * radius;
    const y = yOffset + Math.sin(time + angle) * 0.5;
    
    ref.current.position.set(x, y, z);
    ref.current.lookAt(vec.set(0, 0, 0));
  });

  return (
    <group ref={ref}>
      <Trail
        width={1}
        length={8}
        color={new THREE.Color(color)}
        attenuation={(t) => t * t}
      >
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color={active ? "#ffffff" : color} 
            emissive={color}
            emissiveIntensity={active ? 2 : 0.5}
            toneMapped={false}
          />
        </mesh>
      </Trail>
    </group>
  );
}

export default Orbit;