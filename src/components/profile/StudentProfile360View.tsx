import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { StudentModal } from '../modals/StudentModal';
import { AddContactModal } from '../modals/AddContactModal';
import { DAYS_OF_WEEK } from '../../data/mockData';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  ShieldAlert,
  Clock,
  Printer,
  Edit,
  ArrowLeft,
  BookOpen,
  MessageSquare,
  FileText,
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const StudentProfile360View: React.FC = () => {
  const {
    students,
    selectedStudentId,
    setSelectedStudentId,
    setActivePage,
    academicRecords,
    attendance,
    behaviors,
    commendations,
    teacherNotes,
    parentContacts,
    addTeacherNote,
    updateStudent,
    showToast,
  } = useClass();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'academic' | 'attendance' | 'discipline' | 'notes' | 'parent_contact'
  >('overview');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  // Find target student
  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const academic = academicRecords[student.id];

  // Specific attendance for student
  const studentAtt = attendance[student.id] || {};
  let presentDays = 0;
  let excusedDays = 0;
  let unexcusedDays = 0;
  let lateDays = 0;

  DAYS_OF_WEEK.forEach((d) => {
    const st = studentAtt[d.date]?.status || 'present';
    if (st === 'present') presentDays++;
    else if (st === 'excused') excusedDays++;
    else if (st === 'unexcused') unexcusedDays++;
    else if (st === 'late') lateDays++;
  });

  const attendanceRate = ((presentDays / 5) * 100).toFixed(0);

  // Student specific records
  const studentViolations = behaviors.filter((b) => b.studentId === student.id);
  const studentCommendations = commendations.filter((c) => c.studentId === student.id);
  const studentNotes = teacherNotes.filter((t) => t.studentId === student.id);
  const studentContacts = parentContacts.filter((p) => p.studentId === student.id);

  const handlePrint = () => {
    window.print();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    addTeacherNote({
      studentId: student.id,
      date: new Date().toLocaleDateString('vi-VN'),
      content: newNoteText,
      author: 'Lê Ngọc Minh (GVCN)',
    });
    setNewNoteText('');
  };

  // Timeline items
  const timelineItems = [
    ...studentCommendations.map((c) => ({
      type: 'commendation',
      title: c.title,
      date: c.date,
      desc: c.description,
      badge: 'Tuyên dương',
    })),
    ...studentViolations.map((v) => ({
      type: 'violation',
      title: v.violation,
      date: v.date,
      desc: `Xử lý: ${v.action} (${v.status})`,
      badge: 'Vi phạm',
    })),
    ...studentContacts.map((p) => ({
      type: 'contact',
      title: `Trao đổi PH qua ${p.method}`,
      date: p.date,
      desc: p.content,
      badge: 'Liên hệ PH',
    })),
    ...studentNotes.map((n) => ({
      type: 'note',
      title: 'GVCN ghi chú',
      date: n.date,
      desc: n.content,
      badge: 'Ghi chú',
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      {/* Top Header & Student Selector */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E3ECF8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('students')}
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Quay lại danh sách học sinh"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#172B4D]">
                HỒ SƠ HỌC SINH 360°
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#1677FF] border border-blue-200">
                {student.fullName} ({student.studentCode})
              </span>
            </div>
            <p className="text-xs text-[#6B7A90] mt-0.5">
              Toàn bộ học bạ, lịch sử chuyên cần, nề nếp kỷ luật và trao đổi với phụ huynh
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick student switcher dropdown */}
          <select
            value={student.id}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-[#F3F8FF] text-xs font-bold text-[#1677FF] px-3 py-2 rounded-xl border border-blue-200 focus:outline-none cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.studentCode} - {s.fullName}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit className="w-4 h-4 text-amber-600" />
            Chỉnh sửa
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Xuất hồ sơ (In)
          </button>
        </div>
      </div>

      {/* Main Student Profile Dossier Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E3ECF8] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <img
              src={student.avatar}
              alt={student.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-blue-100 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B4D]">
                  {student.fullName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  Lớp 6A4
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    student.status === 'Đang học'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {student.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Mã HS:</span>
                  <span className="font-mono font-bold text-blue-700">{student.studentCode}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Giới tính:</span>
                  <span>{student.gender}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Ngày sinh:</span>
                  <span>{student.birthday} (12 tuổi)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Tổ học tập:</span>
                  <span>Tổ {student.squad}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:col-span-2">
                  <span className="font-semibold text-slate-400">Phụ huynh:</span>
                  <span className="font-medium text-slate-800">
                    {student.parentName} • {student.parentPhone}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:col-span-2 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{student.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Personal KPI Cards (Requirement 13) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-center min-w-[90px]">
              <div className="text-[11px] font-semibold text-blue-700 uppercase">Điểm TB</div>
              <div className="text-xl font-extrabold text-[#1677FF] mt-0.5">
                {academic?.gpa?.toFixed(1) || '8.2'}
              </div>
              <div className="text-[10px] text-blue-500 font-medium">HK I</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 text-center min-w-[90px]">
              <div className="text-[11px] font-semibold text-emerald-700 uppercase">Chuyên cần</div>
              <div className="text-xl font-extrabold text-emerald-600 mt-0.5">
                {attendanceRate}%
              </div>
              <div className="text-[10px] text-emerald-500 font-medium">{presentDays}/5 buổi</div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-100 text-center min-w-[90px]">
              <div className="text-[11px] font-semibold text-purple-700 uppercase">Rèn luyện</div>
              <div className="text-xl font-extrabold text-purple-700 mt-0.5">
                {student.conduct}
              </div>
              <div className="text-[10px] text-purple-500 font-medium">Hạnh kiểm</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-100 text-center min-w-[90px]">
              <div className="text-[11px] font-semibold text-amber-700 uppercase">Học lực</div>
              <div className="text-xl font-extrabold text-amber-700 mt-0.5">
                {academic?.rank || 'Khá'}
              </div>
              <div className="text-[10px] text-amber-600 font-medium">Xếp loại</div>
            </div>
          </div>
        </div>

        {/* 6 Tabs Navigation (Requirement 13) */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 pt-4 pb-2">
          {[
            { id: 'overview', name: '1. Tổng quan & Diễn biến', icon: <GraduationCap className="w-4 h-4" /> },
            { id: 'academic', name: '2. Học tập (Chi tiết môn)', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'attendance', name: '3. Chuyên cần tuần', icon: <Calendar className="w-4 h-4" /> },
            { id: 'discipline', name: '4. Nề nếp & Khen thưởng', icon: <Award className="w-4 h-4" /> },
            { id: 'notes', name: '5. Sổ tay GVCN', icon: <FileText className="w-4 h-4" /> },
            { id: 'parent_contact', name: '6. Trao đổi phụ huynh', icon: <MessageSquare className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1677FF] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Academic Trend & Remarks */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#1677FF]" />
                    <h3 className="font-bold text-sm text-[#172B4D]">
                      BIỂU ĐỒ ĐIỂM SỐ CÁC MÔN CHÍNH
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Toán, Văn, Anh</span>
                </div>

                {/* Score bar cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-xs font-semibold text-slate-500">Môn Toán</div>
                    <div className="text-2xl font-extrabold text-blue-700 mt-1">
                      {academic?.scores['math']?.tbm?.toFixed(1) || '7.5'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Hệ số 2</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-xs font-semibold text-slate-500">Môn Ngữ văn</div>
                    <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                      {academic?.scores['lit']?.tbm?.toFixed(1) || '8.0'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Hệ số 2</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-xs font-semibold text-slate-500">Môn Tiếng Anh</div>
                    <div className="text-2xl font-extrabold text-purple-700 mt-1">
                      {academic?.scores['eng']?.tbm?.toFixed(1) || '8.5'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Hệ số 2</div>
                  </div>
                </div>
              </div>

              {/* Nhận xét chung của GVCN */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-[#172B4D]">Nhận xét đánh giá của GVCN</h3>
                  <span className="text-xs text-slate-400">Cập nhật 25/09/2026</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  {student.notes ||
                    'Em có ý thức kỷ luật tốt, tích cực trong các giờ học, hòa đồng với bạn bè. Cần duy trì phong độ môn Tiếng Anh và tăng cường rèn luyện kỹ năng giải toán hình học.'}
                </p>
              </div>
            </div>

            {/* Right 1 Col: HOẠT ĐỘNG GẦN ĐÂY TIMELINE (Requirement 13) */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-sm text-[#172B4D] mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1677FF]" />
                HOẠT ĐỘNG GẦN ĐÂY
              </h3>

              <div className="space-y-4">
                {timelineItems.length === 0 ? (
                  <div className="text-xs text-slate-400 text-center py-6">
                    Chưa có hoạt động đặc biệt nào được ghi nhận
                  </div>
                ) : (
                  timelineItems.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#1677FF] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{item.title}</span>
                          <span className="text-[10px] text-slate-400">{item.date}</span>
                        </div>
                        <div className="text-slate-600 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Academic */}
        {activeTab === 'academic' && (
          <div className="pt-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-800">Bảng điểm chi tiết 10 môn học</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Môn học</th>
                    <th className="py-2.5 px-3 text-center">ĐĐG tx1</th>
                    <th className="py-2.5 px-3 text-center">ĐĐG tx2</th>
                    <th className="py-2.5 px-3 text-center">Giữa kỳ</th>
                    <th className="py-2.5 px-3 text-center">Cuối kỳ</th>
                    <th className="py-2.5 px-3 text-center bg-blue-50 font-bold text-blue-900">
                      TBM
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {academic &&
                    Object.values(academic.scores).map((sc) => (
                      <tr key={sc.subjectId} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-800">{sc.subjectName}</td>
                        <td className="py-2 px-3 text-center">{sc.tx1.toFixed(1)}</td>
                        <td className="py-2 px-3 text-center">{sc.tx2.toFixed(1)}</td>
                        <td className="py-2 px-3 text-center">{sc.gk.toFixed(1)}</td>
                        <td className="py-2 px-3 text-center">{sc.ck.toFixed(1)}</td>
                        <td className="py-2 px-3 text-center font-bold text-blue-700 bg-blue-50/30">
                          {sc.tbm.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Attendance */}
        {activeTab === 'attendance' && (
          <div className="pt-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-800">Lịch sử điểm danh tuần này</h3>
            <div className="grid grid-cols-5 gap-3">
              {DAYS_OF_WEEK.map((d) => {
                const rec = studentAtt[d.date];
                const st = rec?.status || 'present';
                return (
                  <div
                    key={d.id}
                    className="p-4 rounded-xl border border-slate-200 text-center bg-slate-50"
                  >
                    <div className="font-bold text-slate-800 text-xs">{d.name}</div>
                    <div className="text-[10px] text-slate-400">{d.date}</div>
                    <div className="mt-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          st === 'present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : st === 'excused'
                            ? 'bg-amber-100 text-amber-800'
                            : st === 'unexcused'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {st === 'present'
                          ? 'Có mặt'
                          : st === 'excused'
                          ? 'Nghỉ phép'
                          : st === 'unexcused'
                          ? 'Không phép'
                          : 'Đi muộn'}
                      </span>
                    </div>
                    {rec?.note && <div className="text-[11px] text-slate-500 mt-2">{rec.note}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Discipline & Commendation */}
        {activeTab === 'discipline' && (
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-sm text-emerald-800 mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                Thành tích & Tuyên dương ({studentCommendations.length})
              </h3>
              <div className="space-y-2.5">
                {studentCommendations.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs"
                  >
                    <div className="font-bold text-emerald-900">{c.title}</div>
                    <div className="text-slate-600 mt-1">{c.description}</div>
                    <div className="text-[10px] text-emerald-700 mt-1">
                      {c.date} • {c.awardType}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-amber-800 mb-3 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Vi phạm nề nếp ({studentViolations.length})
              </h3>
              <div className="space-y-2.5">
                {studentViolations.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs"
                  >
                    <div className="font-bold text-amber-900">{v.violation}</div>
                    <div className="text-slate-600 mt-1">Hình thức: {v.action}</div>
                    <div className="text-[10px] text-amber-700 mt-1">
                      {v.date} • Trạng thái: {v.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Sổ tay GVCN */}
        {activeTab === 'notes' && (
          <div className="pt-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-800">Sổ tay theo dõi riêng của GVCN</h3>

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Nhập ghi chú theo dõi học sinh (VD: Kèm thêm bài hình học, cần khen ngợi trước lớp...)"
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1677FF] text-white text-xs font-bold rounded-xl hover:bg-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Lưu ghi chú
              </button>
            </form>

            <div className="space-y-2.5 mt-4">
              {studentNotes.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                    <span>{n.author}</span>
                    <span>{n.date}</span>
                  </div>
                  <div className="text-slate-800">{n.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Trao đổi phụ huynh */}
        {activeTab === 'parent_contact' && (
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800">
                Nhật ký liên hệ phụ huynh ({student.parentName} - {student.parentPhone})
              </h3>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-3 py-1.5 bg-[#1677FF] text-white text-xs font-bold rounded-xl hover:bg-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm cuộc trao đổi
              </button>
            </div>

            <div className="space-y-3">
              {studentContacts.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[#1677FF]">
                      Hình thức: {c.method} • {c.date}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                      {c.status}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 mb-1">
                    Nội dung: <span className="font-normal text-slate-600">{c.content}</span>
                  </div>
                  {c.feedback && (
                    <div className="font-semibold text-slate-800">
                      Phản hồi PH: <span className="font-normal text-slate-600">{c.feedback}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      <StudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={student}
        onSave={(data) => updateStudent(data)}
      />

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        defaultStudentId={student.id}
      />
    </div>
  );
};
