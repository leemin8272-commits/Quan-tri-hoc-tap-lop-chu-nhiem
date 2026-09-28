import React, { useState, useMemo } from 'react';
import { useClass } from '../../context/ClassContext';
import { AttendanceStatus } from '../../types';
import { DAYS_OF_WEEK } from '../../data/mockData';
import {
  CalendarCheck,
  Check,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserX,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    students,
    attendance,
    updateAttendance,
    markAllPresentForDate,
    showToast,
  } = useClass();

  // Mode: 'week' (full 5-day grid with interactive status dots) | 'day' (detailed single day with notes)
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDayDate, setSelectedDayDate] = useState<string>(DAYS_OF_WEEK[4].date); // Friday by default
  const [selectedWeek, setSelectedWeek] = useState<number>(4);

  // Status cycling helper: present -> excused -> unexcused -> late -> present
  const nextStatusMap: Record<AttendanceStatus, AttendanceStatus> = {
    present: 'excused',
    excused: 'unexcused',
    unexcused: 'late',
    late: 'present',
  };

  const handleToggleDayStatus = (studentId: string, date: string) => {
    const current = attendance[studentId]?.[date]?.status || 'present';
    const next = nextStatusMap[current];
    updateAttendance(studentId, date, next);
  };

  // Day stats
  const dayStats = useMemo(() => {
    let present = 0;
    let excused = 0;
    let unexcused = 0;
    let late = 0;

    students.forEach((s) => {
      const rec = attendance[s.id]?.[selectedDayDate];
      const st = rec?.status || 'present';
      if (st === 'present') present++;
      else if (st === 'excused') excused++;
      else if (st === 'unexcused') unexcused++;
      else if (st === 'late') late++;
    });

    return { present, excused, unexcused, late };
  }, [students, attendance, selectedDayDate]);

  // Overall Week Stats
  const weekStats = useMemo(() => {
    let totalSlots = students.length * DAYS_OF_WEEK.length;
    let presentCount = 0;
    let excusedCount = 0;
    let unexcusedCount = 0;
    let lateCount = 0;

    students.forEach((s) => {
      DAYS_OF_WEEK.forEach((d) => {
        const rec = attendance[s.id]?.[d.date];
        const st = rec?.status || 'present';
        if (st === 'present') presentCount++;
        else if (st === 'excused') excusedCount++;
        else if (st === 'unexcused') unexcusedCount++;
        else if (st === 'late') lateCount++;
      });
    });

    const rate = ((presentCount / totalSlots) * 100).toFixed(1);
    return { presentCount, excusedCount, unexcusedCount, lateCount, rate };
  }, [students, attendance]);

  // Export Attendance CSV
  const handleExportAttendance = () => {
    let header = '\uFEFFMã HS,Họ và tên,Thứ 2,Thứ 3,Thứ 4,Thứ 5,Thứ 6,Chuyên cần (%)\n';
    const statusLabels: Record<AttendanceStatus, string> = {
      present: 'Có mặt',
      excused: 'Nghỉ phép',
      unexcused: 'Không phép',
      late: 'Đi muộn',
    };

    const rows = students
      .map((s) => {
        let presentDays = 0;
        const days = DAYS_OF_WEEK.map((d) => {
          const st = attendance[s.id]?.[d.date]?.status || 'present';
          if (st === 'present') presentDays++;
          return statusLabels[st];
        }).join(',');
        const percent = ((presentDays / 5) * 100).toFixed(0);
        return `"${s.studentCode}","${s.fullName}",${days},${percent}%`;
      })
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Diem_Danh_Tuan_${selectedWeek}_Lop_6A4.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      title: 'Xuất dữ liệu điểm danh',
      message: 'Bảng điểm danh đã được tải về tệp CSV.',
    });
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" /> Có mặt
          </span>
        );
      case 'excused':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Nghỉ phép
          </span>
        );
      case 'unexcused':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <UserX className="w-3 h-3 text-red-600" /> Vắng không phép
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1677FF] border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" /> Đi muộn
          </span>
        );
    }
  };

  const getStatusDot = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <span className="w-4 h-4 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/30" title="Có mặt" />;
      case 'excused':
        return <span className="w-4 h-4 rounded-full bg-amber-500 shadow-xs shadow-amber-500/30" title="Nghỉ phép" />;
      case 'unexcused':
        return <span className="w-4 h-4 rounded-full bg-red-500 shadow-xs shadow-red-500/30 animate-pulse" title="Vắng không phép" />;
      case 'late':
        return <span className="w-4 h-4 rounded-full bg-[#1677FF] shadow-xs shadow-blue-500/30" title="Đi muộn" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#172B4D] tracking-tight">
              ĐIỂM DANH & QUẢN LÝ CHUYÊN CẦN
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Tỷ lệ tuần: {weekStats.rate}%
            </span>
          </div>
          <p className="text-xs text-[#6B7A90] mt-0.5">
            Nhấp trực tiếp vào từng ô để đổi nhanh trạng thái: Có mặt → Phép → Không phép → Muộn
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => markAllPresentForDate(selectedDayDate)}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-emerald-200"
          >
            <CheckCircle2 className="w-4 h-4" />
            Đánh dấu tất cả có mặt
          </button>

          <button
            onClick={handleExportAttendance}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* KPI Cards: Today & Week Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Có mặt hôm nay</div>
            <div className="text-2xl font-extrabold text-emerald-700 mt-0.5">{dayStats.present}</div>
            <div className="text-[11px] text-slate-400">
              {((dayStats.present / students.length) * 100).toFixed(1)}% sĩ số
            </div>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-amber-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Nghỉ phép</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-0.5">{dayStats.excused}</div>
            <div className="text-[11px] text-slate-400">Có đơn xin phép PH</div>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-red-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Không phép</div>
            <div className="text-2xl font-extrabold text-red-600 mt-0.5">{dayStats.unexcused}</div>
            <div className="text-[11px] text-red-500 font-semibold">Cần liên hệ gia đình</div>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-blue-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Đi muộn</div>
            <div className="text-2xl font-extrabold text-[#1677FF] mt-0.5">{dayStats.late}</div>
            <div className="text-[11px] text-slate-400">Trừ điểm thi đua</div>
          </div>
        </div>
      </div>

      {/* Mode & Date Navigation Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E3ECF8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#F3F8FF] p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'week' ? 'bg-white text-[#1677FF] shadow-xs' : 'text-slate-600'
            }`}
          >
            Xem theo tuần (Thứ 2 - Thứ 6)
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'day' ? 'bg-white text-[#1677FF] shadow-xs' : 'text-slate-600'
            }`}
          >
            Xem chi tiết ngày ({selectedDayDate})
          </button>
        </div>

        {/* Day Selector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {DAYS_OF_WEEK.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDayDate(d.date);
                if (viewMode === 'day') {
                  showToast({ type: 'info', title: `Đã chọn ngày ${d.name} (${d.date})` });
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedDayDate === d.date
                  ? 'bg-[#1677FF] text-white border-[#1677FF] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Attendance Table */}
      <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F3F8FF] text-[#6B7A90] font-bold border-b border-[#E3ECF8]">
                <th className="py-3 px-4 text-center w-12 sticky left-0 bg-[#F3F8FF] z-10">STT</th>
                <th className="py-3 px-4 sticky left-12 bg-[#F3F8FF] z-10 min-w-[200px]">Học sinh</th>

                {viewMode === 'week' ? (
                  // Week columns (Mon to Fri)
                  DAYS_OF_WEEK.map((d) => (
                    <th key={d.id} className="py-3 px-4 text-center min-w-[90px]">
                      <div className="font-bold text-slate-800">{d.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{d.date.slice(5)}</div>
                    </th>
                  ))
                ) : (
                  // Day mode columns
                  <>
                    <th className="py-3 px-4 text-center min-w-[140px]">Trạng thái</th>
                    <th className="py-3 px-4 min-w-[260px]">Ghi chú chi tiết của GVCN</th>
                  </>
                )}

                <th className="py-3 px-4 text-center min-w-[100px]">Tỷ lệ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E3ECF8]">
              {students.map((st, idx) => {
                const recs = attendance[st.id] || {};
                let presentCount = 0;
                DAYS_OF_WEEK.forEach((d) => {
                  if ((recs[d.date]?.status || 'present') === 'present') presentCount++;
                });
                const studentRate = ((presentCount / 5) * 100).toFixed(0);

                return (
                  <tr key={st.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-2.5 px-4 text-center text-slate-400 font-semibold sticky left-0 bg-white">
                      {idx + 1}
                    </td>

                    <td className="py-2.5 px-4 sticky left-12 bg-white">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={st.avatar}
                          alt={st.fullName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <span className="font-bold text-[#172B4D]">{st.fullName}</span>
                          <div className="text-[10px] text-slate-400 font-mono">{st.studentCode}</div>
                        </div>
                      </div>
                    </td>

                    {viewMode === 'week' ? (
                      // Week mode: Clickable status cell for each day
                      DAYS_OF_WEEK.map((d) => {
                        const status = recs[d.date]?.status || 'present';
                        const note = recs[d.date]?.note;

                        return (
                          <td key={d.id} className="py-2.5 px-4 text-center">
                            <button
                              onClick={() => handleToggleDayStatus(st.id, d.date)}
                              title={`${st.fullName} - ${d.name}: ${status}${note ? ` (${note})` : ''}\n(Bấm để đổi trạng thái)`}
                              className="w-9 h-9 mx-auto rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all cursor-pointer active:scale-95 group"
                            >
                              {getStatusDot(status)}
                            </button>
                          </td>
                        );
                      })
                    ) : (
                      // Day mode: Dropdown & Note input
                      <>
                        <td className="py-2.5 px-4 text-center">
                          <select
                            value={recs[selectedDayDate]?.status || 'present'}
                            onChange={(e) =>
                              updateAttendance(
                                st.id,
                                selectedDayDate,
                                e.target.value as AttendanceStatus,
                                recs[selectedDayDate]?.note
                              )
                            }
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-[#1677FF] bg-white cursor-pointer"
                          >
                            <option value="present">🟢 Có mặt</option>
                            <option value="excused">🟠 Nghỉ phép</option>
                            <option value="unexcused">🔴 Không phép</option>
                            <option value="late">🔵 Đi muộn</option>
                          </select>
                        </td>

                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            defaultValue={recs[selectedDayDate]?.note || ''}
                            onBlur={(e) =>
                              updateAttendance(
                                st.id,
                                selectedDayDate,
                                recs[selectedDayDate]?.status || 'present',
                                e.target.value
                              )
                            }
                            placeholder="Nhập ghi chú: Lý do vắng, giấy phép, thời gian muộn..."
                            className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:border-[#1677FF] focus:outline-none"
                          />
                        </td>
                      </>
                    )}

                    {/* Attendance percentage */}
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`font-bold text-xs ${
                          Number(studentRate) >= 80 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {studentRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend footer */}
        <div className="p-4 bg-slate-50 border-t border-[#E3ECF8] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-5">
            <span className="font-bold text-slate-700">Chú thích trạng thái:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Có mặt
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              Nghỉ phép (Có đơn)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              Vắng không phép
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#1677FF]" />
              Đi muộn
            </span>
          </div>

          <div className="text-slate-400 text-[11px]">
            * Nhấp vào chấm tròn bất kỳ trong bảng để đổi trạng thái tức thì.
          </div>
        </div>
      </div>
    </div>
  );
};
