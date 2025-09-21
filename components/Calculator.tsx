import React, { useState, useCallback, useEffect, useRef } from 'react';
import { BASIC_BUTTONS, SCIENTIFIC_BUTTONS } from '../constants';
import NeumorphicButton from './NeumorphicButton';
import HistoryPanel from './HistoryPanel';
import type { HistoryEntry } from '../types';
import { useKeyboardInput } from '../hooks/useKeyboardInput';

// @ts-ignore - math is imported from CDN
const math = window.math;
// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

interface CalculatorProps {
  history: HistoryEntry[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
}

const Calculator: React.FC<CalculatorProps> = ({ history, setHistory }) => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isScientific, setIsScientific] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isRadians, setIsRadians] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const formatResult = (value: any) => {
    if (typeof value === 'number') {
      return Number(value.toPrecision(14)).toString();
    }
    return String(value);
  }
  
  const speak = (text: string) => {
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const handleInput = useCallback((val: string) => {
    if (val === '=') {
      if (expression.trim() === '') return;
      if (/\/0(?!\.)/.test(expression)) {
          setResult('Division by zero');
          return;
      }
      try {
        const evalResult = math.evaluate(expression.replace(/√/g, 'sqrt').replace(/π/g, 'pi').replace(/\^/g, '^'));
        const formattedResult = formatResult(evalResult);
        
        const newEntry: HistoryEntry = {
            id: new Date().toISOString(),
            expression: expression,
            result: formattedResult,
        };
        setHistory(prev => [newEntry, ...prev].slice(0, 50));
        setResult(formattedResult);
        setExpression(formattedResult);
        speak(`The result is ${formattedResult}`);
      } catch (error) {
        setResult('Invalid Format');
      }
    } else if (val === 'C') {
      setExpression('');
      setResult('0');
    } else if (val === '⌫') {
      setExpression(prev => prev.slice(0, -1));
    } else if (['sin', 'cos', 'tan', 'log', 'ln'].includes(val)) {
        const angleToRad = (angle: number) => isRadians ? angle : angle * Math.PI / 180;
        try {
            if (expression.trim() === '' || isNaN(parseFloat(expression))) {
                setResult('Invalid Input');
                return;
            }
            const num = math.evaluate(expression);
            const tempResult = formatResult(
                val === 'log' ? math.log10(num) :
                val === 'ln' ? math.log(num) :
                math[val](angleToRad(num))
            );
            setResult(tempResult);
            setExpression(tempResult);
        } catch {
            setResult('Invalid Input');
        }
    } else if (val === 'x!') {
        try {
            if (expression.trim() === '') {
                setResult('Invalid Input');
                return;
            }
            const num = math.evaluate(expression);
            if (!Number.isInteger(num) || num < 0) {
                setResult('Factorial Error');
                return;
            }
            const tempResult = formatResult(math.factorial(num));
            setResult(tempResult);
            setExpression(tempResult);
        } catch {
            setResult('Invalid Input');
        }
    }
    else {
      const isErrorState = result !== '0' && (result.includes('Error') || result.includes('Invalid') || result.includes('zero') || result.includes('Format'));
      if (isErrorState) {
          setExpression(val);
      } else if (result !== '0' && expression === result) {
          if (['+', '-', '*', '/', '^', '%'].includes(val)) {
             setExpression(result + val);
          } else {
             setExpression(val);
          }
      }
      else {
         setExpression(prev => prev + val);
      }
      setResult('0');
    }
  }, [expression, result, isRadians, setHistory]);

  useKeyboardInput(handleInput);
  
  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      let transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Voice transcript:', transcript);
      
      transcript = transcript
        .replace(/what is|calculate/g, '')
        .replace(/plus/g, '+')
        .replace(/minus/g, '-')
        .replace(/times|x|multiply by/g, '*')
        .replace(/divided by|divide/g, '/')
        .replace(/point/g, '.')
        .replace(/power|to the power of/g, '^')
        .replace(/\s+/g, '');
        
      if (transcript.includes('equal')) {
        const finalExpression = transcript.replace(/equal(s?)/g, '');
        setExpression(finalExpression);
        handleInput('=');
      } else if (transcript.includes('clear') || transcript.includes('reset')) {
        handleInput('C');
      } else {
        setExpression(transcript);
      }
    };
    
    recognition.onerror = (event: any) => {
        let errorMessage = 'An unknown error occurred.';
        switch (event.error) {
            case 'no-speech':
                errorMessage = 'No speech was detected. Please try again.';
                break;
            case 'audio-capture':
                errorMessage = 'Microphone problem. Please check your microphone.';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone access denied. Please allow access in your browser settings.';
                break;
            case 'network':
                errorMessage = 'A network error occurred. Please check your connection.';
                break;
        }
        setResult(errorMessage);
        console.error('Speech recognition error:', event.error, errorMessage);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
  }, [handleInput]);

  const handleToggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Voice assistance is not available on this browser.");
      }
    }
  };
  
  const getButtonType = (btn: string) => {
    if (['/', '*', '-', '+', '^', '%'].includes(btn)) return 'operator';
    if (['C', '⌫'].includes(btn)) return 'control';
    if (btn === '=') return 'equals';
    return 'default';
  };

  const buttons = isScientific ? SCIENTIFIC_BUTTONS : BASIC_BUTTONS;
  const flatButtons = buttons.flat();

  return (
    <div className="p-4 md:p-6 rounded-3xl neumorphic-flat max-w-md mx-auto relative overflow-hidden">
      {showHistory && (
        <HistoryPanel 
            history={history} 
            onClear={() => setHistory([])}
            onDelete={(id) => setHistory(prev => prev.filter(item => item.id !== id))}
            onEdit={(id, newExp) => {
                try {
                    const newResult = formatResult(math.evaluate(newExp));
                    setHistory(prev => prev.map(item => item.id === id ? { ...item, expression: newExp, result: newResult } : item));
                } catch {
                    alert("Invalid expression");
                }
            }}
            onRecall={(exp) => {
                setExpression(exp);
                setShowHistory(false);
            }}
            onClose={() => setShowHistory(false)} 
        />
      )}
      
      {/* Display */}
      <div className="neumorphic-inset p-4 rounded-xl mb-4 text-right overflow-x-auto">
        <div className="text-xl opacity-70 break-all">{expression || ' '}</div>
        <div className="text-5xl font-bold break-all">{result}</div>
      </div>

      {/* Toggles */}
      <div className="flex justify-between items-center mb-4 px-2">
         <div className="flex items-center space-x-2">
            <button onClick={() => setShowHistory(true)} className="p-2 neumorphic-flat rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            <button onClick={handleToggleListen} className={`p-2 neumorphic-flat rounded-full relative ${isListening ? 'animate-pulse' : ''}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                 {isListening && <span className="absolute inset-0 rounded-full ring-2 ring-[--primary-color] opacity-75"></span>}
            </button>
         </div>
         <div className="flex space-x-2 p-1 rounded-full neumorphic-inset">
             <button onClick={() => setIsScientific(false)} className={`px-3 py-1 text-sm rounded-full ${!isScientific ? 'neumorphic-button' : ''}`}>Basic</button>
             <button onClick={() => setIsScientific(true)} className={`px-3 py-1 text-sm rounded-full ${isScientific ? 'neumorphic-button' : ''}`}>Sci</button>
         </div>
         {isScientific && (
             <div className="flex space-x-2 p-1 rounded-full neumorphic-inset">
                <button onClick={() => setIsRadians(true)} className={`px-2 py-1 text-sm rounded-full ${isRadians ? 'neumorphic-button' : ''}`}>Rad</button>
                <button onClick={() => setIsRadians(false)} className={`px-2 py-1 text-sm rounded-full ${!isRadians ? 'neumorphic-button' : ''}`}>Deg</button>
             </div>
         )}
      </div>

      {/* Buttons */}
      <div className={`grid gap-3 ${isScientific ? 'grid-cols-5' : 'grid-cols-4'}`}>
        {flatButtons.map((btn, i) => {
          const buttonType = getButtonType(btn);
          const isWide = btn === '0' && !isScientific;
          const isFullWidth = btn === '=' && isScientific && i === flatButtons.length - 1;
          
          return (
            <NeumorphicButton
              key={i}
              onClick={() => handleInput(btn)}
              className={`
                text-2xl h-16 
                ${isWide ? 'col-span-2' : ''}
                ${isFullWidth ? 'col-span-5' : ''}
                ${buttonType === 'operator' ? 'text-[--primary-color]' : ''}
                ${buttonType === 'control' ? 'text-red-500' : ''}
                ${buttonType === 'equals' ? 'bg-[--primary-color] text-white' : ''}
              `}
            >
              {btn}
            </NeumorphicButton>
          );
        })}
      </div>
    </div>
  );
};

export default Calculator;