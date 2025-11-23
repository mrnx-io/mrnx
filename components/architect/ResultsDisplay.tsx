import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Building2, Landmark } from 'lucide-react';
import { WealthResults } from '@/hooks/useWealthCalculator';
import clsx from 'clsx';
import { motion, useSpring, useTransform } from 'framer-motion';

interface ResultsDisplayProps {
    results: WealthResults;
}

const formatMoney = (val: number) => {
    const abs = Math.abs(val);
    const str = abs.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    return val < 0 ? `- ${str}` : str;
};

function AnimatedCounter({ value }: { value: number }) {
    const spring = useSpring(0, { stiffness: 50, damping: 20 });
    const display = useTransform(spring, (current) => formatMoney(Math.round(current)));

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
    return (
        <div className="flex flex-col gap-8 h-full font-mono">

            {/* Hero Metric */}
            <div className="relative overflow-hidden group p-10 text-center rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_-10px_rgba(0,212,170,0.15)] transition-all duration-500 hover:shadow-[0_0_70px_-10px_rgba(0,212,170,0.25)]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00D4AA]/10 via-transparent to-[#00D4AA]/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00D4AA]/50 to-transparent opacity-50" />

                <h2 className="text-[#00D4AA] text-xs font-bold uppercase tracking-[0.4em] mb-6 relative z-10 flex items-center justify-center gap-4">
                    <span className="w-8 h-px bg-[#00D4AA]/30"></span>
                    Cumulatief Systeem Voordeel
                    <span className="w-8 h-px bg-[#00D4AA]/30"></span>
                </h2>

                <div className="text-5xl md:text-8xl font-sans font-bold text-white drop-shadow-[0_0_25px_rgba(0,212,170,0.6)] mb-4 tracking-tighter relative z-10">
                    + <AnimatedCounter value={results.delta} />
                </div>

                <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed opacity-80 relative z-10 tracking-wide font-sans">
                    Totaal vermogensverschil tussen lenen bij de bank vs. uw eigen B.V. over de volledige looptijd.
                </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bank Card */}
                <div className="p-8 rounded-2xl bg-[#050505]/80 backdrop-blur-2xl border border-white/10 border-l-2 border-l-red-500/50 shadow-2xl shadow-black/50 group hover:bg-[#0A0A0A] hover:scale-[1.02] hover:shadow-red-500/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-red-500/10">
                            <Landmark className="w-4 h-4 text-red-500" />
                        </div>
                        <h3 className="text-red-500 font-bold text-xs uppercase tracking-[0.2em]">Bank Scenario</h3>
                    </div>
                    <ul className="space-y-4 text-xs text-slate-400">
                        <li className="flex justify-between items-center">
                            <span>Rente Betaald</span>
                            <span className="text-white font-mono bg-white/5 px-2 py-1 rounded">{formatMoney(-results.bank.interestPaid)}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span>Fiscus Terug</span>
                            <span className="text-[#00D4AA] font-mono bg-[#00D4AA]/10 px-2 py-1 rounded">{formatMoney(results.bank.taxRefund)}</span>
                        </li>
                        <li className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                            <span className="font-bold text-slate-200 uppercase tracking-wider">Netto Kosten</span>
                            <span className="font-bold text-red-500 font-mono text-sm">{formatMoney(results.bank.netCost)}</span>
                        </li>
                    </ul>
                </div>

                {/* BV Card */}
                <div className="p-8 rounded-2xl bg-[#050505]/80 backdrop-blur-2xl border border-white/10 border-l-2 border-l-[#00D4AA]/50 shadow-2xl shadow-black/50 group hover:bg-[#0A0A0A] hover:scale-[1.02] hover:shadow-[#00D4AA]/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-[#00D4AA]/10">
                            <Building2 className="w-4 h-4 text-[#00D4AA]" />
                        </div>
                        <h3 className="text-[#00D4AA] font-bold text-xs uppercase tracking-[0.2em]">BV Scenario</h3>
                    </div>
                    <ul className="space-y-4 text-xs text-slate-400">
                        <li className="flex justify-between items-center">
                            <span>IB Teruggave</span>
                            <span className="text-[#00D4AA] font-mono bg-[#00D4AA]/10 px-2 py-1 rounded">{formatMoney(results.bv.taxRefund)}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span>Netto Opbouw BV</span>
                            <span className="text-[#00D4AA] font-mono bg-[#00D4AA]/10 px-2 py-1 rounded">{formatMoney(results.bv.netIncome)}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span>Box 3 Besparing</span>
                            <span className="text-[#00D4AA] font-mono bg-[#00D4AA]/10 px-2 py-1 rounded">{formatMoney(results.bv.box3Savings)}</span>
                        </li>
                        <li className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                            <span className="font-bold text-slate-200 uppercase tracking-wider">Totaal Systeem</span>
                            <span className="font-bold text-[#00D4AA] font-mono text-sm">{formatMoney(results.bv.totalWealth)}</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Chart */}
            <div className="p-8 rounded-2xl bg-[#050505]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 flex-grow min-h-[350px] flex flex-col relative group hover:border-white/20 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#00D4AA]/10">
                            <TrendingUp className="w-4 h-4 text-[#00D4AA]" />
                        </div>
                        <h3 className="text-xs font-bold uppercase text-white tracking-[0.2em]">Waardebehoud</h3>
                    </div>
                    <div className="flex gap-4 text-[10px] uppercase tracking-wider font-bold">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white/10 border border-white/20"></div>
                            <span className="text-slate-500">Bank</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#00D4AA] shadow-[0_0_10px_#00D4AA]"></div>
                            <span className="text-[#00D4AA]">BV</span>
                        </div>
                    </div>
                </div>

                <div className="w-full h-[400px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results.chartData} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                            <XAxis
                                dataKey="name"
                                hide
                            />
                            <YAxis
                                stroke="#475569"
                                fontSize={10}
                                tickFormatter={(val) => `€ ${(val / 1000).toFixed(0)}k`}
                                axisLine={false}
                                tickLine={false}
                                fontFamily="monospace"
                                width={60}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0, 212, 170, 0.03)' }}
                                animationDuration={200}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-black/90 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
                                                <p className="text-slate-400 text-[10px] mb-3 uppercase tracking-widest font-bold">Behouden Vermogen</p>
                                                {payload.map((entry: any) => (
                                                    <div key={entry.name} className="flex items-center justify-between gap-6 text-xs font-mono mb-2 last:mb-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                                            <span className="text-slate-300 uppercase tracking-wider">{entry.name === 'bank' ? 'Bank' : 'BV'}:</span>
                                                        </div>
                                                        <span className="text-white font-bold">{formatMoney(entry.value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="bank" name="Bank Scenario" radius={[4, 4, 0, 0]} animationDuration={1000}>
                                <Cell fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255,255,255,0.1)" />
                            </Bar>
                            <Bar dataKey="bv" name="BV Scenario" radius={[4, 4, 0, 0]} animationDuration={1000}>
                                <Cell fill="rgba(0, 212, 170, 0.6)" stroke="#00D4AA" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}
