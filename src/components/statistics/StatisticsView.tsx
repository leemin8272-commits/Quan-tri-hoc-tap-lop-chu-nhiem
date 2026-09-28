import React, { useState, useMemo } from 'react';
import { useClass } from '../../context/ClassContext';
import { DonutChart, WeeklyGpaLineChart, AttendanceBarChart } from '../common/Charts';
import { WEEKLY_GPA_TREND, WEEKLY_ATTENDANCE_TREND } from '../../data/mockData';
import {
  BarChart3,
  Calendar,
  Users,
  GraduationCap,
  ShieldAlert,
  Award,
  Download,
  Filter,
} from 'lucide-react';

export const StatisticsView: React.FC = () => {
  const { students, academicRecords, attendance, behaviors, commendations, timeframe, setTimeframe } = useClass();

  // Rank distribution
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

  // Conduct distribution
  const conductStats = useMemo(() => {
    let tot = 0;
    let kha = 0;
    let tb = 0;
    let yeu = 0;

    students.forEach((s) => {
      if (s.conduct === 'Tốt') tot++;
      else if (s.conduct === 'Khá') kha++;
      else if (s.conduct === 'Trung bình') tb++;
      else yeu++;
    });

    return [
      { label: 'Tốt', count: tot, color: '#22C55E' },
      { label: 'Khá', count: kha, color: '#1677FF' },
      { label: 'Trung bình', count: tb, color: '#F59E0B' },
      { label: 'Yếu', count: yeu, color: '#EF4444' },
    ];
  }, [students]);

  // Overall calculations
  const totalGpa = Object.values(academicRecords).reduce((acc, curr) => acc + curr.gpa, 0);
  const classAvgGpa = Number((totalGpa / (students.length || 1)).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#172B4D]">
              THỐNG KÊ TỔNG HỢP LỚP 6A4
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#1677FF] border border-blue-200">
              Thời gian: {timeframe}
            </span>
          </div>
          <p className="text-xs text-[#6B7A90] mt-0.5">
            Dữ liệu phân tích đa chiều về học lực, chuyên cần, nề nếp và phong trào
          </p>
        </div>

        {/* Timeframe Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-[#F3F8FF] p-1 rounded-xl text-xs font-semibold">
          {['Tuần này', 'Tháng này', 'Học kỳ I', 'Cả năm'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-white text-[#1677FF] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-blue-100 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Tổng học sinh</div>
          <div className="text-3xl font-extrabold text-[#172B4D] mt-1">{students.length}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">100% duy trì sĩ số</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Tỷ lệ chuyên cần</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">96.2%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">+0.5% so với tuần 3</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-blue-100 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Điểm TB lớp</div>
          <div className="text-3xl font-extrabold text-[#1677FF] mt-1">{classAvgGpa}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Mục tiêu: 7.5</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-amber-100 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Số vụ vi phạm</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">{behaviors.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Đã xử lý: {behaviors.filter(b => b.status === 'Đã xử lý').length}</div>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic distribution */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs">
          <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#172B4D]">KẾT QUẢ XẾP LOẠI HỌC LỰC</h2>
              <p className="text-[11px] text-[#6B7A90]">Phân bố theo thông tư 22/2021/TT-BGDĐT</p>
            </div>
          </div>
          <DonutChart
            centerNumber={students.length}
            centerLabel="Học sinh"
            segments={rankStats}
            size={160}
          />
        </div>

        {/* Conduct distribution */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs">
          <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#172B4D]">XẾP LOẠI RÈN LUYỆN (HẠNH KIỂM)</h2>
              <p className="text-[11px] text-[#6B7A90]">Đánh giá nề nếp kỷ luật toàn diện</p>
            </div>
          </div>
          <DonutChart
            centerNumber={students.length}
            centerLabel="Học sinh"
            segments={conductStats}
            size={160}
          />
        </div>
      </div>

      {/* Progress & Trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs">
          <div className="pb-3 mb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-[#172B4D]">TIẾN BỘ HỌC TẬP (ĐIỂM TB THEO TUẦN)</h2>
            <p className="text-[11px] text-[#6B7A90]">So sánh ĐTB tuần 1 đến tuần 8</p>
          </div>
          <WeeklyGpaLineChart data={WEEKLY_GPA_TREND} />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs">
          <div className="pb-3 mb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-[#172B4D]">CHUYÊN CẦN THEO TUẦN</h2>
            <p className="text-[11px] text-[#6B7A90]">Tỷ lệ có mặt đầy đủ qua các tuần học</p>
          </div>
          <AttendanceBarChart data={WEEKLY_ATTENDANCE_TREND} />
        </div>
      </div>
    </div>
  );
};
