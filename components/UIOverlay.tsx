'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function UIOverlay() {
    const [logs, setLogs] = useState<string[]>([
        '> system_init()',
        '> loading_kernel...',
        '> neural_link_established'
    ])

    useEffect(() => {
        const messages = [
            'analyzing_cursor_velocity',
            'optimizing_render_pipeline',
            'detecting_user_intent',
            'syncing_biolum_field',
            'calculating_chaos_metrics'
        ]

        const interval = setInterval(() => {
            const msg = messages[Math.floor(Math.random() * messages.length)]
            const val = Math.random().toFixed(4)
            setLogs(prev => [...prev.slice(-15), `> ${msg}: ${val}`])
        }, 1500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-10 font-mono text-xs text-[#00D4AA]/50">
            {/* Vertical Terminal */}
            <div className="absolute right-0 top-0 bottom-0 w-64 border-l border-[#1E3A8A]/20 bg-black/20 backdrop-blur-[2px] p-4 flex flex-col justify-end mask-image-linear-gradient">
                {logs.map((log, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-1 whitespace-nowrap overflow-hidden"
                    >
                        {log}
                    </motion.div>
                ))}
                <div className="mt-2 text-[#00D4AA] animate-pulse">_</div>
            </div>

            {/* Title */}
            <div className="absolute top-8 left-8">
                <h1 className="text-4xl font-bold tracking-tighter text-white mix-blend-difference font-sans">
                    KINETIC CORTEX
                </h1>
                <div className="text-[#00D4AA] text-sm tracking-[0.3em] mt-2 uppercase">The Sentient Void</div>
            </div>
        </div>
    )
}
