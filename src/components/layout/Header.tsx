import React, { useState, useRef, useEffect } from 'react';
import { useClass, NavPage } from '../../context/ClassContext';
import { TimeframeFilter, UserRole } from '../../types';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  Calendar,
  UserCheck,
  Shield,
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCheck,
  ExternalLink,
  X,
  AlertTriangle,
  Award,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    classInfo,
    timeframe,
    setTimeframe,
    searchQuery,
    setSearchQuery,
    students,
    viewStudentProfile,
    setActivePage,
    userRole,
    setUserRole,
    systemAlerts,
    unreadAlertsCount,
    markAlertRead,
    showToast,
  } = useClass();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const matchingStudents = searchQuery.trim()
    ? students
        .filter(
          (s) =>
            s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.parentPhone.includes(searchQuery) ||
            s.parentName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const timeframes: TimeframeFilter[] = [
    'Hôm nay',
    'Tuần này',
    'Tháng này',
    'Học kỳ I',
    'Học kỳ II',
    'Cả năm',
  ];

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'GVCN', title: 'Giáo viên chủ nhiệm', desc: 'Quản lý toàn bộ thông tin lớp 6A4' },
    { role: 'GV_BOMON', title: 'Giáo viên bộ môn', desc: 'Nhập điểm môn phụ trách' },
    { role: 'ADMIN', title: 'Quản trị viên (Ban Giám Hiệu)', desc: 'Toàn quyền cấu hình hệ thống' },
    { role: 'PHU_HUYNH', title: 'Phụ huynh học sinh', desc: 'Xem hồ sơ và kết quả của con' },
    { role: 'HOC_SINH', title: 'Học sinh', desc: 'Xem thời khóa biểu, điểm số' },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E3ECF8] px-4 lg:px-8 py-3 transition-shadow">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Class Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-[#172B4D] tracking-tight">
                QUẢN TRỊ LỚP HỌC {classInfo.className}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-[#1677FF] border border-blue-200 rounded-full">
                {classInfo.grade}
              </span>
            </div>
            <p className="text-xs text-[#6B7A90] font-medium hidden sm:block">
              {classInfo.school}
            </p>
          </div>
        </div>

        {/* Middle: Global Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Tìm kiếm học sinh, số điện thoại, chức năng..."
              className="w-full bg-[#F3F8FF] hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 pl-9.5 pr-8 py-2 rounded-xl border border-transparent focus:border-[#1677FF] focus:outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E3ECF8] overflow-hidden z-50 animate-fadeIn">
              {searchQuery.trim() === '' ? (
                <div className="p-3 text-xs text-slate-400">
                  <div className="font-semibold text-slate-500 mb-1.5 px-2">Truy cập nhanh chức năng:</div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => {
                        setActivePage('attendance');
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center gap-2 p-2 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-left"
                    >
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Điểm danh tuần
                    </button>
                    <button
                      onClick={() => {
                        setActivePage('academic');
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center gap-2 p-2 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-left"
                    >
                      <GraduationCap className="w-4 h-4 text-emerald-500" />
                      Bảng điểm học tập
                    </button>
                    <button
                      onClick={() => {
                        setActivePage('discipline');
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center gap-2 p-2 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-left"
                    >
                      <Shield className="w-4 h-4 text-amber-500" />
                      Vi phạm nề nếp
                    </button>
                    <button
                      onClick={() => {
                        setActivePage('ai_assistant');
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center gap-2 p-2 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-left"
                    >
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Trợ lý AI GVCN
                    </button>
                  </div>
                </div>
              ) : matchingStudents.length > 0 ? (
                <div className="p-2 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase">
                    Học sinh ({matchingStudents.length})
                  </div>
                  {matchingStudents.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        viewStudentProfile(s.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between p-2 hover:bg-blue-50 rounded-xl text-left transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={s.avatar}
                          alt={s.fullName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                            {s.fullName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Mã HS: {s.studentCode} • PH: {s.parentPhone}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  Không tìm thấy kết quả phù hợp cho &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Timeframe Dropdown */}
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as TimeframeFilter)}
              className="bg-[#F3F8FF] hover:bg-blue-100/60 text-[#1677FF] font-semibold text-xs sm:text-sm px-3 py-2 pr-7 rounded-xl border border-blue-200/80 focus:outline-none cursor-pointer transition-colors appearance-none"
            >
              {timeframes.map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#1677FF] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Notifications Center */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
              title="Trung tâm thông báo & cảnh báo"
            >
              <Bell className="w-5 h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Notification Popover Panel */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E3ECF8] overflow-hidden z-50 animate-fadeIn">
                <div className="p-3.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-200" />
                    <span className="font-bold text-sm">Cảnh báo & Nhắc nhở</span>
                    <span className="text-[11px] bg-red-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                      {unreadAlertsCount} mới
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      systemAlerts.forEach((a) => markAlertRead(a.id));
                      showToast({ type: 'info', title: 'Đã đánh dấu đã đọc tất cả' });
                    }}
                    className="text-[11px] text-blue-200 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Đọc tất cả
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {systemAlerts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Không có thông báo hoặc cảnh báo nào. Lớp học hoạt động tốt!
                    </div>
                  ) : (
                    systemAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => {
                          markAlertRead(alert.id);
                          viewStudentProfile(alert.studentId);
                          setIsNotificationsOpen(false);
                        }}
                        className={`p-3 text-xs hover:bg-blue-50/70 transition-colors cursor-pointer flex items-start gap-3 ${
                          !alert.isRead ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                            alert.severity === 'danger'
                              ? 'bg-red-100 text-red-600'
                              : alert.severity === 'warning'
                              ? 'bg-amber-100 text-amber-600'
                              : alert.severity === 'success'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          {alert.severity === 'danger' || alert.severity === 'warning' ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : alert.severity === 'success' ? (
                            <Award className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 truncate">
                              {alert.studentName}
                            </span>
                            <span className="text-[10px] text-slate-400">{alert.date}</span>
                          </div>
                          <div className="text-slate-700 font-medium mt-0.5 leading-snug">
                            {alert.message}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {alert.detail}
                          </div>
                        </div>

                        {!alert.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setActivePage('discipline');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-xs font-semibold text-[#1677FF] hover:underline cursor-pointer"
                  >
                    Xem chi tiết trung tâm nề nếp & vi phạm →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Teacher Profile & Role Switcher */}
          <div ref={roleRef} className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500"
              />
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-[#172B4D]">
                  {classInfo.homeroomTeacher}
                </div>
                <div className="text-[10px] text-[#6B7A90] font-semibold flex items-center gap-1">
                  <span>{roles.find((r) => r.role === userRole)?.title || 'GVCN'}</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {/* Role & Account Dropdown */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E3ECF8] overflow-hidden z-50 animate-fadeIn">
                <div className="p-4 bg-gradient-to-br from-[#06367A] to-blue-900 text-white">
                  <div className="font-bold text-sm">{classInfo.homeroomTeacher}</div>
                  <div className="text-xs text-blue-200 mt-0.5">le.minh@nvtiep.edu.vn</div>
                  <div className="mt-2 text-[11px] inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/30 text-white font-medium">
                    Lớp {classInfo.className} • {classInfo.school}
                  </div>
                </div>

                <div className="p-2 border-b border-slate-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Chuyển đổi vai trò xem demo (Phân quyền)
                  </div>
                  {roles.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        setUserRole(item.role);
                        setIsRoleDropdownOpen(false);
                        showToast({
                          type: 'info',
                          title: `Chuyển quyền: ${item.title}`,
                          message: item.desc,
                        });
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        userRole === item.role
                          ? 'bg-blue-50 text-[#1677FF] font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div>{item.title}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                      </div>
                      {userRole === item.role && (
                        <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-2 bg-slate-50">
                  <button
                    onClick={() => {
                      setActivePage('settings');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-white flex items-center gap-2"
                  >
                    Cài đặt tài khoản & hệ thống
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
