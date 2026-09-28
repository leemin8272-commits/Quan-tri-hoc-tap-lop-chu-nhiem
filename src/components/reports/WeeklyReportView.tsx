import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { WeeklyReport } from '../../types';
import {
  FileText,
  Printer,
  FileDown,
  Sparkles,
  Save,
  CheckCircle2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export const WeeklyReportView: React.FC = () => {
  const {
    students,
    classInfo,
    weeklyReports,
    saveWeeklyReport,
    showToast,
    behaviors,
    commendations,
  } = useClass();

  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(4);

  // Current report or default draft
  const currentReport: WeeklyReport = weeklyReports.find((r) => r.week === selectedWeekNum) || {
    week: selectedWeekNum,
    semester: 'Học kỳ I',
    dateRange: '21/09/2026 - 25/09/2026',
    generalRemark:
      'Tuần này lớp 6A4 duy trì nề nếp tốt, tỷ lệ chuyên cần đạt 96.2%. Một số học sinh có biểu hiện tiến bộ trong học tập như Nguyễn Minh Anh, Trần Hoàng Nam. Tuy nhiên còn trường hợp nghỉ học không phép (Phạm Gia Huy) và vi phạm sử dụng điện thoại cần tiếp tục chấn chỉnh.',
    academicSummary:
      '1. Tình hình học tập: Hoàn thành đúng tiến độ phân phối chương trình tuần 4. Đa số các em chuẩn bị bài chu đáo trước khi đến lớp. Các môn Toán, Ngữ văn duy trì phong độ tốt. Môn Tiếng Anh có tiến bộ nổi bật.',
    attendanceSummary:
      '2. Tình hình chuyên cần: Tổng số buổi đi học đạt 96.2%. Có 2 học sinh vắng có phép do nghỉ ốm, 1 học sinh vắng không phép. Đi muộn 2 lượt.',
    disciplineSummary:
      '3. Tình hình nề nếp: Toàn lớp thực hiện đúng đồng phục và khăn quàng. Xảy ra 3 trường hợp vi phạm (sử dụng điện thoại, đi học muộn) đã được xử lý nhắc nhở và thông báo đến phụ huynh.',
    activities:
      '4. Hoạt động phong trào: Lớp tích cực tham gia phong trào nuôi heo đất giúp bạn nghèo và chuẩn bị cho Đại hội Chi đội nhiệm kỳ mới.',
    attentionStudentIds: ['s-002', 's-003', 's-004', 's-005'],
    createdDate: '26/09/2026',
  };

  const [generalRemark, setGeneralRemark] = useState(currentReport.generalRemark);
  const [academicSummary, setAcademicSummary] = useState(currentReport.academicSummary);
  const [attendanceSummary, setAttendanceSummary] = useState(currentReport.attendanceSummary);
  const [disciplineSummary, setDisciplineSummary] = useState(currentReport.disciplineSummary);
  const [activities, setActivities] = useState(currentReport.activities);

  const handleSave = () => {
    saveWeeklyReport({
      ...currentReport,
      week: selectedWeekNum,
      generalRemark,
      academicSummary,
      attendanceSummary,
      disciplineSummary,
      activities,
    });
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportWord = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Báo cáo tuần ${selectedWeekNum} - Lớp ${classInfo.className}</title></head>
      <body>
        <h2 style="text-align:center;">TRƯỜNG ${classInfo.school}</h2>
        <h3 style="text-align:center;">BÁO CÁO CÔNG TÁC CHỦ NHIỆM TUẦN ${selectedWeekNum}</h3>
        <p style="text-align:center;">Lớp: ${classInfo.className} - GVCN: ${classInfo.homeroomTeacher} - Năm học: ${classInfo.academicYear}</p>
        <hr/>
        <h4>I. SỐ LIỆU CHUNG</h4>
        <ul>
          <li>Sĩ số: ${students.length} học sinh</li>
          <li>Chuyên cần: 96.2%</li>
          <li>Vi phạm nề nếp: ${behaviors.length} lượt</li>
          <li>Tuyên dương: ${commendations.length} lượt</li>
        </ul>
        <h4>II. NHẬN XÉT CHUNG</h4>
        <p>${generalRemark}</p>
        <h4>III. CHI TIẾT NỘI DUNG</h4>
        <p>${academicSummary}</p>
        <p>${attendanceSummary}</p>
        <p>${disciplineSummary}</p>
        <p>${activities}</p>
        <p style="text-align:right; margin-top:40px;"><b>Giáo viên chủ nhiệm</b><br/>${classInfo.homeroomTeacher}</p>
      </body>
      </html>
    `;

    const blob = new Blob(['\uFEFF' + content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bao_Cao_Tuan_${selectedWeekNum}_Lop_${classInfo.className}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      title: 'Xuất Word thành công',
      message: `Đã tải về tệp báo cáo tuần ${selectedWeekNum}.doc`,
    });
  };

  const handleAISuggestRemark = () => {
    const aiDraft =
      `Tuần này lớp ${classInfo.className} tiếp tục giữ vững phong trào thi đua dạy tốt học tốt. Sĩ số ${students.length} em ổn định, tỷ lệ chuyên cần đạt 96.2%. Trong tuần có ${commendations.length} lượt học sinh được biểu dương vì thành tích học tập và việc tốt (tiêu biểu như Nguyễn Minh Anh, Đỗ Khánh Vy). Tuy nhiên, một số ít học sinh cần phụ huynh phối hợp chặt chẽ hơn về giờ giấc đi học và việc sử dụng thiết bị điện tử. Kế hoạch tuần tới: Tăng cường ôn tập chuẩn bị cho kỳ kiểm tra giữa kỳ I.`;
    setGeneralRemark(aiDraft);
    showToast({
      type: 'info',
      title: 'AI đã tạo nhận xét mẫu',
      message: 'Nội dung nhận xét tổng hợp đã được điền vào khung báo cáo.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#172B4D]">
              BÁO CÁO CÔNG TÁC CHỦ NHIỆM TUẦN
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#1677FF] border border-blue-200">
              Lớp {classInfo.className}
            </span>
          </div>
          <p className="text-xs text-[#6B7A90] mt-0.5">
            Lập báo cáo sinh hoạt cuối tuần gửi Ban giám hiệu và Ban đại diện cha mẹ học sinh
          </p>
        </div>

        {/* Week Selector Dropdown & Export buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedWeekNum}
            onChange={(e) => setSelectedWeekNum(Number(e.target.value))}
            className="bg-[#F3F8FF] text-xs font-bold text-[#1677FF] px-3.5 py-2 rounded-xl border border-blue-200 focus:outline-none cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
              <option key={w} value={w}>
                Tuần {w} (Học kỳ I)
              </option>
            ))}
          </select>

          <button
            onClick={handleExportWord}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-blue-600" />
            Xuất Word
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Xuất PDF / In
          </button>
        </div>
      </div>

      {/* 4 Weekly KPIs (Requirement 15) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase">Sĩ số lớp</div>
          <div className="text-2xl font-extrabold text-[#172B4D] mt-1">{students.length} HS</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase">Chuyên cần</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">96.2%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase">Vi phạm tuần</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {behaviors.filter((b) => b.week === selectedWeekNum).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase">Tuyên dương</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">{commendations.length}</div>
        </div>
      </div>

      {/* Nhận xét chung (Requirement 15) */}
      <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-[#172B4D]">NHẬN XÉT CHUNG CỦA GIÁO VIÊN CHỦ NHIỆM</h2>
            <p className="text-[11px] text-[#6B7A90]">Đánh giá khái quát tuần học thứ {selectedWeekNum}</p>
          </div>
          <button
            onClick={handleAISuggestRemark}
            className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            AI viết nhận xét
          </button>
        </div>

        <textarea
          rows={3}
          value={generalRemark}
          onChange={(e) => setGeneralRemark(e.target.value)}
          className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none leading-relaxed text-slate-800"
          placeholder="Nhập nhận xét chung tuần này..."
        />
      </div>

      {/* 5 Specific Sections (Requirement 15) */}
      <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#172B4D] pb-3 border-b border-slate-100">
          NỘI DUNG CHI TIẾT BÁO CÁO TUẦN {selectedWeekNum}
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">1. Tình hình học tập</label>
          <textarea
            rows={2}
            value={academicSummary}
            onChange={(e) => setAcademicSummary(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none text-slate-700"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">2. Tình hình chuyên cần</label>
          <textarea
            rows={2}
            value={attendanceSummary}
            onChange={(e) => setAttendanceSummary(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none text-slate-700"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">3. Tình hình nề nếp kỷ luật</label>
          <textarea
            rows={2}
            value={disciplineSummary}
            onChange={(e) => setDisciplineSummary(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none text-slate-700"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">4. Hoạt động phong trào nổi bật</label>
          <textarea
            rows={2}
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none text-slate-700"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            5. Danh sách học sinh cần quan tâm tuần này
          </label>
          <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 text-xs text-red-900 flex items-center justify-between">
            <span>
              Phạm Gia Huy (Vắng 3 buổi, Toán giảm); Trần Mai Chi (Nghỉ ốm); Võ Ngọc Bảo (2 vi phạm nề nếp); Lê Minh Khang (ĐTB &lt; 6.0).
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Lưu báo cáo tuần {selectedWeekNum}
          </button>
        </div>
      </div>
    </div>
  );
};
