import React from 'react';
import { WealthInputs } from '@/hooks/useWealthCalculator';
import { Settings2, Percent, Euro, RotateCcw, Info } from 'lucide-react';
import clsx from 'clsx';

interface ControlPanelProps {
    inputs: WealthInputs;
    updateInput: (key: keyof WealthInputs, value: number | boolean) => void;
    onReset?: () => void;
}

export function ControlPanel({ inputs, updateInput, onReset }: ControlPanelProps) {

    const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
        <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#00D4AA] font-bold border-l-2 border-[#00D4AA] pl-3">
                {label}
            </h3>
            <div className="grid gap-4">
                {children}
            </div>
        </div>
    );

    const NumberInput = ({
        label,
        value,
        field,
        icon: Icon,
        step = 1000,
        min = 0,
        suffix = '€'
    }: {
        label: string,
        value: number,
        field: keyof WealthInputs,
        icon: any,
        step?: number,
        min?: number,
        suffix?: string
    }) => (
        <div className="group relative">
            <label className="block text-[10px] uppercase font-bold tracking-wider mb-2 text-slate-500 group-focus-within:text-white transition-colors duration-300">
                {label}
            </label>
            <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-500 group-focus-within:text-[#00D4AA] transition-colors duration-300">
                    <Icon className="w-4 h-4" />
                </div>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => updateInput(field, Number(e.target.value))}
                    step={step}
                    min={min}
                    className="w-full bg-black/40 border border-white/5 rounded-lg py-3 pl-10 pr-8 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] focus:shadow-[0_0_20px_-5px_rgba(0,212,170,0.3)] transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                />
                <div className="absolute right-3 text-slate-600 text-xs font-mono pointer-events-none">
                    {suffix}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 rounded-2xl bg-[#050505]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 group hover:border-white/20 transition-all duration-500">

            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#00D4AA]/10 border border-[#00D4AA]/20">
                        <Settings2 className="w-5 h-5 text-[#00D4AA]" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm uppercase tracking-widest font-sans">Control Panel</h2>
                        <p className="text-[10px] text-slate-500 font-mono">System Configuration</p>
                    </div>
                </div>
                {onReset && (
                    <button
                        onClick={onReset}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors duration-300 group/reset"
                        title="Reset to Defaults"
                    >
                        <RotateCcw className="w-4 h-4 transition-transform group-hover/reset:-rotate-180 duration-500" />
                    </button>
                )}
            </div>

            <div className="space-y-8">

                {/* Loan Settings */}
                <InputGroup label="Lening Specificaties">
                    <NumberInput
                        label="Hoofdsom Lening"
                        value={inputs.loanAmount}
                        field="loanAmount"
                        icon={Euro}
                    />
                    <NumberInput
                        label="WOZ Waarde"
                        value={inputs.wozValue}
                        field="wozValue"
                        icon={Euro}
                    />
                </InputGroup>

                {/* Interest Rates */}
                <InputGroup label="Rente & Rendement">
                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput
                            label="Rente BV"
                            value={inputs.rateBV}
                            field="rateBV"
                            icon={Percent}
                            step={0.1}
                            suffix="%"
                        />
                        <NumberInput
                            label="Rente Bank"
                            value={inputs.rateBank}
                            field="rateBank"
                            icon={Percent}
                            step={0.1}
                            suffix="%"
                        />
                    </div>
                    <NumberInput
                        label="Rendement BV (Alt)"
                        value={inputs.yieldBV}
                        field="yieldBV"
                        icon={Percent}
                        step={0.1}
                        suffix="%"
                    />
                </InputGroup>

                {/* Fiscal Settings */}
                <InputGroup label="Fiscale Parameters">
                    <NumberInput
                        label="Box 1 Plafond"
                        value={inputs.box1Cap}
                        field="box1Cap"
                        icon={Euro}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput
                            label="IB Tarief"
                            value={inputs.taxIB}
                            field="taxIB"
                            icon={Percent}
                            step={0.1}
                            suffix="%"
                        />
                        <NumberInput
                            label="Vpb Tarief"
                            value={inputs.taxVpb}
                            field="taxVpb"
                            icon={Percent}
                            step={0.1}
                            suffix="%"
                        />
                    </div>
                </InputGroup>

                {/* Toggles */}
                <div className="pt-4 border-t border-white/5">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-white transition-colors">
                            Box 3 Besparing Meenemen
                        </span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={inputs.useBox3Savings}
                                onChange={(e) => updateInput('useBox3Savings', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00D4AA]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D4AA]"></div>
                        </div>
                    </label>
                </div>

            </div>
        </div>
    );
}
