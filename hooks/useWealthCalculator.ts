import { useState, useMemo } from 'react';

export interface WealthInputs {
    loanAmount: number;
    box1Cap: number;
    wozValue: number;
    rateBV: number;
    rateBank: number;
    costBank: number;
    taxIB: number;
    taxVpb: number;
    taxBox3: number;
    yieldBV: number;
    useBox3Savings: boolean;
}

export interface WealthResults {
    delta: number;
    bank: {
        totalWealth: number;
        interestPaid: number;
        taxRefund: number;
        netCost: number;
        altGain: number;
    };
    bv: {
        totalWealth: number;
        interestPaid: number; // Effectively 0 in system view, but tracked for math
        taxRefund: number;
        netIncome: number;
        box3Savings: number;
        taxLoad: number;
    };
    chartData: Array<{ name: string; bank: number; bv: number }>;
    yearlyData: Array<{
        year: number;
        bankInterest: number;
        bankNetCost: number;
        bvInterest: number;
        bvRepayment: number;
        bvTax: number;
        bvNetPosition: number;
        advantage: number;
    }>;
}

const DEFAULT_INPUTS: WealthInputs = {
    loanAmount: 870000,
    box1Cap: 540000,
    wozValue: 870000,
    rateBV: 4.6,
    rateBank: 4.4,
    costBank: 3500,
    taxIB: 37.48,
    taxVpb: 19.0,
    taxBox3: 2.0,
    yieldBV: 1.5,
    useBox3Savings: true,
};

