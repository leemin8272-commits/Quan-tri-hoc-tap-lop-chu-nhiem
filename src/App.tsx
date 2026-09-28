import React, { useState } from 'react';
import { ClassProvider, useClass } from './context/ClassContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudentsView } from './components/students/StudentsView';
import { AcademicView } from './components/academic/AcademicView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { DisciplineView } from './components/discipline/DisciplineView';
import { CommendationView } from './components/commendation/CommendationView';
import { StudentProfile360View } from './components/profile/StudentProfile360View';
import { StatisticsView } from './components/statistics/StatisticsView';
import { WeeklyReportView } from './components/reports/WeeklyReportView';
import { AIChatView } from './components/ai/AIChatView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { activePage } = useClass();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activePage) {
      case 'overview':
        return <DashboardView />;
      case 'students':
        return <StudentsView />;
      case 'academic':
        return <AcademicView />;
      case 'attendance':
        return <AttendanceView />;
      case 'discipline':
        return <DisciplineView />;
      case 'commendation':
        return <CommendationView />;
      case 'profile':
        return <StudentProfile360View />;
      case 'statistics':
        return <StatisticsView />;
      case 'reports':
        return <WeeklyReportView />;
      case 'ai_assistant':
        return <AIChatView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F8FF] text-[#172B4D] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ClassProvider>
      <MainLayout />
    </ClassProvider>
  );
}
