import React, { useState, useEffect } from 'react';
import { Upload, Download, Check } from 'lucide-react';
import { Student } from '../types';
import { studentApi } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface MarksFormProps {
  selectedRoll: string;
  onSelectStudentByRoll: (roll: string) => void;
  onExportCsv: () => void;
  onUploadCsv: () => void;
}

export const MarksForm: React.FC<MarksFormProps> = ({
  selectedRoll,
  onSelectStudentByRoll,
  onExportCsv,
  onUploadCsv,
}) => {
  const { accentStyles } = useTheme();

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [math, setMath] = useState<number>(46);
  const [programming, setProgramming] = useState<number>(41);
  const [dbms, setDbms] = useState<number>(94);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const list = await studentApi.getAll();
        setAllStudents(list);
        const current = list.find((s) => s.rollNumber === selectedRoll) || list[0];
        if (current) {
          setStudent(current);
          setMath(current.math);
          setProgramming(current.programming);
          setDbms(current.dbms);
        }
      } catch (err) {
        console.error('Failed to load marks for form', err);
      }
    };
    fetchStudents();
  }, [selectedRoll]);

  const handleSelectStudent = (roll: string) => {
    onSelectStudentByRoll(roll);
    const found = allStudents.find((s) => s.rollNumber === roll);
    if (found) {
      setStudent(found);
      setMath(found.math);
      setProgramming(found.programming);
      setDbms(found.dbms);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    try {
      const updated = await studentApi.updateMarks(student.rollNumber, {
        math,
        programming,
        dbms,
      });
      setStudent(updated);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to update marks', err);
    }
  };

  const handleReset = () => {
    if (student) {
      setMath(student.math);
      setProgramming(student.programming);
      setDbms(student.dbms);
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
          Marks Form
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Changes update the dashboard immediately.
        </p>
      </div>

      {/* Edit Marks Card (Matching Video 00:51, 01:17) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Edit marks — {student?.name || 'Student'}
          </h2>

          {/* Student Selector Dropdown */}
          <div className="mt-2">
            <select
              value={student?.rollNumber || ''}
              onChange={(e) => handleSelectStudent(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {allStudents.map((s) => (
                <option key={s.rollNumber} value={s.rollNumber}>
                  {s.rollNumber} - {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          {/* Math */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Math
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={math}
              onChange={(e) => setMath(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-medium focus:outline-none"
            />
          </div>

          {/* Programming */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Programming
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={programming}
              onChange={(e) => setProgramming(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-medium focus:outline-none"
            />
          </div>

          {/* DBMS */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              DBMS
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={dbms}
              onChange={(e) => setDbms(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-medium focus:outline-none"
            />
          </div>

          {/* Buttons: Save changes and Reset */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className={`rounded-xl px-5 py-2.5 text-xs font-bold shadow-md transition-all ${accentStyles.gradient} hover:opacity-95`}
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-900 text-white px-5 py-2 text-xs font-bold shadow-2xl flex items-center gap-1.5 animate-bounce">
          <span>Marks updated</span>
          <Check className="h-4 w-4 text-emerald-400" />
        </div>
      )}
    </div>
  );
};
