import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const { accentStyles } = useTheme();

  const [role, setRole] = useState<UserRole>('FACULTY');
  const [username, setUsername] = useState('faculty');
  const [password, setPassword] = useState('faculty123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username or roll number.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(username.trim(), password, role);
    } catch {
      setError('Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (userVal: string, passVal: string, roleVal: UserRole) => {
    setRole(roleVal);
    setUsername(userVal);
    setPassword(passVal);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-start sm:justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-xl sm:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
        {/* Top Gradient Banner */}
        <div className={`p-8 pb-10 text-white ${accentStyles.headerGradient}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-white text-lg">
              C
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">CampusHub</h1>
          </div>
          <p className="text-sm text-white/90 leading-relaxed font-medium">
            Attendance, marks and fee management for students, faculty and management.
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 -mt-4 bg-white dark:bg-slate-900 rounded-t-3xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose your login type to continue.
            </p>
          </div>

          {/* Role Pills */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setRole('FACULTY');
                setUsername('faculty');
                setPassword('faculty123');
              }}
              className={`flex items-center justify-center gap-1.5 py-3 px-3 text-xs font-bold rounded-xl transition-all shadow-sm ${
                role === 'FACULTY'
                  ? `${accentStyles.gradient} shadow-md scale-[1.02]`
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80'
              }`}
            >
              <span>🧑‍🏫</span>
              <span>Faculty / Management</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('STUDENT');
                setUsername('A101');
                setPassword('student123');
              }}
              className={`flex items-center justify-center gap-1.5 py-3 px-3 text-xs font-bold rounded-xl transition-all shadow-sm ${
                role === 'STUDENT'
                  ? `${accentStyles.gradient} shadow-md scale-[1.02]`
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80'
              }`}
            >
              <span>🎓</span>
              <span>Student</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === 'FACULTY' ? 'faculty or management' : 'Roll number (e.g. A101)'}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 p-2.5 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${accentStyles.gradient} hover:opacity-95 active:scale-[0.99]`}
            >
              <span>{loading ? 'Logging in...' : 'Login'}</span>
              <span>➔</span>
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
              Demo credentials
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <button
                type="button"
                onClick={() => handleFillDemo('faculty', 'faculty123', 'FACULTY')}
                className="hover:underline text-cyan-600 dark:text-cyan-400 font-medium"
              >
                Faculty: faculty / faculty123
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handleFillDemo('management', 'admin123', 'FACULTY')}
                className="hover:underline text-cyan-600 dark:text-cyan-400 font-medium"
              >
                Management: management / admin123
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handleFillDemo('A101', 'student123', 'STUDENT')}
                className="hover:underline text-cyan-600 dark:text-cyan-400 font-medium"
              >
                Student: A101 / student123
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
