import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { X, ShieldAlert, PlusCircle } from 'lucide-react';

interface AddViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudentId?: string;
}

export const AddViolationModal: React.FC<AddViolationModalProps> = ({
  isOpen,
  onClose,
  defaultStudentId,
}) => {
  const { students, addBehavior } = useClass();

  const [studentId, setStudentId] = useState(defaultStudentId || students[0]?.id || '');
  const [violation, setViolation] = useState('Đi học trễ');
  const [customViolation, setCustomViolation] = useState('');
  const [action, setAction] = useState('Nhắc nhở');
  const [status, setStatus] = useState<'Đã xử lý' | 'Chưa xử lý'>('Chưa xử lý');
  const [date, setDate] = useState('28/09/2026');

  if (!isOpen) return null;

  const violationPresets = [
    'Đi học trễ',
    'Không mặc đồng phục',
    'Nói chuyện riêng trong giờ học',
    'Sử dụng điện thoại trong giờ học',
    'Không làm bài tập về nhà',
    'Vi phạm nội quy lớp',
    'Mất trật tự trong giờ tự quản',
    'Khác...',
  ];

  const actionPresets = [
    'Nhắc nhở trước lớp',
    'Ghi sổ đầu bài',
    'Trừ điểm thi đua tuần',
    'Mời phụ huynh trao đổi',
    'Viết bản tự kiểm điểm',
    'Tạm giữ điện thoại trả cuối ngày',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const finalViolation = violation === 'Khác...' ? customViolation : violation;

    addBehavior({
      studentId,
      studentName: student.fullName,
      date,
      violation: finalViolation,
      action,
      status,
      week: 4,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Ghi nhận vi phạm nề nếp</h3>
              <p className="text-xs text-slate-500">Cập nhật hồ sơ rèn luyện học sinh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Chọn học sinh *</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white font-medium"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.studentCode} - {s.fullName} ({s.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ngày vi phạm</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trạng thái xử lý</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white font-medium"
              >
                <option value="Chưa xử lý">Chưa xử lý</option>
                <option value="Đã xử lý">Đã xử lý</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nội dung vi phạm *</label>
            <select
              value={violation}
              onChange={(e) => setViolation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white font-medium"
            >
              {violationPresets.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            {violation === 'Khác...' && (
              <input
                type="text"
                value={customViolation}
                onChange={(e) => setCustomViolation(e.target.value)}
                placeholder="Nhập nội dung vi phạm cụ thể..."
                className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
                required
              />
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hình thức xử lý</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white font-medium"
            >
              {actionPresets.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Lưu vi phạm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
