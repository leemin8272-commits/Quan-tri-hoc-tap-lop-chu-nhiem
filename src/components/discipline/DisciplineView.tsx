import React, { useState, useMemo } from 'react';
import { useClass } from '../../context/ClassContext';
import { AddViolationModal } from '../modals/AddViolationModal';
import {
  ShieldAlert,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Users,
  AlertTriangle,
  Award,
} from 'lucide-react';

export const DisciplineView: React.FC = () => {
  const {
    students,
    behaviors,
    toggleBehaviorStatus,
    viewStudentProfile,
  } = useClass();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Đã xử lý' | 'Chưa xử lý'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Conduct level counts
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

    return { tot, kha, tb, yeu };
  }, [students]);

  // Filtered violations
  const filteredViolations = useMemo(() => {
    return behaviors.filter((b) => {
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchSearch =
        b.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.violation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.action.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [behaviors, statusFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#172B4D] tracking-tight">
              QUẢN LÝ NỀ NẾP & VI PHẠM KỶ LUẬT
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {behaviors.filter((b) => b.status === 'Chưa xử lý').length} việc cần giải quyết
            </span>
          </div>
          <p className="text-xs text-[#6B7A90] mt-0.5">
            Theo dõi, xử lý vi phạm nội quy, ghi sổ đầu bài và xếp loại điểm rèn luyện
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + Thêm vi phạm
        </button>
      </div>

      {/* ĐIỂM RÈN LUYỆN SECTION (Requirement 11) */}
      <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs">
        <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#172B4D]">ĐIỂM RÈN LUYỆN - HẠNH KIỂM CẢ LỚP</h2>
            <p className="text-[11px] text-[#6B7A90]">Phân bổ xếp loại nề nếp tính đến thời điểm hiện tại</p>
          </div>
          <span className="text-xs font-bold text-slate-500">Sĩ số: {students.length}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Hạnh kiểm Tốt
              </div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                {conductStats.tot}
              </div>
              <div className="text-[11px] text-emerald-600">
                {((conductStats.tot / students.length) * 100).toFixed(1)}% lớp
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              ✓
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                Hạnh kiểm Khá
              </div>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">
                {conductStats.kha}
              </div>
              <div className="text-[11px] text-blue-600">
                {((conductStats.kha / students.length) * 100).toFixed(1)}% lớp
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              K
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Trung bình
              </div>
              <div className="text-2xl font-extrabold text-amber-700 mt-1">
                {conductStats.tb}
              </div>
              <div className="text-[11px] text-amber-600">Cần theo dõi thêm</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              TB
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-red-800 uppercase tracking-wider">
                Hạnh kiểm Yếu
              </div>
              <div className="text-2xl font-extrabold text-red-700 mt-1">
                {conductStats.yeu}
              </div>
              <div className="text-[11px] text-red-600">0 học sinh vi phạm nặng</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              !
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E3ECF8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên học sinh, nội dung..."
            className="w-full bg-[#F3F8FF] hover:bg-slate-100 text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-[#1677FF] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#F3F8FF] p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-[#1677FF] shadow-xs' : 'text-slate-600'
            }`}
          >
            Tất cả ({behaviors.length})
          </button>
          <button
            onClick={() => setStatusFilter('Chưa xử lý')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'Chưa xử lý' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Chưa xử lý ({behaviors.filter((b) => b.status === 'Chưa xử lý').length})
          </button>
          <button
            onClick={() => setStatusFilter('Đã xử lý')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'Đã xử lý' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Đã xử lý ({behaviors.filter((b) => b.status === 'Đã xử lý').length})
          </button>
        </div>
      </div>

      {/* Main Violations Table */}
      <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F3F8FF] text-[#6B7A90] font-bold border-b border-[#E3ECF8]">
                <th className="py-3 px-4 w-28">Ngày</th>
                <th className="py-3 px-4 min-w-[180px]">Học sinh</th>
                <th className="py-3 px-4 min-w-[220px]">Nội dung vi phạm</th>
                <th className="py-3 px-4 min-w-[200px]">Hình thức xử lý</th>
                <th className="py-3 px-4 text-center w-36">Trạng thái</th>
                <th className="py-3 px-4 text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3ECF8]">
              {filteredViolations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    <ShieldAlert className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    Không có bản ghi vi phạm nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredViolations.map((b) => (
                  <tr key={b.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-xs">{b.date}</td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => viewStudentProfile(b.studentId)}
                        className="font-bold text-[#172B4D] hover:text-blue-600 text-left transition-colors cursor-pointer"
                      >
                        {b.studentName}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{b.violation}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">{b.action}</td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleBehaviorStatus(b.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          b.status === 'Đã xử lý'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Bấm để chuyển trạng thái xử lý"
                      >
                        {b.status === 'Đã xử lý' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Đã xử lý
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Chưa xử lý
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => viewStudentProfile(b.studentId)}
                        className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Hồ sơ →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Violation Modal */}
      <AddViolationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
