import { useEffect } from 'react';

export const useKeyboardInput = (onInput: (key: string) => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      if (/[0-9]/.test(key)) {
        onInput(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        onInput(key);
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Prevent form submission
        onInput('=');
      } else if (key === 'Backspace') {
        onInput('⌫');
      } else if (key === '.') {
        onInput('.');
      } else if (key === 'Escape') {
        onInput('C');
      } else if (key === '%') {
        onInput('%');
      } else if (key === '(') {
        onInput('(');
      } else if (key === ')') {
        onInput(')');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onInput]);
};