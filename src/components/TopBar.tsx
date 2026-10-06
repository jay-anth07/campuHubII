import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode, accentStyles } = useTheme();

  const isFaculty = user?.role === 'FACULTY';

  return (
    <header className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6 shadow-md transition-colors ${accentStyles.headerGradient}`}>
      {/* Left: Hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-1.5 text-white/90 hover:bg-white/15 transition-colors focus:outline-none"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white font-black text-lg shadow-inner">
            C
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white leading-none">
              CampusHub
            </div>
            <div className="text-[11px] font-medium text-white/85 mt-0.5">
              {isFaculty ? 'Faculty & Management Portal' : 'Student Portal'}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Role Pill & Dark Mode */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white shadow-sm">
          <span>{isFaculty ? '🧑‍🏫' : '🎓'}</span>
          <span>{isFaculty ? 'Faculty' : (user?.rollNumber || 'Student')}</span>
        </div>

        <button
          onClick={toggleDarkMode}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
          title={isDarkMode ? 'Light mode' : 'Dark mode'}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-amber-200" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
};
