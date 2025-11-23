'use client'

import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { damp, damp2 } from 'maath/easing'

// Lorenz Attractor Math
const generateLorenzPoints = (count: number) => {
    const points = []
    let x = 0.1, y = 0, z = 0
    const dt = 0.005 // Smaller step for smoother lines
    const sigma = 10
    const rho = 28
    const beta = 8 / 3

    for (let i = 0; i < count; i++) {
        const dx = sigma * (y - x) * dt
        const dy = (x * (rho - z) - y) * dt
        const dz = (x * y - beta * z) * dt
        x += dx
        y += dy
        z += dz
        points.push(new THREE.Vector3(x, y, z))
    }
    return points
}

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uFocus;
  
  attribute float aRandom;
  attribute float aSize;
  
  varying vec3 vColor;
  varying float vAlpha;

  // Simplex Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vec3 pos = position;
    
    // Breathing (Idle)
    float breath = sin(uTime * 0.5 + pos.x * 0.1) * 0.1;
    pos *= 1.0 + breath * (1.0 - uFocus); // Dampen breathing when focused
    
    // Chaos/Noise
    float noise = snoise(pos * 0.1 + uTime * 0.2);
    pos += normal * noise * (2.0 - uFocus * 1.5); // Reduce chaos when focused
    
    // Mouse Interaction (Swarm)
    // Project mouse to 3D roughly (simplified)
    vec3 mousePos = vec3(uMouse.x * 30.0, uMouse.y * 30.0, 0.0);
    float dist = distance(pos, mousePos);
    
    // Attraction force
    if (dist < 15.0) {
        vec3 dir = normalize(mousePos - pos);
        pos += dir * (15.0 - dist) * uHover * 0.5;
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    
    // Color logic
    vec3 colorIdle = vec3(0.0, 0.83, 0.66); // #00D4AA (Bioluminescent Algae)
    vec3 colorFocus = vec3(0.75, 0.68, 0.51); // #BFAF83 (Wisdom Gold)
    
    vColor = mix(colorIdle, colorFocus, uFocus);
    vAlpha = 0.6 + 0.4 * sin(uTime + aRandom * 10.0);
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Circular particle
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;

    // Soft glow
    float glow = 1.0 - r;
    glow = pow(glow, 1.5);

    gl_FragColor = vec4(vColor, vAlpha * glow);
  }
`

export function NeuralKernel() {
    const mesh = useRef<THREE.Points>(null)
    const { viewport, mouse } = useThree()

    const count = 20000 // High particle count for density

    const { positions, randoms, sizes } = useMemo(() => {
        const pts = generateLorenzPoints(count)
        const positions = new Float32Array(count * 3)
        const randoms = new Float32Array(count)
        const sizes = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            positions[i * 3] = pts[i].x
            positions[i * 3 + 1] = pts[i].y
            positions[i * 3 + 2] = pts[i].z

            randoms[i] = Math.random()
            sizes[i] = Math.random() * 2.0 + 0.5
        }
        return { positions, randoms, sizes }
    }, [])

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
        uFocus: { value: 0 }
    }), [])

    useFrame((state, delta) => {
        if (!mesh.current) return

        const material = mesh.current.material as THREE.ShaderMaterial

        // Update Time
        material.uniforms.uTime.value = state.clock.getElapsedTime()

        // Update Mouse
        damp2(material.uniforms.uMouse.value, [state.mouse.x, state.mouse.y], 0.1, delta)

        // Intent Logic: Focus when mouse is near center
        const dist = Math.sqrt(state.mouse.x ** 2 + state.mouse.y ** 2)
        const targetFocus = dist < 0.3 ? 1 : 0

        damp(material.uniforms.uFocus, 'value', targetFocus, 0.5, delta)
        damp(material.uniforms.uHover, 'value', 1, 0.2, delta)

        // Rotation
        mesh.current.rotation.y += delta * 0.1 * (1 - material.uniforms.uFocus.value)
    })

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-aRandom"
                    count={randoms.length}
                    array={randoms}
                    itemSize={1}
                    args={[randoms, 1]}
                />
                <bufferAttribute
                    attach="attributes-aSize"
                    count={sizes.length}
                    array={sizes}
                    itemSize={1}
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}
