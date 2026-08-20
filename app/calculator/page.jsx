'use client';

import { useState } from 'react';

const initialValues = {
    principal: '1000',
    monthlyContribution: '100',
    annualRate: '5',
    years: '10'
};

const initialPortfolio = {
    name: 'Portfolio 1',
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
    const [mode, setMode] = useState(null);

    if (mode === 'basic') {
        return <BasicCalculator onBack={() => setMode(null)} />;
    }

    if (mode === 'advanced') {
        return <AdvancedCalculator onBack={() => setMode(null)} />;
    }

    return (
        <div className="max-w-3xl pb-16">
            <h1 className="mb-4">Compounding interest calculator</h1>
            <p className="mb-8 max-w-2xl text-lg">Choose the calculator that fits your needs.</p>
            <div className="grid gap-6 sm:grid-cols-2">
                <button className="flex flex-col items-start gap-3 rounded-sm bg-white p-6 text-left text-neutral-900 transition hover:bg-primary" type="button" onClick={() => setMode('basic')}>
                    <span className="text-2xl font-bold">Basic calculator</span>
                    <span>Estimate the growth of one investment with regular monthly contributions.</span>
                </button>
                <button className="flex flex-col items-start gap-3 rounded-sm bg-white p-6 text-left text-neutral-900 transition hover:bg-primary" type="button" onClick={() => setMode('advanced')}>
                    <span className="text-2xl font-bold">Advanced calculator</span>
                    <span>Compare multiple portfolios and see their combined value, contributions, and interest.</span>
                </button>
            </div>
        </div>
    );
}

function CalculatorHeader({ title, description, onBack }) {
    return (
        <>
            <button className="mb-6 text-sm font-bold underline" type="button" onClick={onBack}>
                Back to calculator options
            </button>
            <h1 className="mb-4">{title}</h1>
            <p className="mb-8 max-w-2xl text-lg">{description}</p>
        </>
    );
}

