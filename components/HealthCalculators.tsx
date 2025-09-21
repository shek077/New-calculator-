import React, { useState, useMemo } from 'react';

type HealthCalc = 'BMI' | 'BMR' | 'BodyFat' | 'WaterIntake';

const HealthCalculators: React.FC = () => {
    const [activeCalc, setActiveCalc] = useState<HealthCalc>('BMI');

    const renderCalculator = () => {
        switch (activeCalc) {
            case 'BMI': return <BMICalculator />;
            case 'BMR': return <BMRCalculator />;
            case 'BodyFat': return <BodyFatCalculator />;
            case 'WaterIntake': return <WaterIntakeCalculator />;
            default: return <BMICalculator />;
        }
    }

    return (
        <div className="p-4 md:p-6 rounded-3xl neumorphic-flat max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center">Health & Fitness Tools</h2>
            <div className="neumorphic-inset p-2 rounded-full flex flex-wrap justify-center gap-2">
                {(['BMI', 'BMR', 'BodyFat', 'WaterIntake'] as HealthCalc[]).map(calc => (
                    <button 
                        key={calc} 
                        onClick={() => setActiveCalc(calc)}
                        className={`px-3 py-1.5 text-sm rounded-full ${activeCalc === calc ? 'neumorphic-button bg-[--primary-color] text-white' : ''}`}
                    >
                        {calc === 'BodyFat' ? 'Body Fat %' : calc === 'WaterIntake' ? 'Water Intake' : calc}
                    </button>
                ))}
            </div>
            {renderCalculator()}
        </div>
    );
};


const BMICalculator: React.FC = () => {
    const [height, setHeight] = useState('175'); // in cm
    const [weight, setWeight] = useState('70'); // in kg

    const bmiResult = useMemo(() => {
        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);
        if (h > 0 && w > 0) {
            const bmi = w / (h * h);
            let category = '';
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi < 24.9) category = 'Normal weight';
            else if (bmi < 29.9) category = 'Overweight';
            else category = 'Obesity';
            return { value: bmi.toFixed(2), category };
        }
        return { value: '--', category: 'Enter valid height & weight' };
    }, [height, weight]);
    
    return (
        <div className="space-y-4">
            <InputField label="Height (cm)" value={height} onChange={setHeight} />
            <InputField label="Weight (kg)" value={weight} onChange={setWeight} />
            <div className="text-center p-4 neumorphic-inset rounded-xl">
                <p className="text-lg">Your BMI</p>
                <p className="text-4xl font-bold">{bmiResult.value}</p>
                <p className={`text-lg ${bmiResult.value === '--' ? 'text-red-500' : 'text-[--primary-color]'}`}>{bmiResult.category}</p>
            </div>
        </div>
    );
}

const BMRCalculator: React.FC = () => {
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState('30');
    const [height, setHeight] = useState('175');
    const [weight, setWeight] = useState('70');
    
    const bmr = useMemo(() => {
        const a = parseInt(age);
        const h = parseInt(height);
        const w = parseInt(weight);
        if (a > 0 && h > 0 && w > 0) {
            if (gender === 'male') {
                return (10 * w + 6.25 * h - 5 * a + 5).toFixed(0);
            } else {
                return (10 * w + 6.25 * h - 5 * a - 161).toFixed(0);
            }
        }
        return '--';
    }, [gender, age, height, weight]);
    
    return (
        <div className="space-y-4">
            <div className="flex justify-center p-1 rounded-full neumorphic-inset">
                <button onClick={() => setGender('male')} className={`px-4 py-2 text-sm rounded-full w-1/2 ${gender === 'male' ? 'neumorphic-button' : ''}`}>Male</button>
                <button onClick={() => setGender('female')} className={`px-4 py-2 text-sm rounded-full w-1/2 ${gender === 'female' ? 'neumorphic-button' : ''}`}>Female</button>
            </div>
            <InputField label="Age" value={age} onChange={setAge} />
            <InputField label="Height (cm)" value={height} onChange={setHeight} />
            <InputField label="Weight (kg)" value={weight} onChange={setWeight} />
            <div className="text-center p-4 neumorphic-inset rounded-xl">
                <p className="text-lg">Basal Metabolic Rate (BMR)</p>
                <p className="text-4xl font-bold">{bmr} {bmr !== '--' && <span className="text-2xl">kcal/day</span>}</p>
                {bmr === '--' && <p className="text-sm text-red-500 mt-1">Please enter valid age, height, and weight.</p>}
            </div>
        </div>
    );
}

