import React, { useState, useMemo } from 'react';
import { UNIT_CONVERTERS } from '../constants';

type ConverterCategory = keyof typeof UNIT_CONVERTERS;

const UnitConverters: React.FC = () => {
  const [category, setCategory] = useState<ConverterCategory>('Length');
  const [fromUnit, setFromUnit] = useState<string>(Object.keys(UNIT_CONVERTERS.Length)[0]);
  const [toUnit, setToUnit] = useState<string>(Object.keys(UNIT_CONVERTERS.Length)[1]);
  const [inputValue, setInputValue] = useState<string>('1');

  const handleCategoryChange = (newCategory: ConverterCategory) => {
    setCategory(newCategory);
    const units = Object.keys(UNIT_CONVERTERS[newCategory]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setInputValue('1');
  };
  
  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return 'Invalid number';

    const units = UNIT_CONVERTERS[category];
    let baseValue: number;

    if (category === 'Temperature') {
      const conversionFunc = (units as any)[fromUnit] as (val: number) => number;
      baseValue = conversionFunc(value);
    } else {
      const fromFactor = (units as any)[fromUnit] as number;
      baseValue = value * fromFactor;
    }
    
    let outputValue: number;
    if (category === 'Temperature') {
      const outputConversionFunc = (UNIT_CONVERTERS.TemperatureOutput as any)[toUnit] as (val: number) => number;
      outputValue = outputConversionFunc(baseValue);
    } else {
      const toFactor = (units as any)[toUnit] as number;
      outputValue = baseValue / toFactor;
    }

    return Number(outputValue.toFixed(6)).toString();
  }, [inputValue, fromUnit, toUnit, category]);
  
  const swapUnits = () => {
    const tempFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempFrom);
  }

  const currentUnits = Object.keys(UNIT_CONVERTERS[category]);

  return (
    <div className="p-4 md:p-6 rounded-3xl neumorphic-flat max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Unit Converter</h2>
      
      <div className="neumorphic-inset p-2 rounded-full flex flex-wrap justify-center gap-2">
        {Object.keys(UNIT_CONVERTERS).filter(c => c !== 'TemperatureOutput').map(cat => (
          <button 
            key={cat} 
            onClick={() => handleCategoryChange(cat as ConverterCategory)}
            className={`px-3 py-1.5 text-sm rounded-full ${category === cat ? 'neumorphic-button bg-[--primary-color] text-white' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold">From</label>
            <input 
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-4 rounded-xl neumorphic-inset bg-transparent focus:outline-none focus:ring-2 focus:ring-[--primary-color]"
            />
             <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full p-4 rounded-xl neumorphic-flat bg-transparent appearance-none focus:outline-none">
                {currentUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
            </select>
        </div>

        <div className="flex justify-center">
            <button onClick={swapUnits} className="p-4 rounded-full neumorphic-button">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </button>
        </div>

        <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold">To</label>
            <div className="w-full p-4 rounded-xl neumorphic-inset font-bold text-2xl truncate">{result}</div>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full p-4 rounded-xl neumorphic-flat bg-transparent appearance-none focus:outline-none">
                {currentUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
            </select>
        </div>
      </div>
       {category === 'Currency' && <p className="text-center text-xs opacity-70">Note: Currency rates are for demonstration and not live.</p>}
    </div>
  );
};

export default UnitConverters;