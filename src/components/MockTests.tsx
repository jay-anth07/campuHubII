import React, { useState, useEffect, useRef } from 'react';
import { Upload, Download, FileText, CheckCircle2 } from 'lucide-react';
import { MockTestDoc } from '../types';
import { mockTestApi } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface MockTestsProps {
  onExportCsv: () => void;
  onUploadCsv: () => void;
}

export const MockTests: React.FC<MockTestsProps> = ({ onExportCsv, onUploadCsv }) => {
  const { accentStyles } = useTheme();

  const [mocks, setMocks] = useState<MockTestDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMocks = async () => {
      try {
        const data = await mockTestApi.getAll();
        setMocks(data);
      } catch (err) {
        console.error('Failed to load mock tests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMocks();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const uploaded = await mockTestApi.upload({
        title: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileSize: sizeStr,
      });

      setMocks((prev) => [uploaded, ...prev]);
    } catch (err) {
      console.error('Upload mock failed', err);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      {/* Top Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onUploadCsv}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm transition-colors"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload Student CSV</span>
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Mock Tests
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Upload and manage mock question papers for students.
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Box (Matching Video 01:21) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold shadow-md transition-all ${accentStyles.gradient} hover:opacity-95`}
        >
          <Upload className="h-4 w-4" />
          <span>Upload Mock</span>
        </button>

        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          PDF, Word, PowerPoint or image files are supported.
        </p>
      </div>

      {/* Uploaded Mocks Card (Matching Video 01:21) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Uploaded Mocks ({mocks.length})
        </h2>

        {mocks.length === 0 ? (
          <div className="py-6 text-xs text-slate-400 dark:text-slate-500 font-medium">
            No mock tests uploaded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {mocks.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {m.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {m.fileName} · {m.fileSize} · {m.uploadedAt}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading ${m.fileName}`)}
                  className="rounded-lg p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
