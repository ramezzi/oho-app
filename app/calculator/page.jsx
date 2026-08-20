'use client';

import { useState } from 'react';

const initialValues = {
    principal: '1000',
    monthlyContribution: '100',
    annualRate: '5',
    years: '10'
};

function calculateBalance({ principal, monthlyContribution, annualRate, years }) {
    const months = years * 12;
    const monthlyRate = annualRate / 100 / 12;

    if (monthlyRate === 0) {
        return principal + monthlyContribution * months;
    }

    const growth = (1 + monthlyRate) ** months;
    return principal * growth + monthlyContribution * ((growth - 1) / monthlyRate);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
    }).format(value);
}

export default function CalculatorPage() {
    const [values, setValues] = useState(initialValues);

    const numbers = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value)]));
    const isValid =
        Object.values(values).every((value) => value.trim() !== '') &&
        Object.values(numbers).every((value) => Number.isFinite(value) && value >= 0) &&
        numbers.years > 0;
    const totalContributed = isValid
        ? numbers.principal + numbers.monthlyContribution * numbers.years * 12
        : 0;
    const finalBalance = isValid ? calculateBalance(numbers) : 0;
    const interestEarned = finalBalance - totalContributed;

    function updateValue(event) {
        setValues((currentValues) => ({ ...currentValues, [event.target.name]: event.target.value }));
    }

    return (
        <div className="max-w-3xl pb-16">
            <h1 className="mb-4">Compounding interest calculator</h1>
            <p className="mb-8 max-w-2xl text-lg">
                See how your starting balance and regular monthly contributions could grow over time.
            </p>

            <form className="flex flex-col gap-6 rounded-sm bg-white p-6 text-neutral-900 sm:p-8" onSubmit={(event) => event.preventDefault()}>
                <div className="grid gap-6 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 font-bold" htmlFor="principal">
                        Starting balance
                        <span className="font-normal text-neutral-600">Amount you invest today</span>
                        <input
                            className="input"
                            id="principal"
                            name="principal"
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={values.principal}
                            onChange={updateValue}
                        />
                    </label>
                    <label className="flex flex-col gap-2 font-bold" htmlFor="monthlyContribution">
                        Monthly contribution
                        <span className="font-normal text-neutral-600">Amount added each month</span>
                        <input
                            className="input"
                            id="monthlyContribution"
                            name="monthlyContribution"
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={values.monthlyContribution}
                            onChange={updateValue}
                        />
                    </label>
                    <label className="flex flex-col gap-2 font-bold" htmlFor="annualRate">
                        Annual interest rate
                        <span className="font-normal text-neutral-600">Expected return before compounding</span>
                        <input
                            className="input"
                            id="annualRate"
                            name="annualRate"
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={values.annualRate}
                            onChange={updateValue}
                        />
                    </label>
                    <label className="flex flex-col gap-2 font-bold" htmlFor="years">
                        Investment period
                        <span className="font-normal text-neutral-600">How many years you invest</span>
                        <input
                            className="input"
                            id="years"
                            name="years"
                            type="number"
                            min="1"
                            step="1"
                            inputMode="numeric"
                            value={values.years}
                            onChange={updateValue}
                        />
                    </label>
                </div>

                <div className="border-t border-neutral-200 pt-6" aria-live="polite">
                    {isValid ? (
                        <>
                            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-neutral-600">Estimated future value</p>
                            <p className="text-4xl font-bold text-secondary">{formatCurrency(finalBalance)}</p>
                            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                                <div>
                                    <dt className="text-neutral-600">Total contributions</dt>
                                    <dd className="text-lg font-bold">{formatCurrency(totalContributed)}</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-600">Interest earned</dt>
                                    <dd className="text-lg font-bold">{formatCurrency(interestEarned)}</dd>
                                </div>
                            </dl>
                        </>
                    ) : (
                        <p className="font-bold text-red-700">Enter a valid amount for each field. The investment period must be greater than zero.</p>
                    )}
                </div>
            </form>
            <p className="mt-4 text-sm text-white/75">This estimate assumes monthly compounding and contributions made at the end of each month.</p>
        </div>
    );
}