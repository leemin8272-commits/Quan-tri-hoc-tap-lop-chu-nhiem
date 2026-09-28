import React, { useState, useMemo } from 'react';
import { useClass } from '../../context/ClassContext';
import { SubjectAvgChart } from '../common/Charts';
import {
  GraduationCap,
  Download,
  Upload,
  Search,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

export const AcademicView: React.FC = () => {
  const {
    students,
    subjects,
    academicRecords,
    updateSubjectScore,
    viewStudentProfile,
    showToast,
  } = useClass();

  const [semesterFilter, setSemesterFilter] = useState<'HK1' | 'HK2'>('HK1');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchStudent, setSearchStudent] = useState<string>('');

  // Editing cell state: { studentId, subjectId, field, tempValue }
  const [editingCell, setEditingCell] = useState<{
    studentId: string;
    subjectId: string;
    field: 'tx1' | 'tx2' | 'gk' | 'ck';
    tempValue: string;
  } | null>(null);

  // Subject Averages Calculation for Chart
  const subjectAverages = useMemo(() => {
    return subjects.map((sub) => {
      let sum = 0;
      let count = 0;
      Object.values(academicRecords).forEach((rec) => {
        const score = rec.scores[sub.id];
        if (score && score.tbm) {
          sum += score.tbm;
          count++;
        }
      });
      return {
        name: sub.name,
        avg: count > 0 ? Number((sum / count).toFixed(1)) : 0,
      };
    });
  }, [subjects, academicRecords]);

  // Overall Class GPA
  const overallAvg = useMemo(() => {
    const list = Object.values(academicRecords);
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + curr.gpa, 0);
    return Number((sum / list.length).toFixed(1));
  }, [academicRecords]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(searchStudent.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchStudent.toLowerCase())
    );
  }, [students, searchStudent]);

  // Export Academic CSV
  const handleExportScores = () => {
    let header = '\uFEFFMã HS,Họ và tên,';
    if (selectedSubjectId === 'all') {
      header += subjects.map((s) => s.name).join(',') + ',Điểm TB,Xếp loại\n';
    } else {
      const sub = subjects.find((s) => s.id === selectedSubjectId);
      header += `ĐĐG tx1,ĐĐG tx2,ĐĐG GK,ĐĐG CK,TBM ${sub?.name || ''},Xếp loại\n`;
    }

    const rows = filteredStudents
      .map((s) => {
        const record = academicRecords[s.id];
        if (!record) return `"${s.studentCode}","${s.fullName}"`;

        if (selectedSubjectId === 'all') {
          const subScores = subjects.map((sub) => record.scores[sub.id]?.tbm || '-').join(',');
          return `"${s.studentCode}","${s.fullName}",${subScores},${record.gpa},"${record.rank}"`;
        } else {
          const sc = record.scores[selectedSubjectId];
          return `"${s.studentCode}","${s.fullName}",${sc?.tx1 || '-'},${sc?.tx2 || '-'},${sc?.gk || '-'},${sc?.ck || '-'},${sc?.tbm || '-'},"${record.rank}"`;
        }
      })
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bang_Diem_Lop_6A4_${semesterFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      title: 'Xuất bảng điểm thành công',
      message: 'Tệp CSV bảng điểm đã được tải về máy tính.',
    });
  };

  const handleSaveCell = () => {
    if (!editingCell) return;
    const num = parseFloat(editingCell.tempValue);
    if (!isNaN(num) && num >= 0 && num <= 10) {
      updateSubjectScore(editingCell.studentId, editingCell.subjectId, editingCell.field, num);
    }
    setEditingCell(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#172B4D] tracking-tight">
              KẾT QUẢ HỌC TẬP - LỚP 6A4
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#1677FF] border border-blue-200">
              ĐTB chung: {overallAvg}
            </span>
          </div>
          <p className="text-xs text-[#6B7A90] mt-0.5">
            Nhập điểm trực tiếp, theo dõi tiến độ các môn học và tự động tính điểm trung bình
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportScores}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600" />
            Xuất bảng điểm Excel
          </button>
        </div>
      </div>

      {/* Overview Analytics: Subject Averages Chart + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#172B4D]">
                Điểm trung bình theo môn học (Cả lớp)
              </h2>
              <p className="text-[11px] text-[#6B7A90]">So sánh mức độ tiếp thu 10 môn văn hóa</p>
            </div>
            <div className="text-xs text-slate-400 font-medium">Thang điểm 10.0</div>
          </div>
          <SubjectAvgChart subjects={subjectAverages} />
        </div>

        {/* Academic summary cards */}
        <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#172B4D]">Nhận định tình hình học tập</h2>
              <p className="text-[11px] text-[#6B7A90]">Ghi chú tự động tổng hợp từ điểm số</p>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <div className="font-bold text-blue-900 mb-0.5">Môn thế mạnh của lớp:</div>
                <div>Lịch sử (8.3), Sinh học (8.1) và Ngữ văn (7.8) có phổ điểm đồng đều và tích cực.</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                <div className="font-bold text-amber-900 mb-0.5">Môn cần tăng cường bổ trợ:</div>
                <div>Môn Toán (7.1) có độ phân hóa cao, 3 học sinh có nguy cơ dưới trung bình cần kèm cặp.</div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <div className="font-bold text-emerald-900 mb-0.5">Tiến bộ vượt trội:</div>
                <div>Trần Hoàng Nam (+2.0 điểm Toán) và Nguyễn Minh Anh (+1.5 điểm Tiếng Anh).</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-400">
            * Nhấp đúp hoặc bấm vào ô điểm bất kỳ để sửa trực tiếp.
          </div>
        </div>
      </div>

      {/* Filter Bar & Selector */}
      <div className="bg-white rounded-2xl p-4 border border-[#E3ECF8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            placeholder="Tìm theo tên hoặc mã HS..."
            className="w-full bg-[#F3F8FF] hover:bg-slate-100 text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-[#1677FF] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Semester Selector */}
          <div className="flex items-center gap-1 bg-[#F3F8FF] p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSemesterFilter('HK1')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                semesterFilter === 'HK1'
                  ? 'bg-white text-[#1677FF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Học kỳ I
            </button>
            <button
              onClick={() => setSemesterFilter('HK2')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                semesterFilter === 'HK2'
                  ? 'bg-white text-[#1677FF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Học kỳ II
            </button>
          </div>

          {/* Subject Selector */}
          <div className="relative">
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="bg-[#F3F8FF] text-xs font-bold text-[#1677FF] px-3.5 py-2 pr-8 rounded-xl border border-blue-200 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">Tất cả môn học (Tổng hợp TBM)</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  Môn: {sub.name} (Chi tiết tx1, tx2, gk, ck)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#1677FF] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Gradebook Table */}
      <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F3F8FF] text-[#6B7A90] font-bold border-b border-[#E3ECF8]">
                <th className="py-3 px-4 text-center w-12 sticky left-0 bg-[#F3F8FF] z-10">STT</th>
                <th className="py-3 px-4 sticky left-12 bg-[#F3F8FF] z-10 min-w-[180px]">Học sinh</th>

                {selectedSubjectId === 'all' ? (
                  // Columns: All subjects TBM
                  subjects.map((sub) => (
                    <th key={sub.id} className="py-3 px-3 text-center min-w-[65px]">
                      {sub.name}
                    </th>
                  ))
                ) : (
                  // Columns: Specific subject test grades
                  <>
                    <th className="py-3 px-3 text-center min-w-[70px]">ĐĐG tx1</th>
                    <th className="py-3 px-3 text-center min-w-[70px]">ĐĐG tx2</th>
                    <th className="py-3 px-3 text-center min-w-[70px]">Giữa kỳ (x2)</th>
                    <th className="py-3 px-3 text-center min-w-[70px]">Cuối kỳ (x3)</th>
                    <th className="py-3 px-3 text-center min-w-[70px] bg-blue-100/50 text-blue-900">
                      TBM
                    </th>
                  </>
                )}

                <th className="py-3 px-4 text-center bg-blue-50 text-blue-900 font-extrabold min-w-[80px]">
                  Điểm TB
                </th>
                <th className="py-3 px-4 text-center min-w-[90px]">Xếp loại</th>
                <th className="py-3 px-3 text-center w-12">Hồ sơ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E3ECF8]">
              {filteredStudents.map((st, idx) => {
                const record = academicRecords[st.id];
                if (!record) return null;

                return (
                  <tr key={st.id} className="hover:bg-blue-50/30 transition-colors">
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
                        <div className="min-w-0">
                          <div className="font-bold text-[#172B4D] truncate">{st.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{st.studentCode}</div>
                        </div>
                      </div>
                    </td>

                    {selectedSubjectId === 'all' ? (
                      // Render TBM of each subject with color coding
                      subjects.map((sub) => {
                        const scoreObj = record.scores[sub.id];
                        const tbm = scoreObj?.tbm ?? 0;
                        let colorClass = 'text-slate-700';
                        if (tbm >= 8.0) colorClass = 'text-blue-700 font-bold';
                        else if (tbm < 5.0) colorClass = 'text-red-600 font-bold';

                        return (
                          <td
                            key={sub.id}
                            className={`py-2.5 px-3 text-center text-xs ${colorClass}`}
                          >
                            {tbm ? tbm.toFixed(1) : '-'}
                          </td>
                        );
                      })
                    ) : (
                      // Render editable cells for specific subject
                      (() => {
                        const sc = record.scores[selectedSubjectId];
                        const fields: ('tx1' | 'tx2' | 'gk' | 'ck')[] = ['tx1', 'tx2', 'gk', 'ck'];

                        return (
                          <>
                            {fields.map((f) => {
                              const isEditing =
                                editingCell?.studentId === st.id &&
                                editingCell?.subjectId === selectedSubjectId &&
                                editingCell?.field === f;

                              const val = sc ? sc[f] : 0;

                              return (
                                <td key={f} className="py-2.5 px-3 text-center text-xs">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      step="0.1"
                                      min="0"
                                      max="10"
                                      autoFocus
                                      value={editingCell.tempValue}
                                      onChange={(e) =>
                                        setEditingCell({ ...editingCell, tempValue: e.target.value })
                                      }
                                      onBlur={handleSaveCell}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveCell();
                                        if (e.key === 'Escape') setEditingCell(null);
                                      }}
                                      className="w-14 text-center py-1 px-1 rounded-lg border-2 border-[#1677FF] bg-white font-bold text-blue-900 outline-none shadow-xs"
                                    />
                                  ) : (
                                    <span
                                      onClick={() =>
                                        setEditingCell({
                                          studentId: st.id,
                                          subjectId: selectedSubjectId,
                                          field: f,
                                          tempValue: String(val),
                                        })
                                      }
                                      title="Nhấp để sửa điểm"
                                      className="inline-block px-2 py-1 rounded-md hover:bg-blue-100/70 cursor-pointer font-medium text-slate-800 transition-colors"
                                    >
                                      {val !== undefined ? val.toFixed(1) : '-'}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="py-2.5 px-3 text-center font-bold text-blue-700 bg-blue-50/50">
                              {sc?.tbm ? sc.tbm.toFixed(1) : '-'}
                            </td>
                          </>
                        );
                      })()
                    )}

                    {/* Overall GPA */}
                    <td className="py-2.5 px-4 text-center font-extrabold text-sm text-blue-700 bg-blue-50/40">
                      {record.gpa.toFixed(1)}
                    </td>

                    {/* Rank Badge */}
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          record.rank === 'Giỏi'
                            ? 'bg-blue-50 text-[#1677FF] border-blue-200'
                            : record.rank === 'Khá'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : record.rank === 'Trung bình'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {record.rank}
                      </span>
                    </td>

                    {/* Link to 360 profile */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => viewStudentProfile(st.id)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                        title="Xem học bạ chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
