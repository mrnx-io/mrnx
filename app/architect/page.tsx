'use client';

import React, { useState } from 'react';
import { CanvasContainer } from '@/components/CanvasContainer';
import { ControlPanel } from '@/components/architect/ControlPanel';
import { ResultsDisplay } from '@/components/architect/ResultsDisplay';
import { MatrixTable } from '@/components/architect/MatrixTable';
import { useWealthCalculator } from '@/hooks/useWealthCalculator';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 20
        } as any
    },
};

export default function ArchitectPage() {
    const { inputs, updateInput, reset, results } = useWealthCalculator();
    const [isMatrixOpen, setIsMatrixOpen] = useState(false);

    return (
        <main className="relative w-full min-h-screen bg-black text-slate-200 font-sans selection:bg-[#00D4AA]/30 overflow-x-hidden">
            {/* 3D Background - Fixed */}
            <div className="fixed inset-0 z-0">
                <CanvasContainer />
            </div>

            {/* Content Container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12 flex flex-col items-center pointer-events-none"
            >

                {/* Header */}
                <motion.header variants={itemVariants} className="text-center mb-12 max-w-4xl pointer-events-auto">
                    <h1 className="text-5xl md:text-7xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-4 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        THE WEALTH <span className="text-[#00D4AA] italic font-serif">ARCHITECT</span>
                    </h1>
                    <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-slate-400 text-xs md:text-sm font-mono uppercase tracking-widest flex gap-6">
                            <span>LOAN: <strong className="text-[#00D4AA]">€ {(inputs.loanAmount / 1000).toFixed(0)}k</strong></span>
                            <span className="w-px h-4 bg-white/10"></span>
                            <span>RATE: <strong className="text-[#00D4AA]">{inputs.rateBV}%</strong></span>
                            <span className="w-px h-4 bg-white/10"></span>
                            <span>TERM: <strong className="text-slate-200">30Y</strong></span>
                        </p>
                    </div>
                </motion.header>

                {/* Content Grid */}
                <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Controls (Sticky) */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-4 lg:sticky lg:top-8 space-y-6 pointer-events-auto"
                    >
                        <ControlPanel
                            inputs={inputs}
                            updateInput={updateInput}
                            onReset={reset}
                        />
                    </motion.div>

                    {/* Right Column: Results & Matrix */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-8 space-y-8 pointer-events-auto"
                    >
                        <ResultsDisplay results={results} />

                        {/* Summary Panel */}
                        <div className="p-6 rounded-2xl bg-[#050505]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-white/20 transition-colors duration-500">
                            <div className="text-center md:text-left">
                                <h3 className="text-white font-bold text-lg mb-1 font-sans">Financiële Matrix</h3>
                                <p className="text-slate-400 text-xs font-mono">Gedetailleerd overzicht per jaar (30 jaar)</p>
                            </div>
                            <button
                                onClick={() => setIsMatrixOpen(!isMatrixOpen)}
                                className="px-8 py-3 rounded-lg bg-[#00D4AA]/5 hover:bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20 hover:border-[#00D4AA]/40 transition-all duration-300 font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_-5px_rgba(0,212,170,0.1)] hover:shadow-[0_0_30px_-5px_rgba(0,212,170,0.2)] font-mono"
                            >
                                {isMatrixOpen ? 'Verberg Matrix' : 'Bekijk Matrix'}
                            </button>
                        </div>

                        <MatrixTable results={results} isOpen={isMatrixOpen} />
                    </motion.div>

                </div>

            </motion.div>
        </main>
    );
}
