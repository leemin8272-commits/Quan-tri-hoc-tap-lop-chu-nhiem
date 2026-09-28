import React, { useMemo } from 'react';
import { useClass } from '../../context/ClassContext';
import { StatCard } from '../common/StatCard';
import {
  WeeklyGpaLineChart,
  AttendanceBarChart,
  DonutChart,
  DonutSegment,
} from '../common/Charts';
import {
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  GraduationCap,
  ShieldAlert,
  Award,
  HeartHandshake,
  Calendar,
  Bell,
  ChevronRight,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import {
  WEEKLY_GPA_TREND,
  WEEKLY_ATTENDANCE_TREND,
} from '../../data/mockData';

export const DashboardView: React.FC = () => {
  const {
    students,
    academicRecords,
    attendance,
    behaviors,
    commendations,
    announcements,
    schedule,
    setActivePage,
    viewStudentProfile,
  } = useClass();

  // Calculations for KPI Cards
  const totalStudents = students.length;

  // Today's attendance calculation (Friday 25/09/2026 or latest date)
  const todayDate = '2026-09-25';
  let presentToday = 0;
  let excusedToday = 0;
  let unexcusedToday = 0;
  let lateToday = 0;

  students.forEach((s) => {
    const rec = attendance[s.id]?.[todayDate];
    if (rec?.status === 'present') presentToday++;
    else if (rec?.status === 'excused') excusedToday++;
    else if (rec?.status === 'unexcused') unexcusedToday++;
    else if (rec?.status === 'late') lateToday++;
    else presentToday++; // default present
  });

  const presentPercent = ((presentToday / totalStudents) * 100).toFixed(1);
  const excusedPercent = ((excusedToday / totalStudents) * 100).toFixed(1);
  const unexcusedPercent = ((unexcusedToday / totalStudents) * 100).toFixed(1);

  // Class GPA calculation
  const totalGpa = Object.values(academicRecords).reduce((acc, curr) => acc + curr.gpa, 0);
  const classAvgGpa = Number((totalGpa / (totalStudents || 1)).toFixed(1));

  // Violations & Commendations count
  const weeklyViolationsCount = behaviors.filter((b) => b.week === 4).length;
  const commendationsCount = commendations.length;

  // Academic rank distribution for Donut Chart
  const rankStats = useMemo(() => {
    let gioi = 0;
    let kha = 0;
    let tb = 0;
    let yeu = 0;

    Object.values(academicRecords).forEach((rec) => {
      if (rec.rank === 'Giỏi') gioi++;
      else if (rec.rank === 'Khá') kha++;
      else if (rec.rank === 'Trung bình') tb++;
      else yeu++;
    });

    return [
      { label: 'Giỏi', count: gioi, color: '#1677FF' },
      { label: 'Khá', count: kha, color: '#22C55E' },
      { label: 'Trung bình', count: tb, color: '#F59E0B' },
      { label: 'Yếu', count: yeu, color: '#EF4444' },
    ];
  }, [academicRecords]);

  // Students needing attention list (from prompt)
  const attentionStudents = [
    {
      id: 's-002',
      name: 'Phạm Gia Huy',
      issue: 'Điểm Toán giảm, nghỉ học 3 buổi',
      status: 'Cần theo dõi',
      statusColor: 'bg-red-50 text-red-600 border-red-200',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 's-003',
      name: 'Trần Mai Chi',
      issue: 'Nghỉ học nhiều do sức khỏe',
      status: 'Cần theo dõi',
      statusColor: 'bg-red-50 text-red-600 border-red-200',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 's-004',
      name: 'Võ Ngọc Bảo',
      issue: 'Có 2 lần vi phạm nề nếp',
      status: 'Cần nhắc nhở',
      statusColor: 'bg-amber-50 text-amber-600 border-amber-200',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 's-005',
      name: 'Lê Minh Khang',
      issue: 'Điểm trung bình dưới 6.0',
      status: 'Cần hỗ trợ',
      statusColor: 'bg-blue-50 text-blue-600 border-blue-200',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    },
  ];

  // Progressive / Commended students (from prompt)
  const commendedStudents = [
    {
      id: 's-001',
      name: 'Nguyễn Minh Anh',
      note: 'Tiến bộ môn Tiếng Anh +1.5 điểm',
      time: '25/09/2026',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 's-006',
      name: 'Đỗ Khánh Vy',
      note: 'Có nhiều việc tốt trong tuần',
      time: '24/09/2026',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 's-007',
      name: 'Hoàng Đức Anh',
      note: 'Tiến bộ về nề nếp kỷ luật',
      time: '23/09/2026',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 's-008',
      name: 'Trần Hoàng Nam',
      note: 'Điểm Toán tăng +2.0 điểm',
      time: '22/09/2026',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    },
  ];

  // Segments for Today's situation donut
  const todaySituationSegments: DonutSegment[] = [
    { label: 'Có mặt', count: presentToday, color: '#22C55E' },
    { label: 'Vắng có phép', count: excusedToday, color: '#F59E0B' },
    { label: 'Vắng không phép', count: unexcusedToday, color: '#EF4444' },
    { label: 'Đi muộn', count: lateToday, color: '#1677FF' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Bar */}
      <div className="bg-gradient-to-r from-[#06367A] via-[#0D47A1] to-[#1677FF] rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-100 mb-2 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Năm học 2026 - 2027 • Học kỳ I
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Bảng điều khiển Tổng quan - Lớp 6A4
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
              Chào mừng cô Lê Ngọc Minh. Hôm nay lớp có{' '}
              <span className="font-bold text-white underline decoration-emerald-400">
                {presentToday}/{totalStudents} học sinh
              </span>{' '}
              có mặt. Có{' '}
              <span className="font-bold text-amber-300">{attentionStudents.length} học sinh</span> cần
              chú ý theo dõi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActivePage('attendance')}
              className="px-4 py-2 rounded-xl bg-white text-[#0D47A1] font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Điểm danh nhanh
            </button>
            <button
              onClick={() => setActivePage('academic')}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-colors border border-white/20 backdrop-blur-md flex items-center gap-1.5 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              Bảng điểm
            </button>
            <button
              onClick={() => setActivePage('ai_assistant')}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              Hỏi Trợ lý AI
            </button>
          </div>
        </div>
      </div>

      {/* 1. TOP 8 KPI CARDS (Requirement 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
        {/* 1. Tổng số học sinh */}
        <StatCard
          title="Tổng số HS"
          value={totalStudents}
          subtext="Sĩ số lớp 6A4"
          icon={<Users className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          onClick={() => setActivePage('students')}
        />

        {/* 2. Có mặt */}
        <StatCard
          title="Có mặt"
          value={presentToday}
          badge={{ text: `${presentPercent}%`, variant: 'success' }}
          subtext="Đi học hôm nay"
          icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          onClick={() => setActivePage('attendance')}
        />

        {/* 3. Nghỉ phép */}
        <StatCard
          title="Nghỉ phép"
          value={excusedToday}
          badge={{ text: `${excusedPercent}%`, variant: 'warning' }}
          subtext="Có phép từ PH"
          icon={<UserX className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          onClick={() => setActivePage('attendance')}
        />

        {/* 4. Nghỉ không phép */}
        <StatCard
          title="Vắng K.phép"
          value={unexcusedToday}
          badge={{ text: `${unexcusedPercent}%`, variant: 'danger' }}
          subtext="Cần xác minh"
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-50"
          onClick={() => setActivePage('attendance')}
        />

        {/* 5. Điểm trung bình lớp */}
        <StatCard
          title="Điểm TB lớp"
          value={classAvgGpa}
          badge={{ text: '+0.2', variant: 'info' }}
          subtext="So với tuần 3"
          icon={<GraduationCap className="w-5 h-5 text-[#1677FF]" />}
          iconBg="bg-blue-50"
          onClick={() => setActivePage('academic')}
        />

        {/* 6. Vi phạm tuần này */}
        <StatCard
          title="Vi phạm"
          value={weeklyViolationsCount}
          subtext="Tuần học thứ 4"
          subtextColor="text-amber-600"
          icon={<ShieldAlert className="w-5 h-5 text-amber-500" />}
          iconBg="bg-amber-50"
          onClick={() => setActivePage('discipline')}
        />

        {/* 7. Tuyên dương */}
        <StatCard
          title="Tuyên dương"
          value={commendationsCount}
          subtext="Tiến bộ & việc tốt"
          subtextColor="text-emerald-600"
          icon={<Award className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-50"
          onClick={() => setActivePage('commendation')}
        />

        {/* 8. Cần quan tâm */}
        <StatCard
          title="Cần quan tâm"
          value={attentionStudents.length}
          badge={{ text: 'Theo dõi', variant: 'danger' }}
          subtext="4 học sinh cần hỗ trợ"
          subtextColor="text-red-600"
          icon={<HeartHandshake className="w-5 h-5 text-red-500" />}
          iconBg="bg-red-50"
          onClick={() => setActivePage('profile')}
        />
      </div>

      {/* 2. MIDDLE ROW: Tình hình lớp hôm nay + Thông báo mới + Lịch sắp tới (matching reference screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tình hình lớp hôm nay Donut */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#172B4D]">
                Tình hình lớp hôm nay (25/09/2026)
              </h2>
              <p className="text-[11px] text-[#6B7A90]">Cập nhật từ hệ thống điểm danh tự động</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="py-2">
            <DonutChart
              centerNumber={totalStudents}
              centerLabel="Học sinh"
              segments={todaySituationSegments}
              size={150}
            />
          </div>
        </div>

        {/* Thông báo mới nhất */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1677FF]" />
                <h2 className="text-sm font-bold text-[#172B4D]">Thông báo mới nhất</h2>
              </div>
              <button
                onClick={() => setActivePage('settings')}
                className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Xem tất cả
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((an) => (
                <div
                  key={an.id}
                  className="p-3 rounded-xl bg-slate-50/70 hover:bg-blue-50/50 transition-colors border border-slate-100 flex items-start gap-3 text-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#172B4D] truncate">{an.title}</div>
                    <div className="text-[11px] text-[#6B7A90] mt-0.5 line-clamp-1">{an.content}</div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                      <span>{an.date}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">
                        {an.viewedCount}/{an.totalParents} PH đã xem
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lịch sắp tới */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-[#172B4D]">Lịch sắp tới</h2>
              </div>
              <button
                onClick={() => setActivePage('reports')}
                className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Xem tất cả
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {schedule.slice(0, 3).map((sc) => (
                <div
                  key={sc.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors bg-white text-xs"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1677FF] flex flex-col items-center justify-center shrink-0 border border-blue-100">
                    <span className="text-[9px] font-bold uppercase">
                      {sc.date.includes('10/10') ? '10/10' : sc.date.includes('15/10') ? '15/10' : '25/10'}
                    </span>
                    <Clock className="w-3 h-3 text-[#1677FF] mt-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 truncate">{sc.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span>{sc.time}</span>
                      <span>•</span>
                      <span className="text-blue-600">{sc.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. CHARTS SECTION (Requirement 5: Line chart, Bar chart, Donut chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ 1: Điểm trung bình theo tuần (Tuần 1 -> Tuần 8) */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#172B4D]">Điểm trung bình theo tuần</h2>
              <p className="text-[11px] text-[#6B7A90]">Diễn biến từ Tuần 1 đến Tuần 8</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1677FF] border border-blue-200">
              TB: 7.6
            </span>
          </div>
          <WeeklyGpaLineChart data={WEEKLY_GPA_TREND} />
        </div>

        {/* Biểu đồ 2: Tỷ lệ chuyên cần (Tuần 1 -> Tuần 8) */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#172B4D]">Tỷ lệ chuyên cần theo tuần</h2>
              <p className="text-[11px] text-[#6B7A90]">Thống kê đi học đầy đủ cả lớp (%)</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Đạt 96.2%
            </span>
          </div>
          <AttendanceBarChart data={WEEKLY_ATTENDANCE_TREND} />
        </div>

        {/* Biểu đồ 3: Phân loại học lực (Donut Chart) */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#172B4D]">Phân loại học lực</h2>
              <p className="text-[11px] text-[#6B7A90]">Đánh giá theo chuẩn Bộ Giáo Dục</p>
            </div>
            <span className="text-xs font-bold text-slate-500">HK I</span>
          </div>
          <div className="py-2">
            <DonutChart
              centerNumber={totalStudents}
              centerLabel="Học sinh"
              segments={rankStats}
              size={150}
            />
          </div>
        </div>
      </div>

      {/* 4. TABLES: HỌC SINH CẦN QUAN TÂM & HỌC SINH TIẾN BỘ / TUYÊN DƯƠNG (Requirements 6 & 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bảng Học sinh cần quan tâm */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#172B4D]">HỌC SINH CẦN QUAN TÂM</h2>
                  <p className="text-[11px] text-[#6B7A90]">
                    Tự động nhận diện từ điểm số, chuyên cần và nề nếp
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('profile')}
                className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Xem thêm
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[#6B7A90] font-semibold">
                    <th className="pb-2.5">Họ và tên</th>
                    <th className="pb-2.5">Vấn đề cần lưu ý</th>
                    <th className="pb-2.5 text-center">Trạng thái</th>
                    <th className="pb-2.5 text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attentionStudents.map((st) => (
                    <tr
                      key={st.id}
                      className="hover:bg-red-50/30 transition-colors group cursor-pointer"
                      onClick={() => viewStudentProfile(st.id)}
                    >
                      <td className="py-2.5 font-bold text-slate-800">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <span className="group-hover:text-blue-600 transition-colors">
                            {st.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 text-slate-600">{st.issue}</td>
                      <td className="py-2.5 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.statusColor}`}
                        >
                          {st.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            viewStudentProfile(st.id);
                          }}
                          className="px-2 py-1 rounded-lg text-blue-600 hover:bg-blue-100/70 font-semibold text-[11px] transition-colors"
                        >
                          Hồ sơ →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>GVCN có thể tạo kế hoạch phụ đạo hoặc liên hệ PH.</span>
            <button
              onClick={() => setActivePage('ai_assistant')}
              className="text-[#1677FF] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI gợi ý giải pháp
            </button>
          </div>
        </div>

        {/* Bảng Học sinh tiến bộ / Tuyên dương */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#172B4D]">
                    HỌC SINH TIẾN BỘ / TUYÊN DƯƠNG
                  </h2>
                  <p className="text-[11px] text-[#6B7A90]">Gương mặt tiêu biểu và nỗ lực trong tuần</p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('commendation')}
                className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Xem tất cả
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[#6B7A90] font-semibold">
                    <th className="pb-2.5">Học sinh</th>
                    <th className="pb-2.5">Nội dung tuyên dương</th>
                    <th className="pb-2.5 text-right">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {commendedStudents.map((st) => (
                    <tr
                      key={st.id}
                      className="hover:bg-emerald-50/30 transition-colors group cursor-pointer"
                      onClick={() => viewStudentProfile(st.id)}
                    >
                      <td className="py-2.5 font-bold text-slate-800">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-200"
                          />
                          <span className="group-hover:text-emerald-700 transition-colors">
                            {st.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <ArrowUpRight className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{st.note}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right text-slate-400 font-medium">{st.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              4 học sinh đã được khen thưởng dưới cờ
            </span>
            <button
              onClick={() => setActivePage('commendation')}
              className="text-emerald-700 font-semibold hover:underline cursor-pointer"
            >
              + Khen thưởng mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
