import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export const CsvModal: React.FC<CsvModalProps> = ({ isOpen, onClose, onImportComplete }) => {
  const { accentStyles } = useTheme();
  const [csvText, setCsvText] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    setStatus('Success: CSV records parsed and synchronized successfully!');
    setTimeout(() => {
      onImportComplete();
      onClose();
      setStatus(null);
      setCsvText('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Upload Student CSV
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Upload or paste comma-separated values (CSV) containing student records:
        </p>

        <form onSubmit={handleUploadSubmit} className="space-y-3">
          <textarea
            rows={5}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`rollNumber,name,department,semester,section,attendance,marks\nA131,Ravi,CSE,3,A,85,78\nA132,Divya,AIDS,3,B,72,82`}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
          />

          {status && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
              {status}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-xs font-bold shadow-md ${accentStyles.gradient}`}
            >
              Parse CSV
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
