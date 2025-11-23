'use client'

import { Canvas } from '@react-three/fiber'
import { NeuralKernel } from '@/components/NeuralKernel'
import { Suspense } from 'react'

export function CanvasContainer() {
    return (
        <div className="fixed inset-0 z-0 w-full h-full">
            <Canvas
                className="size-full"
                camera={{ position: [0, 0, 60], fov: 45 }}
                gl={{ antialias: false, powerPreference: "high-performance" }}
            >
                <color attach="background" args={['#000000']} />
                <Suspense fallback={null}>
                    <NeuralKernel />
                </Suspense>
            </Canvas>
        </div>
    )
}
