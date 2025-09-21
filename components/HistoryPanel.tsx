import React, { useState } from 'react';
import type { HistoryEntry } from '../types';
import { generateHistoryPdf } from '../services/pdfService';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClear: () => void;
  onDelete: (id: string) => void;
  onEdit: (id:string, newExpression: string) => void;
  onRecall: (expression: string) => void;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClear, onDelete, onEdit, onRecall, onClose }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (entry: HistoryEntry) => {
    setEditingId(entry.id);
    setEditText(entry.expression);
  };

  const handleSave = (id: string) => {
    onEdit(id, editText);
    setEditingId(null);
  }

  return (
    <div className="absolute inset-0 bg-[--bg-color] bg-opacity-95 z-20 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">History</h2>
        <button onClick={onClose} className="p-2 rounded-full neumorphic-flat">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="flex-grow overflow-y-auto neumorphic-inset p-2 rounded-lg">
        {history.length === 0 ? (
          <p className="text-center p-4">No history yet.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((entry) => (
              <li key={entry.id} className="p-2 rounded-lg neumorphic-flat flex flex-col">
                {editingId === entry.id ? (
                   <input 
                    type="text" 
                    value={editText} 
                    onChange={(e) => setEditText(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSave(entry.id)}
                    className="bg-transparent border-b-2 border-[--primary-color] flex-grow focus:outline-none"
                  />
                ) : (
                  <>
                    <span className="text-sm text-[--text-color] opacity-75">{entry.expression}</span>
                    <span className="text-xl font-semibold">= {entry.result}</span>
                  </>
                )}
                <div className="flex space-x-2 mt-2 self-end">
                  {editingId === entry.id ? (
                     <button onClick={() => handleSave(entry.id)} className="text-xs p-1 rounded bg-[--primary-color] text-white">Save</button>
                  ) : (
                    <button onClick={() => handleEdit(entry)} className="text-xs p-1 rounded">Edit</button>
                  )}
                  <button onClick={() => onRecall(entry.expression)} className="text-xs p-1 rounded">Recall</button>
                  <button onClick={() => onDelete(entry.id)} className="text-xs p-1 rounded text-red-500">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4 flex space-x-2">
        <button onClick={() => generateHistoryPdf(history)} className="flex-1 p-3 rounded-lg neumorphic-button bg-[--primary-color] text-white">Export as PDF</button>
        <button onClick={onClear} className="flex-1 p-3 rounded-lg neumorphic-button bg-red-500 text-white">Clear History</button>
      </div>
    </div>
  );
};

export default HistoryPanel;
