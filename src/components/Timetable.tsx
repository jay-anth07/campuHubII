import React, { useState, useEffect } from 'react';
import { Upload, Download } from 'lucide-react';
import { TimetableSlot } from '../types';
import { timetableApi } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface TimetableProps {
  onExportCsv: () => void;
  onUploadCsv: () => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Timetable: React.FC<TimetableProps> = ({ onExportCsv, onUploadCsv }) => {
  const { accentStyles } = useTheme();

  const [activeDay, setActiveDay] = useState('Tue');
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await timetableApi.getSlots(activeDay);
        setSlots(data);
      } catch (err) {
        console.error('Failed to load timetable', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [activeDay]);

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
          Class Timetable
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Weekly schedule · CSE/AIDS 3rd year
        </p>
      </div>

      {/* Day Pills Bar (Matching Video 01:28) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {DAYS.map((day) => {
          const isActive = activeDay === day;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isActive
                  ? `${accentStyles.gradient} shadow-md`
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{day}</span>
              {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
            </button>
          );
        })}
      </div>

      {/* Slots List (Matching Video 01:28) */}
      <div className="space-y-3">
        {slots.map((slot) => {
          if (slot.isBreak) {
            return (
              <div
                key={slot.id}
                className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 py-3 px-4 text-center text-xs font-semibold text-slate-400 dark:text-slate-500"
              >
                ☕ Lunch break · {slot.time}
              </div>
            );
          }

          return (
            <div
              key={slot.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
            >
              {/* Time Column */}
              <div className="w-14 shrink-0 font-bold text-sm text-cyan-600 dark:text-cyan-400">
                {slot.time}
              </div>

              {/* Slot Details */}
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {slot.subject}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {slot.instructor} · {slot.room}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
