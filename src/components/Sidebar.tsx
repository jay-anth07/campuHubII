import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileEdit,
  FileText,
  Calendar,
  CreditCard,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, ACCENT_CONFIGS } from '../context/ThemeContext';
import { AccentColor } from '../types';

export type ActiveNav =
  | 'dashboard'
  | 'students'
  | 'profile'
  | 'marks'
  | 'mock-tests'
  | 'timetable'
  | 'fees';

interface SidebarProps {
  activeTab: ActiveNav;
  setActiveTab: (tab: ActiveNav) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const { accent, setAccent, accentStyles } = useTheme();

  const isFaculty = user?.role === 'FACULTY';

  const navItems = [
    { id: 'dashboard' as ActiveNav, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students' as ActiveNav, label: 'Students', icon: Users },
    { id: 'profile' as ActiveNav, label: 'Student Profile', icon: GraduationCap },
    { id: 'marks' as ActiveNav, label: 'Marks Form', icon: FileEdit },
    { id: 'mock-tests' as ActiveNav, label: 'Mock Tests', icon: FileText },
    { id: 'timetable' as ActiveNav, label: 'Timetable', icon: Calendar },
    { id: 'fees' as ActiveNav, label: 'Fees', icon: CreditCard },
  ];

  const handleSelectNav = (id: ActiveNav) => {
    setActiveTab(id);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const accentKeys: AccentColor[] = ['teal', 'emerald', 'blue', 'purple', 'orange'];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`h-7 w-7 rounded-lg ${accentStyles.gradient} flex items-center justify-center font-bold text-white text-sm shadow-sm`}>
              C
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white">
              CampusHub
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectNav(item.id)}
                className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? `${accentStyles.gradient} shadow-md`
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Account Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Account
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isFaculty ? 'Full faculty / management access' : `Logged in as ${user?.rollNumber || 'Student'}`}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors w-full mt-1"
          >
            <LogOut className="h-3.5 w-3.5 text-slate-500" />
            <span>Logout</span>
          </button>
        </div>

        {/* Accent Colour Picker */}
        <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
            Accent colour
          </div>
          <div className="flex items-center gap-3">
            {accentKeys.map((key) => {
              const cfg = ACCENT_CONFIGS[key];
              const isSelected = accent === key;
              return (
                <button
                  key={key}
                  onClick={() => setAccent(key)}
                  className={`h-7 w-7 rounded-full transition-transform active:scale-95 flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: cfg.colorHex }}
                  title={cfg.name}
                />
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};
