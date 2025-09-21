import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator';
import UnitConverters from './components/UnitConverters';
import HealthCalculators from './components/HealthCalculators';
import FinanceCalculators from './components/FinanceCalculators';
import { THEME_DETAILS } from './constants';
import { Theme, ActiveTab } from './types';
import type { HistoryEntry } from './types';

const App: React.FC = () => {
  // Initialize state from localStorage, with defaults
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('mintCalcTheme') as Theme;
    return savedTheme && Object.values(Theme).includes(savedTheme) ? savedTheme : Theme.Lime;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const savedTab = localStorage.getItem('mintCalcActiveTab') as ActiveTab;
    return savedTab && Object.values(ActiveTab).includes(savedTab) ? savedTab : ActiveTab.Calculator;
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const savedHistory = localStorage.getItem('mintCalcHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Failed to parse history from localStorage:", error);
      return [];
    }
  });

  // Effect to save theme to localStorage and update document class
  useEffect(() => {
    localStorage.setItem('mintCalcTheme', theme);
    document.documentElement.className = THEME_DETAILS[theme].class;
  }, [theme]);

  // Effect to save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('mintCalcActiveTab', activeTab);
  }, [activeTab]);

  // Effect to save history to localStorage
  useEffect(() => {
    localStorage.setItem('mintCalcHistory', JSON.stringify(history));
  }, [history]);


  const renderActiveTab = () => {
    switch (activeTab) {
      case ActiveTab.Calculator:
        return <Calculator history={history} setHistory={setHistory} />;
      case ActiveTab.UnitConverter:
        return <UnitConverters />;
      case ActiveTab.Health:
        return <HealthCalculators />;
      case ActiveTab.Finance:
        return <FinanceCalculators />;
      default:
        return <Calculator history={history} setHistory={setHistory} />;
    }
  };

  return (
    <div className="min-h-screen w-full font-sans transition-colors duration-300 p-2 sm:p-4 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-4 flex justify-between items-center p-2 rounded-2xl neumorphic-flat">
        <h1 className="text-xl sm:text-2xl font-bold text-[--primary-color] hidden sm:block">
          MINTCALC
        </h1>
        <nav className="neumorphic-inset p-1 rounded-full flex-grow sm:flex-grow-0 flex justify-center space-x-1">
          {Object.values(ActiveTab).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-full transition-all duration-200 ${
                activeTab === tab ? 'neumorphic-button bg-[--primary-color] text-white' : 'text-[--text-color]'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
           <div className="relative group">
                <button className="p-3 rounded-full neumorphic-flat">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </button>
                <div className="absolute right-0 mt-2 w-40 neumorphic-flat rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10">
                    {Object.values(Theme).map((themeKey) => (
                        <button key={themeKey} onClick={() => setTheme(themeKey)} className="w-full text-left p-2 rounded-md hover:bg-[--shadow-dark]">
                            {THEME_DETAILS[themeKey].name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </header>
      <main className="w-full max-w-4xl flex-grow">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default App;