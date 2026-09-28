import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { X, PhoneCall, PlusCircle } from 'lucide-react';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudentId?: string;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  isOpen,
  onClose,
  defaultStudentId,
}) => {
  const { students, addParentContact } = useClass();

  const [studentId, setStudentId] = useState(defaultStudentId || students[0]?.id || '');
  const [method, setMethod] = useState<'Gọi điện' | 'Gặp trực tiếp' | 'Zalo' | 'Sổ liên lạc điện tử'>('Gọi điện');
  const [content, setContent] = useState('');
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<'Đã hoàn thành' | 'Cần liên hệ lại'>('Đã hoàn thành');
  const [date, setDate] = useState('28/09/2026');

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === studentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    addParentContact({
      studentId,
      studentName: currentStudent.fullName,
      parentName: currentStudent.parentName || 'Phụ huynh',
      parentPhone: currentStudent.parentPhone || '',
      date,
      method,
      content,
      feedback,
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Ghi nhận trao đổi với phụ huynh</h3>
              <p className="text-xs text-slate-500">Lưu nhật ký liên lạc phối hợp giáo dục</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Chọn học sinh</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white font-medium"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.studentCode} - {s.fullName} (PH: {s.parentPhone})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hình thức trao đổi</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white font-medium"
              >
                <option value="Gọi điện">Gọi điện thoại</option>
                <option value="Zalo">Nhắn tin Zalo</option>
                <option value="Gặp trực tiếp">Gặp trực tiếp tại trường</option>
                <option value="Sổ liên lạc điện tử">Sổ liên lạc điện tử</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trạng thái kết quả</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white font-medium"
              >
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Cần liên hệ lại">Cần liên hệ lại</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nội dung GVCN đã trao đổi *</label>
            <textarea
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="VD: Trao đổi tình hình học tập môn Toán, lý do nghỉ học và nhắc nhở ôn thi..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ý kiến phản hồi của phụ huynh</label>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="VD: Phụ huynh ghi nhận, cam kết theo sát giờ học ở nhà của con..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
            />
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
              className="px-5 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Lưu nhật ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
