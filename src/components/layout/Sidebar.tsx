import React from 'react';
import { useClass, NavPage } from '../../context/ClassContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  ShieldAlert,
  Award,
  UserCheck,
  BarChart3,
  FileText,
  Sparkles,
  Settings,
  School,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    activePage,
    setActivePage,
    classInfo,
    unreadAlertsCount,
    behaviors,
    commendations,
    students,
  } = useClass();

  const unresolvedViolationsCount = behaviors.filter((b) => b.status === 'Chưa xử lý').length;

  const menuItems: {
    id: NavPage;
    name: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { id: 'overview', name: 'Tổng quan', icon: <LayoutDashboard className="w-5 h-5" /> },
    {
      id: 'students',
      name: 'Học sinh',
      icon: <Users className="w-5 h-5" />,
      badge: students.length,
      badgeColor: 'bg-blue-500/20 text-blue-200',
    },
    { id: 'academic', name: 'Học tập', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'attendance', name: 'Chuyên cần', icon: <CalendarCheck className="w-5 h-5" /> },
    {
      id: 'discipline',
      name: 'Nề nếp',
      icon: <ShieldAlert className="w-5 h-5" />,
      badge: unresolvedViolationsCount > 0 ? unresolvedViolationsCount : undefined,
      badgeColor: 'bg-amber-500 text-white font-bold',
    },
    {
      id: 'commendation',
      name: 'Tuyên dương',
      icon: <Award className="w-5 h-5" />,
      badge: commendations.length,
      badgeColor: 'bg-emerald-500/20 text-emerald-200',
    },
    { id: 'profile', name: 'Theo dõi cá nhân', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'statistics', name: 'Thống kê', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'reports', name: 'Báo cáo', icon: <FileText className="w-5 h-5" /> },
    {
      id: 'ai_assistant',
      name: 'Trợ lý AI',
      icon: <Sparkles className="w-5 h-5 text-amber-300" />,
      badge: 'AI',
      badgeColor: 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 font-extrabold',
    },
    { id: 'settings', name: 'Cài đặt', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (pageId: NavPage) => {
    setActivePage(pageId);
    if (isOpenMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#06367A] text-white select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-blue-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-900/40">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wide text-white">
                QUẢN TRỊ LỚP {classInfo.className}
              </span>
            </div>
            <div className="text-[11px] font-medium text-blue-200/80 truncate max-w-[170px]">
              {classInfo.school}
            </div>
          </div>
        </div>

        {/* Close button on mobile drawer */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-blue-200 hover:text-white p-1 rounded-lg hover:bg-blue-800/50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Teacher Profile Card */}
      <div className="px-5 py-4 bg-[#052b63] border-b border-blue-900/40 flex items-center gap-3">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
            alt="GVCN"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-400"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#052b63]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-white truncate">
            {classInfo.homeroomTeacher}
          </div>
          <div className="text-[11px] text-blue-300 font-medium">Giáo viên chủ nhiệm</div>
        </div>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-blue-300/70">
          Danh mục quản lý
        </div>

        {menuItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group cursor-pointer ${
                isActive
                  ? 'bg-[#1677FF] text-white shadow-md shadow-blue-600/30'
                  : 'text-blue-100 hover:bg-blue-800/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`transition-colors ${
                    isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-blue-700 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-4 border-t border-blue-900/60 bg-[#052d69]">
        <div className="flex items-center justify-between text-xs text-blue-300">
          <span>Năm học: {classInfo.academicYear}</span>
          <span className="font-semibold text-white">{classInfo.room}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-blue-800/40 flex items-center justify-between text-[11px] text-blue-300/70">
          <span>Hệ thống QLLH v2.5</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Trực tuyến
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 shadow-2xl transition-transform duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
