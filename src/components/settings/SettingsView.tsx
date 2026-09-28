import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { UserRole } from '../../types';
import {
  Settings,
  School,
  BookOpen,
  Users,
  Shield,
  Bell,
  RotateCcw,
  Save,
  Check,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    classInfo,
    updateClassInfo,
    subjects,
    students,
    userRole,
    setUserRole,
    resetAllData,
    showToast,
  } = useClass();

  const [activeTab, setActiveTab] = useState<
    'class_info' | 'subjects' | 'roles' | 'alerts' | 'backup'
  >('class_info');

  const [formData, setFormData] = useState({
    className: classInfo.className,
    grade: classInfo.grade,
    school: classInfo.school,
    homeroomTeacher: classInfo.homeroomTeacher,
    academicYear: classInfo.academicYear,
    room: classInfo.room,
  });

  const allAvailableSubjects = [
    'Toán',
    'Ngữ văn',
    'Tiếng Anh',
    'Vật lí',
    'Hóa học',
    'Sinh học',
    'Lịch sử',
    'Địa lí',
    'GDCD',
    'Tin học',
    'Công nghệ',
    'Thể dục',
    'Âm nhạc',
    'Mỹ thuật',
    'Hoạt động trải nghiệm',
  ];

  const handleSaveClassInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateClassInfo(formData);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#172B4D]">
            CÀI ĐẶT HỆ THỐNG & PHÂN QUYỀN
          </h1>
          <p className="text-xs text-[#6B7A90] mt-0.5">
            Cấu hình thông tin lớp học, môn học giảng dạy, phân quyền và ngưỡng cảnh báo tự động
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Vai trò hiện hành:</span>
          <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-[#1677FF] text-white">
            {userRole}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-[#E3ECF8] shadow-xs flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'class_info', name: '1. Thông tin lớp học', icon: <School className="w-4 h-4" /> },
          { id: 'subjects', name: '2. Danh mục môn học', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'roles', name: '3. Người dùng & Phân quyền', icon: <Shield className="w-4 h-4" /> },
          { id: 'alerts', name: '4. Cấu hình cảnh báo', icon: <Bell className="w-4 h-4" /> },
          { id: 'backup', name: '5. Dữ liệu hệ thống', icon: <RotateCcw className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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

      {/* Tab 1: Class Information */}
      {activeTab === 'class_info' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E3ECF8] shadow-xs">
          <h2 className="text-base font-bold text-[#172B4D] mb-4 pb-3 border-b border-slate-100">
            Thông tin đơn vị và lớp chủ nhiệm
          </h2>

          <form onSubmit={handleSaveClassInfo} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên trường</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên lớp học</label>
              <input
                type="text"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Khối lớp</label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Giáo viên chủ nhiệm</label>
              <input
                type="text"
                value={formData.homeroomTeacher}
                onChange={(e) => setFormData({ ...formData, homeroomTeacher: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Năm học</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phòng học</label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1677FF] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Lưu cấu hình lớp học
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Subjects list (Tags) */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E3ECF8] shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#172B4D]">
              Danh mục môn học giảng dạy (Dạng Tag)
            </h2>
            <p className="text-xs text-[#6B7A90]">Các môn học áp dụng tính điểm và đánh giá cho lớp 6A4</p>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-600 mb-2">Các môn đang hoạt động:</div>
            <div className="flex flex-wrap gap-2">
              {allAvailableSubjects.map((subName) => (
                <span
                  key={subName}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#1677FF]" />
                  {subName}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Roles & Permissions (Requirement 19) */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E3ECF8] shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#172B4D]">
              Bảng ma trận phân quyền (Role-Based Access Control)
            </h2>
            <p className="text-xs text-[#6B7A90]">
              Quy định quyền truy cập dữ liệu giữa GVCN, GV Bộ môn, BGH, Phụ huynh và Học sinh
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Vai trò (Role)</th>
                  <th className="py-3 px-4">Mô tả quyền hạn</th>
                  <th className="py-3 px-4 text-center">Xem toàn lớp</th>
                  <th className="py-3 px-4 text-center">Nhập / Sửa điểm</th>
                  <th className="py-3 px-4 text-center">Điểm danh</th>
                  <th className="py-3 px-4 text-center">Báo cáo & AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-bold text-purple-700">ADMIN (BGH)</td>
                  <td className="py-3 px-4 text-slate-600">Toàn quyền quản trị hệ thống và tất cả các khối</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="py-3 px-4 font-bold text-[#1677FF]">GVCN (Lê Ngọc Minh)</td>
                  <td className="py-3 px-4 text-slate-600">Quản lý toàn diện học sinh, điểm danh, nề nếp lớp 6A4</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">GIÁO VIÊN BỘ MÔN</td>
                  <td className="py-3 px-4 text-slate-600">Chỉ được xem học sinh và nhập điểm môn phụ trách</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-3 px-4 text-center text-blue-600 font-bold">Chỉ môn mình</td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">PHỤ HUYNH</td>
                  <td className="py-3 px-4 text-slate-600">Chỉ xem thông tin con mình (Bảo mật RLS)</td>
                  <td className="py-3 px-4 text-center text-slate-300">Chỉ con mình</td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">HỌC SINH</td>
                  <td className="py-3 px-4 text-slate-600">Chỉ xem dữ liệu bản thân</td>
                  <td className="py-3 px-4 text-center text-slate-300">Chỉ bản thân</td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Alert Thresholds (Requirement 20) */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E3ECF8] shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#172B4D]">
              Cấu hình luật cảnh báo tự động (Alert Engine)
            </h2>
            <p className="text-xs text-[#6B7A90]">Hệ thống tự động kích hoạt thông báo khi học sinh vi phạm các ngưỡng</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/50 flex items-center justify-between">
              <div>
                <div className="font-bold text-red-900">Cảnh báo học tập nguy cơ</div>
                <div className="text-slate-600 mt-0.5">Kích hoạt khi Điểm trung bình &lt; 5.0</div>
              </div>
              <span className="font-bold text-red-700 bg-white px-3 py-1 rounded-lg border border-red-200">Bật</span>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-900">Cảnh báo chuyên cần</div>
                <div className="text-slate-600 mt-0.5">Kích hoạt khi học sinh nghỉ học ≥ 3 buổi</div>
              </div>
              <span className="font-bold text-amber-700 bg-white px-3 py-1 rounded-lg border border-amber-200">Bật</span>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-900">Cảnh báo đi trễ & nề nếp</div>
                <div className="text-slate-600 mt-0.5">Kích hoạt khi đi trễ hoặc vi phạm ≥ 2 lần</div>
              </div>
              <span className="font-bold text-amber-700 bg-white px-3 py-1 rounded-lg border border-amber-200">Bật</span>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
              <div>
                <div className="font-bold text-emerald-900">Đánh dấu tiến bộ & Đề xuất khen thưởng</div>
                <div className="text-slate-600 mt-0.5">Kích hoạt khi Điểm TB tăng ≥ 1.0 hoặc ĐTB ≥ 8.5 và chuyên cần 100%</div>
              </div>
              <span className="font-bold text-emerald-700 bg-white px-3 py-1 rounded-lg border border-emerald-200">Bật</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Data Reset */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E3ECF8] shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#172B4D]">Khôi phục dữ liệu mẫu ban đầu</h2>
            <p className="text-xs text-[#6B7A90]">Tải lại 36 học sinh mẫu và lịch sử hoạt động đầy đủ của lớp 6A4</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-slate-800 text-xs sm:text-sm">Làm mới dữ liệu về mặc định</div>
              <div className="text-xs text-slate-500 mt-0.5">Xóa bộ nhớ tạm và nạp lại 36 hồ sơ học sinh chuẩn</div>
            </div>
            <button
              onClick={resetAllData}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              Khôi phục dữ liệu gốc
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
