import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { X, Send, Megaphone } from 'lucide-react';

interface AddAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAnnouncementModal: React.FC<AddAnnouncementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addAnnouncement, students } = useClass();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<
    'Thông báo' | 'Họp phụ huynh' | 'Lịch kiểm tra' | 'Ngoại khóa' | 'Học phí'
  >('Thông báo');
  const [priority, setPriority] = useState<'Bình thường' | 'Quan trọng' | 'Khẩn cấp'>('Quan trọng');
  const [date, setDate] = useState('28/09/2026');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title,
      content,
      type,
      priority,
      date,
      viewedCount: 1,
      confirmedCount: 0,
      totalParents: students.length,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Tạo thông báo mới cho lớp</h3>
              <p className="text-xs text-slate-500">Gửi đến phụ huynh và học sinh qua ứng dụng</p>
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
            <label className="block font-semibold text-slate-700 mb-1">Tiêu đề thông báo *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Nhắc nhở lịch kiểm tra học kỳ I và nộp quỹ khuyến học"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phân loại</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white font-medium"
              >
                <option value="Thông báo">Thông báo chung</option>
                <option value="Họp phụ huynh">Họp phụ huynh</option>
                <option value="Lịch kiểm tra">Lịch kiểm tra</option>
                <option value="Ngoại khóa">Hoạt động ngoại khóa</option>
                <option value="Học phí">Học phí & BHYT</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mức độ ưu tiên</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white font-medium"
              >
                <option value="Bình thường">Bình thường</option>
                <option value="Quan trọng">Quan trọng</option>
                <option value="Khẩn cấp">Khẩn cấp (Cần xác nhận)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nội dung chi tiết *</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung thông báo gửi đến toàn thể phụ huynh..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              required
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
              <Send className="w-4 h-4" />
              Gửi thông báo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
