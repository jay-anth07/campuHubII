import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LoginScreen } from './components/LoginScreen';
import { TopBar } from './components/TopBar';
import { Sidebar, ActiveNav } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StudentList } from './components/StudentList';
import { StudentProfile } from './components/StudentProfile';
import { MarksForm } from './components/MarksForm';
import { MockTests } from './components/MockTests';
import { Timetable } from './components/Timetable';
import { FeePayment } from './components/FeePayment';
import { CsvModal } from './components/CsvModal';
import { studentApi } from './services/api';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveNav>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRoll, setSelectedRoll] = useState<string>('A101');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Export CSV handler
  const handleExportCsv = async () => {
    try {
      const students = await studentApi.getAll();
      const headers = ['Roll No', 'Name', 'Department', 'Semester', 'Section', 'Attendance %', 'Average Marks %'];
      const rows = students.map((s) => [
        s.rollNumber,
        `"${s.name}"`,
        s.department,
        s.semester,
        s.section,
        s.attendance,
        s.averageMarks,
      ]);

      const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CampusHub_Students_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  const handleSelectStudentByRoll = (roll: string) => {
    setSelectedRoll(roll);
    setActiveTab('profile');
  };

  const handleNavigateToMarks = (roll: string) => {
    setSelectedRoll(roll);
    setActiveTab('marks');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // If not authenticated, render Login Screen matching video 00:00 - 00:19
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Slide-out Sidebar Drawer */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onSelectStudentByRoll={handleSelectStudentByRoll}
            onExportCsv={handleExportCsv}
            onUploadCsv={() => setIsCsvModalOpen(true)}
          />
        )}

        {activeTab === 'students' && (
          <StudentList
            onSelectStudentByRoll={handleSelectStudentByRoll}
            onExportCsv={handleExportCsv}
            onUploadCsv={() => setIsCsvModalOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <StudentProfile
            selectedRoll={selectedRoll}
            onSelectStudentByRoll={setSelectedRoll}
            onNavigateToMarks={handleNavigateToMarks}
            onExportCsv={handleExportCsv}
            onUploadCsv={() => setIsCsvModalOpen(true)}
          />
        )}

        {activeTab === 'marks' && (
          <MarksForm
            selectedRoll={selectedRoll}
            onSelectStudentByRoll={setSelectedRoll}
            onExportCsv={handleExportCsv}
            onUploadCsv={() => setIsCsvModalOpen(true)}
          />
        )}

        {activeTab === 'mock-tests' && (
          <MockTests
            onExportCsv={handleExportCsv}
            onUploadCsv={() => setIsCsvModalOpen(true)}
          />
        )}

        {activeTab === 'timetable' && (
          <Timetable
            onExportCsv={handleExportCsv}
            onUploadCsv={() => setIsCsvModalOpen(true)}
          />
        )}

        {activeTab === 'fees' && (
          <FeePayment
            selectedRoll={selectedRoll}
            onSelectStudentByRoll={setSelectedRoll}
            onExportCsv={handleExportCsv}
            onUploadCsv={() => setIsCsvModalOpen(true)}
          />
        )}
      </main>

      {/* Upload CSV Modal */}
      <CsvModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportComplete={() => {
          // Trigger refresh
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
