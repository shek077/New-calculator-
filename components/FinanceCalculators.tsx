import React, { useState, useMemo } from 'react';

type FinanceCalc = 'Loan' | 'Discount';

const FinanceCalculators: React.FC = () => {
    const [activeCalc, setActiveCalc] = useState<FinanceCalc>('Loan');

    const renderCalculator = () => {
        switch (activeCalc) {
            case 'Loan': return <LoanCalculator />;
            case 'Discount': return <DiscountCalculator />;
            default: return <LoanCalculator />;
        }
    }

    return (
        <div className="p-4 md:p-6 rounded-3xl neumorphic-flat max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center">Finance Tools</h2>
            <div className="neumorphic-inset p-2 rounded-full flex justify-center gap-2">
                {(['Loan', 'Discount'] as FinanceCalc[]).map(calc => (
                    <button 
                        key={calc} 
                        onClick={() => setActiveCalc(calc)}
                        className={`px-3 py-1.5 text-sm rounded-full ${activeCalc === calc ? 'neumorphic-button bg-[--primary-color] text-white' : ''}`}
                    >
                        {calc === 'Loan' ? 'Loan / EMI' : 'Discount / Tax'}
                    </button>
                ))}
            </div>
            {renderCalculator()}
        </div>
    );
}

const LoanCalculator: React.FC = () => {
    const [amount, setAmount] = useState('100000');
    const [rate, setRate] = useState('8.5');
    const [tenure, setTenure] = useState('5'); // in years

    const emiResult = useMemo(() => {
        const P = parseFloat(amount);
        const R = parseFloat(rate) / 12 / 100;
        const N = parseFloat(tenure) * 12;

        if (P > 0 && R >= 0 && N > 0) {
            if (R === 0) { // Handle 0% interest rate
                const emi = P / N;
                return {
                    emi: emi.toFixed(2),
                    totalInterest: '0.00',
                    totalPayable: P.toFixed(2),
                    error: null
                }
            }
            const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
            const totalPayable = emi * N;
            const totalInterest = totalPayable - P;
            return {
                emi: emi.toFixed(2),
                totalInterest: totalInterest.toFixed(2),
                totalPayable: totalPayable.toFixed(2),
                error: null
            };
        }
        return { 
            emi: '--', 
            totalInterest: '--', 
            totalPayable: '--',
            error: 'Please enter valid, positive values.'
        };
    }, [amount, rate, tenure]);

    return (
        <div className="space-y-4">
            <InputField label="Loan Amount" value={amount} onChange={setAmount} />
            <InputField label="Annual Interest Rate (%)" value={rate} onChange={setRate} />
            <InputField label="Loan Tenure (Years)" value={tenure} onChange={setTenure} />
            <div className="p-4 neumorphic-inset rounded-xl space-y-2">
                <div className="text-center">
                    <p className="text-lg">Monthly EMI</p>
                    <p className="text-4xl font-bold">₹ {emiResult.emi}</p>
                </div>
                {emiResult.error ? (
                    <p className="text-center text-sm text-red-500">{emiResult.error}</p>
                ) : (
                    <div className="flex justify-between text-sm pt-2">
                        <div>
                            <p>Total Interest</p>
                            <p className="font-semibold">₹ {emiResult.totalInterest}</p>
                        </div>
                         <div>
                            <p>Total Payable</p>
                            <p className="font-semibold">₹ {emiResult.totalPayable}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const DiscountCalculator: React.FC = () => {
    const [price, setPrice] = useState('1000');
    const [discount, setDiscount] = useState('15');
    const [tax, setTax] = useState('18');

    const finalPriceResult = useMemo(() => {
        const p = parseFloat(price);
        const d = parseFloat(discount);
        const t = parseFloat(tax);
        if (p > 0 && d >= 0 && d <= 100 && t >= 0) {
            const discountedPrice = p * (1 - d / 100);
            const taxAmount = discountedPrice * (t / 100);
            const finalPrice = discountedPrice + taxAmount;
            const youSave = p - discountedPrice;
            return {
                finalPrice: finalPrice.toFixed(2),
                youSave: youSave.toFixed(2),
                error: null,
            }
        }
        return { 
            finalPrice: '--', 
            youSave: '--',
            error: 'Enter valid price. Discount must be 0-100 & tax non-negative.'
        };
    }, [price, discount, tax]);

    return (
        <div className="space-y-4">
            <InputField label="Original Price" value={price} onChange={setPrice} />
            <InputField label="Discount (%)" value={discount} onChange={setDiscount} />
            <InputField label="Tax / GST (%)" value={tax} onChange={setTax} />
            <div className="p-4 neumorphic-inset rounded-xl space-y-2 text-center">
                 {finalPriceResult.error ? (
                    <p className="text-sm text-red-500 py-8">{finalPriceResult.error}</p>
                ) : (
                    <>
                        <p className="text-lg">Final Price</p>
                        <p className="text-4xl font-bold">₹ {finalPriceResult.finalPrice}</p>
                        <p className="text-lg text-green-600">You save ₹ {finalPriceResult.youSave}</p>
                    </>
                )}
            </div>
        </div>
    );
}

const InputField = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
    <div>
        <label className="text-sm font-semibold ml-2">{label}</label>
        <input 
            type="number" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 mt-1 rounded-xl neumorphic-inset bg-transparent focus:outline-none focus:ring-2 focus:ring-[--primary-color]"
        />
    </div>
);

export default FinanceCalculators;