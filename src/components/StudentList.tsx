import React, { useState, useEffect } from 'react';
import { Search, Upload, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { Student } from '../types';
import { studentApi } from '../services/api';

interface StudentListProps {
  onSelectStudentByRoll: (roll: string) => void;
  onExportCsv: () => void;
  onUploadCsv: () => void;
}

type SortField = 'roll' | 'name' | 'dept' | 'sec' | 'att';

export const StudentList: React.FC<StudentListProps> = ({
  onSelectStudentByRoll,
  onExportCsv,
  onUploadCsv,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('roll');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentApi.getAll({
          department: department === 'All' ? undefined : department,
          search: search.trim() || undefined,
        });
        setStudents(data);
      } catch (err) {
        console.error('Failed to load students', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [department, search]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedList = [...students].sort((a, b) => {
    let res = 0;
    if (sortField === 'roll') res = a.rollNumber.localeCompare(b.rollNumber);
    if (sortField === 'name') res = a.name.localeCompare(b.name);
    if (sortField === 'dept') res = a.department.localeCompare(b.department);
    if (sortField === 'sec') res = a.section.localeCompare(b.section);
    if (sortField === 'att') res = a.attendance - b.attendance;
    return sortAsc ? res : -res;
  });

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

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Students
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Search, filter, sort and export.
        </p>
      </div>

      {/* Filter and Search Bar (Matching Video 00:41) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          {/* Department Select */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="CSE">CSE</option>
            <option value="AIDS">AIDS</option>
          </select>
        </div>

        {/* Secondary Export button matching video */}
        <div>
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Students Data Table (Matching Video 00:41 - 00:44) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th
                  onClick={() => handleSort('roll')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>ROLL NO</span>
                    <span className="text-[10px]">↑</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>NAME</span>
                    <span className="text-[10px]">↑</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort('dept')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>DEPT</span>
                    <span className="text-[10px]">↑</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sec')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>SEC</span>
                    <span className="text-[10px]">↑</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort('att')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>ATTE...</span>
                    <span className="text-[10px]">↑</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Loading students...
                  </td>
                </tr>
              ) : sortedList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No students found.
                  </td>
                </tr>
              ) : (
                sortedList.map((st) => {
                  const isSafe = st.attendance >= 75;
                  return (
                    <tr
                      key={st.rollNumber}
                      onClick={() => onSelectStudentByRoll(st.rollNumber)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                        {st.rollNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {st.name}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-600 dark:text-slate-300">
                        {st.department}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-600 dark:text-slate-300">
                        {st.section}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            isSafe
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                          }`}
                        >
                          {st.attendance}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