export function useWealthCalculator() {
    const [inputs, setInputs] = useState<WealthInputs>(DEFAULT_INPUTS);

    const results = useMemo<WealthResults>(() => {
        const {
            loanAmount: P,
            box1Cap: Cap,
            wozValue: WOZ,
            rateBV,
            rateBank,
            costBank,
            taxIB,
            taxVpb,
            taxBox3,
            yieldBV,
            useBox3Savings,
        } = inputs;

        // Convert percentages to decimals
        const rBV = rateBV / 100;
        const rBank = rateBank / 100;
        const tIB = taxIB / 100;
        const tVpb = taxVpb / 100;
        const tBox3 = taxBox3 / 100;
        const rYield = yieldBV / 100;

        const YEARS = 30;
        const MONTHS = YEARS * 12;
        const ewfAnnual = WOZ * 0.0035;

        // Monthly Rates
        const mRateBank = rBank / 12;
        const mRateBV = rBV / 12;

        // Annuities
        const payBank = (P * mRateBank) / (1 - Math.pow(1 + mRateBank, -MONTHS));
        const payBV = (P * mRateBV) / (1 - Math.pow(1 + mRateBV, -MONTHS));

        // Simulation Loop
        let balBank = P;
        let balBV = P;
        let sumIntBank = 0;
        let sumIntBV = 0;
        let sumDeductibleIntBV = 0;

        // Deductible Ratios (Box 1 Cap)
        const deductibleRatioBank = Math.min(1, Cap / P);
        const deductibleRatioBV = Math.min(1, Cap / P);

        const yearlyData = [];
        let yearIntBank = 0;
        let yearIntBV = 0;
        let yearRepayBV = 0;
        let yearDeductibleIntBV = 0;

        for (let i = 1; i <= MONTHS; i++) {
            // Bank
            const iBank = balBank * mRateBank;
            sumIntBank += iBank;
            yearIntBank += iBank;
            balBank -= (payBank - iBank);

            // BV
            const iBV = balBV * mRateBV;
            sumIntBV += iBV;
            yearIntBV += iBV;
            yearRepayBV += (payBV - iBV);
            const deductibleInt = iBV * deductibleRatioBV;
            sumDeductibleIntBV += deductibleInt;
            yearDeductibleIntBV += deductibleInt;
            balBV -= (payBV - iBV);

            // End of Year Snapshot
            if (i % 12 === 0) {
                const year = i / 12;

                // Bank Year Calc
                const bankRefundYear = Math.max(0, (yearIntBank * deductibleRatioBank) - ewfAnnual) * tIB;
                const bankNetCostYear = yearIntBank - bankRefundYear;

                // BV Year Calc
                const bvRefundYear = Math.max(0, yearDeductibleIntBV - ewfAnnual) * tIB;
                const bvTaxYear = yearIntBV * tVpb; // Simplification: Vpb on interest revenue
                const bvNetIncomeYear = yearIntBV - bvTaxYear;
                const bvNetIncomeNetYear = bvNetIncomeYear * 0.755; // After Box 2

                // Box 3 Savings Year
                let box3Year = 0;
                if (useBox3Savings && P > Cap) {
                    const avgDebt = yearIntBV / rBV; // Approx
                    box3Year = (avgDebt * (1 - deductibleRatioBank)) * tBox3;
                }

                // BV Net Position (System)
                // You pay yearIntBV (out)
                // BV gets yearIntBV (in) -> Net 0
                // You get bvRefundYear (in)
                // BV pays bvTaxYear (out) + Box 2 (out)
                // You get box3Year (in)
                // Net = bvRefundYear + bvNetIncomeNetYear + box3Year - yearIntBV (wait, yearIntBV is transfer)
                // Let's stick to the HTML logic:
                // Advantage = BV Net Wealth Change - Bank Net Wealth Change
                // Bank Net Wealth Change = - (Interest - Refund) = -NetCost
                // BV Net Wealth Change = (Refund - Interest) + NetIncome + Box3
                // Actually, let's use the row structure from the table:
                // BV Netto = (Refund - Interest) + NetIncome + Box3? 
                // No, let's look at the table columns: BV Rente, BV Aflossing, BV Belasting, BV Netto.
                // BV Netto usually means "What did this cost me net?"
                // Cost = Interest - Refund - Dividend - Box3Savings

                const bvNetCostYear = yearIntBV - bvRefundYear - bvNetIncomeNetYear - box3Year;
                const advantageYear = bankNetCostYear - bvNetCostYear;

                yearlyData.push({
                    year,
                    bankInterest: yearIntBank,
                    bankNetCost: bankNetCostYear,
                    bvInterest: yearIntBV,
                    bvRepayment: yearRepayBV,
                    bvTax: bvTaxYear + (bvNetIncomeYear * 0.245), // Vpb + Box 2
                    bvNetPosition: -bvNetCostYear, // Positive number means gain/less cost? Let's display as cost (negative) or position (positive)? 
                    // Table expects "BV Netto". If negative, it's a cost.
                    // Let's match the visual: Green positive numbers usually mean "money left" or "advantage".
                    // If we want to show "Net Cost", it should be red.
                    // Let's make it consistent with "Voordeel":
                    // Voordeel = Bank Net Cost - BV Net Cost.
                    advantage: advantageYear
                });

                // Reset Year Accumulators
                yearIntBank = 0;
                yearIntBV = 0;
                yearRepayBV = 0;
                yearDeductibleIntBV = 0;
            }
        }

        // --- BANK SCENARIO ---
        // Refund: (Deductible Interest - EWF) * TaxIB + (Cost * TaxIB)
        const bankDeductibleInt = sumIntBank * deductibleRatioBank;
        const refundFromInterestBank = Math.max(0, bankDeductibleInt - (ewfAnnual * YEARS)) * tIB;
        const refundFromCostBank = costBank * tIB;
        const bankRefund = refundFromInterestBank + refundFromCostBank;

        // BV Alternative Gain (Opportunity Cost)
        // If BV didn't lend to you, it would invest P at rYield.
        // Compound Interest Formula: A = P(1 + r)^t
        // Net Yield Rate after Vpb
        const netYieldRate = rYield * (1 - tVpb);
        const bvAltGain = P * (Math.pow(1 + netYieldRate, YEARS) - 1);
        const bvAltGainNet = bvAltGain * 0.755; // After Box 2 (24.5% tax -> 0.755 retained)

        // Total Wealth Bank = (Refund - Interest - Cost) + Opportunity Gain
        // Note: Interest and Cost are outflows (negative), Refund and AltGain are inflows (positive)
        // The formula in HTML: (bankRefund - sumIntBank - costBank) + bvAltGainNet
        // This assumes sumIntBank is positive value of interest paid.
        const totalWealthBank = (bankRefund - sumIntBank - costBank) + bvAltGainNet;


        // --- BV SCENARIO ---
        // Refund: (Deductible Interest - EWF) * TaxIB
        const bvRefund = Math.max(0, sumDeductibleIntBV - (ewfAnnual * YEARS)) * tIB;

        // Box 3 Savings
        let box3TaxSaved = 0;
        if (useBox3Savings && P > Cap) {
            // Average Debt Approximation for Box 3 base
            // HTML Logic: avgDebtSum = sumIntBV / rBV; box3DebtSum = avgDebtSum * (1 - deductibleRatio);
            const avgDebtSum = sumIntBV / rBV;
            const box3DebtSum = avgDebtSum * (1 - deductibleRatioBank);
            box3TaxSaved = box3DebtSum * tBox3;
        }

        // BV Net Income from Interest
        const bvTaxVpb = sumIntBV * tVpb;
        const bvNetIncome = sumIntBV - bvTaxVpb;
        const bvNetIncomeAfterBox2 = bvNetIncome * 0.755;

        // Total Wealth BV Metric (System View)
        // You pay interest (out), BV gets interest (in). Net effect is 0 (Vestzak-Broekzak).
        // You get Refund (in). BV pays Vpb and Box 2 (out).
        // Plus Box 3 savings (in).
        // HTML Formula: (bvRefund - sumIntBV) + bvNetIncomeAfterBox2 + box3TaxSaved
        // Wait, -sumIntBV (you pay) + bvNetIncomeAfterBox2 (you get back net).
        // The "Vestzak-Broekzak" means the interest payment itself cancels out, BUT you lose the tax on it.
        const totalWealthBV = (bvRefund - sumIntBV) + bvNetIncomeAfterBox2 + box3TaxSaved;

        // Delta
        const delta = totalWealthBV - totalWealthBank;

        // Chart Data (Retained Wealth)
        // Bank: Refund + Alt Gain
        const retainedBank = bankRefund + bvAltGainNet;
        // BV: Refund + Net Income + Box 3
        const retainedBV = bvRefund + bvNetIncomeAfterBox2 + box3TaxSaved;

        // Tax Load (for Matrix)
        // Vpb + Box 2 Tax
        const bvTaxLoad = bvTaxVpb + (bvNetIncome * (1 - 0.755));

        return {
            delta,
            bank: {
                totalWealth: totalWealthBank,
                interestPaid: sumIntBank,
                taxRefund: bankRefund,
                netCost: bankRefund - sumIntBank - costBank,
                altGain: bvAltGainNet,
            },
            bv: {
                totalWealth: totalWealthBV,
                interestPaid: sumIntBV,
                taxRefund: bvRefund,
                netIncome: bvNetIncomeAfterBox2,
                box3Savings: box3TaxSaved,
                taxLoad: bvTaxLoad,
            },
            chartData: [
                { name: 'Waardebehoud', bank: retainedBank, bv: retainedBV },
            ],
            yearlyData
        };
    }, [inputs]);

    const updateInput = (key: keyof WealthInputs, value: number | boolean) => {
        setInputs((prev) => ({ ...prev, [key]: value }));
    };

    const reset = () => setInputs(DEFAULT_INPUTS);

    return { inputs, updateInput, reset, results };
}