function BasicCalculator({ onBack }) {
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
            <CalculatorHeader
                title="Basic calculator"
                description="See how your starting balance and regular monthly contributions could grow over time."
                onBack={onBack}
            />

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

function AdvancedCalculator({ onBack }) {
    const [portfolios, setPortfolios] = useState([initialPortfolio]);
    const results = portfolios.map((portfolio) => getPortfolioResult(portfolio));
    const validResults = results.filter(Boolean);
    const totals = validResults.reduce(
        (currentTotals, result) => ({
            contributions: currentTotals.contributions + result.totalContributed,
            value: currentTotals.value + result.finalBalance,
            interest: currentTotals.interest + result.interestEarned
        }),
        { contributions: 0, value: 0, interest: 0 }
    );

    function updatePortfolio(index, event) {
        const { name, value } = event.target;
        setPortfolios((currentPortfolios) =>
            currentPortfolios.map((portfolio, portfolioIndex) =>
                portfolioIndex === index ? { ...portfolio, [name]: value } : portfolio
            )
        );
    }

    function addPortfolio() {
        setPortfolios((currentPortfolios) => [
            ...currentPortfolios,
            { ...initialPortfolio, name: `Portfolio ${currentPortfolios.length + 1}` }
        ]);
    }

    function removePortfolio(index) {
        setPortfolios((currentPortfolios) => currentPortfolios.filter((_, portfolioIndex) => portfolioIndex !== index));
    }

    return (
        <div className="max-w-5xl pb-16">
            <CalculatorHeader
                title="Advanced calculator"
                description="Calculate multiple portfolios and compare their combined results."
                onBack={onBack}
            />
            <div className="flex flex-col gap-6">
                {portfolios.map((portfolio, index) => (
                    <PortfolioForm
                        key={index}
                        portfolio={portfolio}
                        index={index}
                        canRemove={portfolios.length > 1}
                        onChange={updatePortfolio}
                        onRemove={removePortfolio}
                    />
                ))}
                <button className="btn self-start" type="button" onClick={addPortfolio}>
                    Add portfolio
                </button>
            </div>

            <section className="mt-8 rounded-sm bg-white p-6 text-neutral-900 sm:p-8" aria-live="polite">
                <h2 className="mb-6">Combined results</h2>
                {validResults.length === portfolios.length ? (
                    <>
                        <dl className="grid gap-6 sm:grid-cols-3">
                            <div>
                                <dt className="text-neutral-600">Total contributions</dt>
                                <dd className="text-xl font-bold">{formatCurrency(totals.contributions)}</dd>
                            </div>
                            <div>
                                <dt className="text-neutral-600">Combined future value</dt>
                                <dd className="text-xl font-bold text-secondary">{formatCurrency(totals.value)}</dd>
                            </div>
                            <div>
                                <dt className="text-neutral-600">Combined interest</dt>
                                <dd className="text-xl font-bold">{formatCurrency(totals.interest)}</dd>
                            </div>
                        </dl>
                        <ProgressChart portfolios={portfolios} />
                    </>
                ) : (
                    <p className="font-bold text-red-700">Enter valid values for every portfolio. The investment period must be greater than zero.</p>
                )}
            </section>
            <p className="mt-4 text-sm text-white/75">Each portfolio assumes monthly compounding and contributions made at the end of each month.</p>
        </div>
    );
}

function ProgressChart({ portfolios }) {
    const chartWidth = 720;
    const chartHeight = 280;
    const padding = { top: 20, right: 20, bottom: 42, left: 68 };
    const chartInnerWidth = chartWidth - padding.left - padding.right;
    const chartInnerHeight = chartHeight - padding.top - padding.bottom;
    const validPortfolios = portfolios.map(getPortfolioResult);
    const maxYears = Math.max(...validPortfolios.map((portfolio) => portfolio.numbers.years));
    const points = Array.from({ length: maxYears + 1 }, (_, year) => {
        const totalsAtYear = validPortfolios.reduce(
            (currentTotals, portfolio) => {
                const months = Math.min(year, portfolio.numbers.years) * 12;
                const contributed = portfolio.numbers.principal + portfolio.numbers.monthlyContribution * months;
                const value = calculateBalance({ ...portfolio.numbers, years: months / 12 });
                return {
                    contributions: currentTotals.contributions + contributed,
                    value: currentTotals.value + value
                };
            },
            { contributions: 0, value: 0 }
        );
        return { year, ...totalsAtYear };
    });
    const maximumValue = Math.max(...points.map((point) => point.value), 1);
    const x = (year) => padding.left + (year / maxYears) * chartInnerWidth;
    const y = (value) => padding.top + chartInnerHeight - (value / maximumValue) * chartInnerHeight;
    const valuePath = points.map((point) => `${x(point.year)},${y(point.value)}`).join(' ');
    const contributionPath = points.map((point) => `${x(point.year)},${y(point.contributions)}`).join(' ');
    const middleYear = Math.round(maxYears / 2);

    return (
        <figure className="mt-8 border-t border-neutral-200 pt-6">
            <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="font-bold">Progress over time</span>
                <span className="flex gap-4 text-sm text-neutral-600">
                    <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-secondary" />Portfolio value</span>
                    <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-neutral-400" />Contributions</span>
                </span>
            </figcaption>
            <svg className="h-auto w-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-labelledby="progress-chart-title progress-chart-description">
                <title id="progress-chart-title">Combined portfolio progress</title>
                <desc id="progress-chart-description">
                    Portfolio value and contributions increase over {maxYears} years. The final combined portfolio value is {formatCurrency(points[points.length - 1].value)}.
                </desc>
                <line x1={padding.left} y1={padding.top} x2={padding.left} y2={chartHeight - padding.bottom} stroke="#d4d4d4" />
                <line x1={padding.left} y1={chartHeight - padding.bottom} x2={chartWidth - padding.right} y2={chartHeight - padding.bottom} stroke="#d4d4d4" />
                <polyline points={contributionPath} fill="none" stroke="#a3a3a3" strokeWidth="3" strokeDasharray="6 5" />
                <polyline points={valuePath} fill="none" stroke="#016968" strokeWidth="4" />
                <text x={padding.left} y={chartHeight - 12} fill="#525252" fontSize="13">Year 0</text>
                <text x={x(middleYear)} y={chartHeight - 12} fill="#525252" fontSize="13" textAnchor="middle">Year {middleYear}</text>
                <text x={chartWidth - padding.right} y={chartHeight - 12} fill="#525252" fontSize="13" textAnchor="end">Year {maxYears}</text>
                <text x="8" y={padding.top + 5} fill="#525252" fontSize="13">{formatCurrency(maximumValue)}</text>
                <text x="8" y={chartHeight - padding.bottom} fill="#525252" fontSize="13">$0</text>
            </svg>
            <p className="sr-only">The solid line shows combined portfolio value. The dashed line shows total contributions.</p>
        </figure>
    );
}

function getPortfolioResult(portfolio) {
    const numbers = Object.fromEntries(
        Object.entries(portfolio)
            .filter(([key]) => key !== 'name')
            .map(([key, value]) => [key, Number(value)])
    );
    const isValid =
        Object.entries(portfolio)
            .filter(([key]) => key !== 'name')
            .every(([, value]) => value.trim() !== '') &&
        Object.values(numbers).every((value) => Number.isFinite(value) && value >= 0) &&
        numbers.years > 0;

    if (!isValid) {
        return null;
    }

    const totalContributed = numbers.principal + numbers.monthlyContribution * numbers.years * 12;
    const finalBalance = calculateBalance(numbers);
    return { numbers, totalContributed, finalBalance, interestEarned: finalBalance - totalContributed };
}

function PortfolioForm({ portfolio, index, canRemove, onChange, onRemove }) {
    const result = getPortfolioResult(portfolio);
    const fields = [
        ['principal', 'Starting balance'],
        ['monthlyContribution', 'Monthly contribution'],
        ['annualRate', 'Annual interest rate'],
        ['years', 'Investment period']
    ];

    return (
        <section className="rounded-sm bg-white p-6 text-neutral-900 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <label className="flex flex-col gap-2 font-bold" htmlFor={`portfolio-name-${index}`}>
                    Portfolio name
                    <input
                        className="input"
                        id={`portfolio-name-${index}`}
                        name="name"
                        type="text"
                        value={portfolio.name}
                        onChange={(event) => onChange(index, event)}
                    />
                </label>
                <button className="text-sm font-bold underline disabled:cursor-default disabled:opacity-50" type="button" disabled={!canRemove} onClick={() => onRemove(index)}>
                    Remove portfolio
                </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
                {fields.map(([name, label]) => (
                    <label className="flex flex-col gap-2 font-bold" htmlFor={`portfolio-${index}-${name}`} key={name}>
                        {label}
                        <input
                            className="input"
                            id={`portfolio-${index}-${name}`}
                            name={name}
                            type="number"
                            min={name === 'years' ? '1' : '0'}
                            step={name === 'years' ? '1' : '0.01'}
                            inputMode={name === 'years' ? 'numeric' : 'decimal'}
                            value={portfolio[name]}
                            onChange={(event) => onChange(index, event)}
                        />
                    </label>
                ))}
            </div>
            <div className="mt-6 border-t border-neutral-200 pt-6" aria-live="polite">
                {result ? (
                    <dl className="grid gap-4 text-sm sm:grid-cols-3">
                        <div><dt className="text-neutral-600">Contributions</dt><dd className="text-lg font-bold">{formatCurrency(result.totalContributed)}</dd></div>
                        <div><dt className="text-neutral-600">Future value</dt><dd className="text-lg font-bold text-secondary">{formatCurrency(result.finalBalance)}</dd></div>
                        <div><dt className="text-neutral-600">Interest</dt><dd className="text-lg font-bold">{formatCurrency(result.interestEarned)}</dd></div>
                    </dl>
                ) : (
                    <p className="font-bold text-red-700">Enter valid values for this portfolio.</p>
                )}
            </div>
        </section>
    );
}