const BodyFatCalculator: React.FC = () => {
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [height, setHeight] = useState('175');
    const [neck, setNeck] = useState('40');
    const [waist, setWaist] = useState('80');
    const [hip, setHip] = useState('95'); // Only for female

    const bodyFat = useMemo(() => {
        const h = parseFloat(height);
        const n = parseFloat(neck);
        const w = parseFloat(waist);
        const hi = parseFloat(hip);
        if (h > 0 && n > 0 && w > 0) {
            if (gender === 'male' && (w - n) > 0) {
                return (495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450).toFixed(1);
            } else if (gender === 'female' && hi > 0 && (w + hi - n) > 0) {
                return (495 / (1.29579 - 0.35004 * Math.log10(w + hi - n) + 0.22100 * Math.log10(h)) - 450).toFixed(1);
            }
        }
        return '--';
    }, [gender, height, neck, waist, hip]);

    return (
        <div className="space-y-4">
            <div className="flex justify-center p-1 rounded-full neumorphic-inset">
                <button onClick={() => setGender('male')} className={`px-4 py-2 text-sm rounded-full w-1/2 ${gender === 'male' ? 'neumorphic-button' : ''}`}>Male</button>
                <button onClick={() => setGender('female')} className={`px-4 py-2 text-sm rounded-full w-1/2 ${gender === 'female' ? 'neumorphic-button' : ''}`}>Female</button>
            </div>
            <InputField label="Height (cm)" value={height} onChange={setHeight} />
            <InputField label="Neck (cm)" value={neck} onChange={setNeck} />
            <InputField label="Waist (cm)" value={waist} onChange={setWaist} />
            {gender === 'female' && <InputField label="Hip (cm)" value={hip} onChange={setHip} />}
            <div className="text-center p-4 neumorphic-inset rounded-xl">
                <p className="text-lg">Estimated Body Fat</p>
                <p className="text-4xl font-bold">{bodyFat}{bodyFat !== '--' && '%'}</p>
                {bodyFat === '--' && <p className="text-sm text-red-500 mt-1">Please enter valid measurements.</p>}
            </div>
        </div>
    );
}

const WaterIntakeCalculator: React.FC = () => {
    const [weight, setWeight] = useState('70'); // in kg
    const [activity, setActivity] = useState('30'); // in minutes

    const intake = useMemo(() => {
        const w = parseFloat(weight);
        const a = parseFloat(activity);
        if (w > 0 && a >= 0) {
            const baseIntake = w * 0.033; // 33ml per kg
            const activityIntake = (a / 30) * 0.35; // 350ml per 30 mins
            return (baseIntake + activityIntake).toFixed(2);
        }
        return '--';
    }, [weight, activity]);

    return (
        <div className="space-y-4">
            <InputField label="Weight (kg)" value={weight} onChange={setWeight} />
            <InputField label="Daily Activity (minutes)" value={activity} onChange={setActivity} />
            <div className="text-center p-4 neumorphic-inset rounded-xl">
                <p className="text-lg">Suggested Daily Water Intake</p>
                <p className="text-4xl font-bold">{intake} {intake !== '--' && <span className="text-2xl">Liters</span>}</p>
                {intake === '--' && <p className="text-sm text-red-500 mt-1">Please enter a valid weight and activity level.</p>}
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


export default HealthCalculators;