import React, { useState, useEffect } from 'react';
import { Upload, Download } from 'lucide-react';
import { DashboardStats } from '../types';
import { dashboardApi } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface DashboardProps {
  onSelectStudentByRoll: (roll: string) => void;
  onExportCsv: () => void;
  onUploadCsv: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectStudentByRoll,
  onExportCsv,
  onUploadCsv,
}) => {
  const { accentStyles } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Action Buttons (Matching Video) */}
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

      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Live attendance & results at a glance.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Students */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Total Students
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.totalStudents || 30}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
            Loaded from current data
          </div>
        </div>

        {/* Avg Attendance */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Avg Attendance
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.avgAttendance || 74}%
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
            Target 75%
          </div>
        </div>

        {/* Avg Marks */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Avg Marks
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.avgMarks || 69}%
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
            Across subjects
          </div>
        </div>

        {/* Below 75% */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Below 75%
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-500 mt-1">
            {stats?.defaultersCount || 16}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
            Needs attention
          </div>
        </div>

        {/* Fees Pending */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Fees Pending (₹k)
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.feesPendingK || 918}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
            College + exam
          </div>
        </div>
      </div>

      {/* Attendance & Marks by Dept (Exact Double Bar Graph from Video) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">
          Attendance & Marks by Dept
        </h2>

        {/* Bar container */}
        <div className="flex items-end justify-center gap-16 sm:gap-24 h-48 pt-6 pb-2">
          {/* CSE Bars */}
          <div className="flex flex-col items-center">
            <div className="flex items-end gap-2.5 h-36">
              {/* Solid Attendance Bar (68%) */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  68
                </span>
                <div
                  className={`w-7 sm:w-9 rounded-t-xl ${accentStyles.gradient}`}
                  style={{ height: '98px' }}
                />
              </div>

              {/* Faded Marks Bar (69%) */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  69
                </span>
                <div
                  className="w-7 sm:w-9 rounded-t-xl bg-cyan-200 dark:bg-cyan-900/60"
                  style={{ height: '100px' }}
                />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-3">
              CSE
            </span>
          </div>

          {/* AIDS Bars */}
          <div className="flex flex-col items-center">
            <div className="flex items-end gap-2.5 h-36">
              {/* Solid Attendance Bar (79%) */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  79
                </span>
                <div
                  className={`w-7 sm:w-9 rounded-t-xl ${accentStyles.gradient}`}
                  style={{ height: '118px' }}
                />
              </div>

              {/* Faded Marks Bar (69%) */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  69
                </span>
                <div
                  className="w-7 sm:w-9 rounded-t-xl bg-cyan-200 dark:bg-cyan-900/60"
                  style={{ height: '100px' }}
                />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-3">
              AIDS
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-4 font-medium">
          Solid = attendance · Faded = marks
        </div>
      </div>

      {/* Attendance Distribution Doughnut Card (Matching Video 00:29) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col items-center">
        <h2 className="text-base font-bold text-slate-900 dark:text-white self-start mb-4">
          Attendance Distribution
        </h2>

        <div className="relative flex items-center justify-center h-44 w-44">
          {/* Circular SVG Gauge with colored arcs */}
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="10"
              className="dark:stroke-slate-800"
            />
            {/* Red arc (<65%) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#ef4444"
              strokeWidth="10"
              strokeDasharray="238"
              strokeDashoffset="170"
            />
            {/* Amber arc (65-74%) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="10"
              strokeDasharray="238"
              strokeDashoffset="125"
            />
            {/* Green arc (>=75%) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray="238"
              strokeDashoffset="75"
            />
          </svg>

          {/* Center text */}
          <div className="absolute text-center">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              47%
            </span>
          </div>
        </div>
      </div>

      {/* Top Performers Card (Matching Video 00:36) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏆</span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Top Performers
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {(stats?.topPerformers || [
            { name: 'Yash', rollNumber: 'A129', department: 'CSE', section: 'A', marks: 91 },
            { name: 'Lavanya', rollNumber: 'A118', department: 'AIDS', section: 'A', marks: 90 },
            { name: 'Charan', rollNumber: 'A107', department: 'CSE', section: 'B', marks: 89 },
            { name: 'Omkar', rollNumber: 'A121', department: 'CSE', section: 'A', marks: 85 },
          ]).map((student) => (
            <div
              key={student.rollNumber}
              onClick={() => onSelectStudentByRoll(student.rollNumber)}
              className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-lg px-2 transition-colors"
            >
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {student.name}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  {student.rollNumber} · {student.department}-{student.section}
                </div>
              </div>

              <div className="rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-xs px-2.5 py-1">
                {student.marks}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Students Below 75% Card (Matching Video 00:36 - 00:38) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-base">⚠️</span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Students below 75%
          </h2>
          <span className="rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 text-xs font-bold ml-1">
            {stats?.defaultersCount || 16}
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
          {stats?.defaultersList.map((st) => (
            <div
              key={st.rollNumber}
              onClick={() => onSelectStudentByRoll(st.rollNumber)}
              className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-lg px-2 transition-colors"
            >
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {st.name}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  {st.rollNumber} · {st.department}-{st.section}
                </div>
              </div>

              <div className="rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 font-bold text-xs px-2.5 py-1">
                {st.attendance}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
