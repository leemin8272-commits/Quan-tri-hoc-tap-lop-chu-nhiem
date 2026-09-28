import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { X, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddCommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudentId?: string;
}

export const AddCommendationModal: React.FC<AddCommendationModalProps> = ({
  isOpen,
  onClose,
  defaultStudentId,
}) => {
  const { students, addCommendation } = useClass();

  const [studentId, setStudentId] = useState(defaultStudentId || students[0]?.id || '');
  const [category, setCategory] = useState<
    'Xuất sắc' | 'Tiến bộ vượt bậc' | 'Việc tốt' | 'Hoạt động phong trào' | 'Khác'
  >('Tiến bộ vượt bậc');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [awardType, setAwardType] = useState('Giấy khen tuần & Biểu dương cờ');
  const [date, setDate] = useState('28/09/2026');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    addCommendation({
      studentId,
      studentName: student.fullName,
      date,
      category,
      title: title || `Tuyên dương ${category}`,
      description: description || 'Có thành tích nổi bật và tinh thần học tập gương mẫu.',
      awardType,
    });

    // Confetti celebration effect!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1677FF', '#22C55E', '#F59E0B', '#7C5CFC'],
      });
    } catch (e) {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Thêm khen thưởng & tuyên dương
              </h3>
              <p className="text-xs text-slate-500">Khích lệ học sinh tiến bộ và gương người tốt</p>
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
                  {s.studentCode} - {s.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hạng mục tuyên dương</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white font-medium"
              >
                <option value="Tiến bộ vượt bậc">Tiến bộ vượt bậc</option>
                <option value="Xuất sắc">Học sinh xuất sắc</option>
                <option value="Việc tốt">Việc tốt</option>
                <option value="Hoạt động phong trào">Hoạt động phong trào</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ngày tuyên dương</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tiêu đề tuyên dương *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Tiến bộ vượt bậc môn Toán (+2.0 điểm)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hình thức khen thưởng</label>
            <input
              type="text"
              value={awardType}
              onChange={(e) => setAwardType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              placeholder="Giấy khen, biểu dương cờ, điểm cộng..."
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nội dung chi tiết thành tích</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              placeholder="Mô tả cụ thể nỗ lực và kết quả đạt được..."
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
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Trao khen thưởng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
