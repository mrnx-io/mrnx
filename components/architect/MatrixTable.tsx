import React from 'react';
import { WealthResults } from '@/hooks/useWealthCalculator';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface MatrixTableProps {
    results: WealthResults;
    isOpen: boolean;
}

const formatMoney = (val: number) => {
    const abs = Math.abs(val);
    const str = abs.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    return val < 0 ? `- ${str}` : str;
};

export function MatrixTable({ results, isOpen }: MatrixTableProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                >
                    <div className="p-6 rounded-2xl bg-[#050505]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 mt-6 overflow-x-auto">
                        <div className="w-full overflow-x-auto rounded-xl border border-white/5 bg-black/40 backdrop-blur-xl shadow-inner relative">
                            {/* Decorative top border */}
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00D4AA]/50 to-transparent" />

                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest font-sans sticky left-0 bg-black/60 backdrop-blur-xl z-10">Jaar</th>
                                        <th className="p-4 text-xs font-bold text-red-400 uppercase tracking-widest font-sans text-right">Bank Rente</th>
                                        <th className="p-4 text-xs font-bold text-red-400 uppercase tracking-widest font-sans text-right">Bank Netto</th>
                                        <th className="p-4 text-xs font-bold text-[#00D4AA] uppercase tracking-widest font-sans text-right border-l border-white/5">BV Rente</th>
                                        <th className="p-4 text-xs font-bold text-[#00D4AA] uppercase tracking-widest font-sans text-right">BV Aflossing</th>
                                        <th className="p-4 text-xs font-bold text-[#00D4AA] uppercase tracking-widest font-sans text-right">BV Belasting</th>
                                        <th className="p-4 text-xs font-bold text-[#00D4AA] uppercase tracking-widest font-sans text-right">BV Netto</th>
                                        <th className="p-4 text-xs font-bold text-white uppercase tracking-widest font-sans text-right bg-white/5">Voordeel</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono text-xs">
                                    {results.yearlyData.map((row, i) => (
                                        <tr
                                            key={row.year}
                                            className="group hover:bg-white/[0.02] transition-colors duration-200 border-b border-white/5 last:border-0 relative"
                                        >
                                            <td className="p-4 text-slate-500 font-bold sticky left-0 bg-black/60 backdrop-blur-xl group-hover:bg-black/80 transition-colors z-10 border-r border-white/5">
                                                {row.year}
                                            </td>
                                            <td className="p-4 text-slate-400 text-right group-hover:text-red-400/70 transition-colors">
                                                {Math.round(row.bankInterest).toLocaleString('nl-NL')}
                                            </td>
                                            <td className="p-4 text-slate-400 text-right group-hover:text-red-400 transition-colors">
                                                {Math.round(row.bankNetCost).toLocaleString('nl-NL')}
                                            </td>
                                            <td className="p-4 text-slate-400 text-right border-l border-white/5 group-hover:text-[#00D4AA]/70 transition-colors">
                                                {Math.round(row.bvInterest).toLocaleString('nl-NL')}
                                            </td>
                                            <td className="p-4 text-slate-500 text-right">
                                                {Math.round(row.bvRepayment).toLocaleString('nl-NL')}
                                            </td>
                                            <td className="p-4 text-slate-500 text-right">
                                                {Math.round(row.bvTax).toLocaleString('nl-NL')}
                                            </td>
                                            <td className="p-4 text-[#00D4AA] font-bold text-right group-hover:text-[#00ffcc] transition-colors shadow-[inset_0_0_20px_rgba(0,212,170,0)] group-hover:shadow-[inset_0_0_20px_rgba(0,212,170,0.05)]">
                                                {Math.round(row.bvNetPosition).toLocaleString('nl-NL')}
                                            </td>
                                            <td className="p-4 text-white font-bold text-right bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors">
                                                + {Math.round(row.advantage).toLocaleString('nl-NL')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
