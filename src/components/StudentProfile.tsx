import React, { useState, useEffect } from 'react';
import { Upload, Download, Check, AlertTriangle } from 'lucide-react';
import { Student } from '../types';
import { studentApi } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface StudentProfileProps {
  selectedRoll: string;
  onSelectStudentByRoll: (roll: string) => void;
  onNavigateToMarks: (roll: string) => void;
  onExportCsv: () => void;
  onUploadCsv: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  selectedRoll,
  onSelectStudentByRoll,
  onNavigateToMarks,
  onExportCsv,
  onUploadCsv,
}) => {
  const { accentStyles } = useTheme();

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [attendance, setAttendance] = useState(84);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const list = await studentApi.getAll();
        setAllStudents(list);
        const current = list.find((s) => s.rollNumber === selectedRoll) || list[0];
        if (current) {
          setStudent(current);
          setNameInput(current.name);
          setAttendance(current.attendance);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [selectedRoll]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roll = e.target.value;
    onSelectStudentByRoll(roll);
    const found = allStudents.find((s) => s.rollNumber === roll);
    if (found) {
      setStudent(found);
      setNameInput(found.name);
      setAttendance(found.attendance);
    }
  };

  const handleUpdateName = async () => {
    if (!student || !nameInput.trim()) return;
    try {
      const updated = await studentApi.update(student.rollNumber, { name: nameInput.trim() });
      setStudent(updated);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to update name', err);
    }
  };

  const handleAttendanceChange = async (newVal: number) => {
    setAttendance(newVal);
    if (!student) return;
    try {
      await studentApi.update(student.rollNumber, { attendance: newVal });
      setStudent((prev) => (prev ? { ...prev, attendance: newVal } : prev));
    } catch (err) {
      console.error('Failed to update attendance', err);
    }
  };

  if (!student && !loading) {
    return (
      <div className="py-12 text-center text-xs text-slate-400">
        Student not found.
      </div>
    );
  }

  const isSafe = attendance >= 75;

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

      {/* Header & Student Switcher */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Student Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Manage attendance, student details and marks.
        </p>

        {/* Student Selector Dropdown (Matching Video 00:47) */}
        <div className="mt-4">
          <select
            value={student?.rollNumber || ''}
            onChange={handleSelectChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none cursor-pointer"
          >
            {allStudents.map((s) => (
              <option key={s.rollNumber} value={s.rollNumber}>
                {s.name} ({s.rollNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {student && (
        <>
          {/* Main Profile Card (Matching Video 00:47, 01:07) */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col items-center text-center space-y-4">
            {/* Square Initial Badge */}
            <div className={`h-24 w-24 rounded-2xl ${accentStyles.gradient} flex items-center justify-center font-bold text-white text-4xl shadow-md`}>
              {student.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {student.name}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                {student.rollNumber} · {student.department} · {student.semester}rd · Section {student.section}
              </p>
            </div>

            {/* Attendance Percentage Pill */}
            <div
              className={`rounded-xl px-6 py-2 font-black text-3xl shadow-inner ${
                isSafe
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
              }`}
            >
              {attendance}%
            </div>

            {/* Attendance Status */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {isSafe ? (
                <>
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    Attendance on track
                  </span>
                </>
              ) : (
                <>
                  <span className="text-rose-500">⚠️</span>
                  <span className="text-rose-600 dark:text-rose-400">
                    Below 75% attendance
                  </span>
                </>
              )}
            </div>

            {/* Name Change Input */}
            <div className="w-full pt-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block text-left mb-1">
                Student name
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                />
                <button
                  onClick={handleUpdateName}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline px-2"
                >
                  Change name
                </button>
              </div>
            </div>

            {/* Update Attendance Slider (Matching Video 00:47, 01:08) */}
            <div className="w-full pt-1 space-y-2 text-left">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Update attendance: <span className="font-bold text-slate-900 dark:text-white">{attendance}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={attendance}
                onChange={(e) => handleAttendanceChange(parseInt(e.target.value, 10))}
                className={`w-full ${accentStyles.slider} cursor-pointer h-2 bg-slate-200 rounded-lg`}
              />
            </div>

            {/* Edit Marks Button (Navigates to Marks Form) */}
            <button
              onClick={() => onNavigateToMarks(student.rollNumber)}
              className={`w-full py-3 rounded-xl text-xs font-bold shadow-md transition-all ${accentStyles.gradient} hover:opacity-95`}
            >
              Edit marks
            </button>
          </div>

          {/* Subject-Wise Marks Card (Matching Video 00:48) */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Subject-wise Marks
            </h3>

            {/* Math */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Math</span>
                <span>{student.math}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${accentStyles.gradient}`}
                  style={{ width: `${Math.min(100, student.math)}%` }}
                />
              </div>
            </div>

            {/* Programming */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Programming</span>
                <span>{student.programming}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${accentStyles.gradient}`}
                  style={{ width: `${Math.min(100, student.programming)}%` }}
                />
              </div>
            </div>

            {/* DBMS */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>DBMS</span>
                <span>{student.dbms}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${accentStyles.gradient}`}
                  style={{ width: `${Math.min(100, student.dbms)}%` }}
                />
              </div>
            </div>

            {/* Overall */}
            <div className="pt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              Overall: {student.averageMarks}%
            </div>
          </div>
        </>
      )}

      {/* Toast Notification (Matching Video 01:13) */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-900 text-white px-5 py-2 text-xs font-bold shadow-2xl flex items-center gap-1.5 animate-bounce">
          <span>Name updated</span>
          <Check className="h-4 w-4 text-emerald-400" />
        </div>
      )}
    </div>
  );
};
