import React, { useState, useMemo } from 'react';
import { useClass } from '../../context/ClassContext';
import { AddCommendationModal } from '../modals/AddCommendationModal';
import {
  Award,
  Plus,
  Sparkles,
  Trophy,
  Medal,
  Heart,
  TrendingUp,
  Star,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CommendationView: React.FC = () => {
  const { commendations, students, viewStudentProfile } = useClass();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tất cả danh mục' },
    { id: 'Tiến bộ vượt bậc', name: 'Tiến bộ vượt bậc' },
    { id: 'Xuất sắc', name: 'Học sinh xuất sắc' },
    { id: 'Việc tốt', name: 'Việc tốt - Người tốt' },
    { id: 'Hoạt động phong trào', name: 'Hoạt động phong trào' },
  ];

  const filteredCommendations = useMemo(() => {
    if (selectedCategory === 'all') return commendations;
    return commendations.filter((c) => c.category === selectedCategory);
  }, [commendations, selectedCategory]);

  const triggerCelebrate = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (e) {
      // ignore
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Xuất sắc':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'Tiến bộ vượt bậc':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'Việc tốt':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Hoạt động phong trào':
        return <Star className="w-5 h-5 text-purple-500" />;
      default:
        return <Medal className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Xuất sắc':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Tiến bộ vượt bậc':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Việc tốt':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Hoạt động phong trào':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#172B4D] tracking-tight">
              BẢNG VÀNG TUYÊN DƯƠNG HỌC SINH
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {commendations.length} thành tích
            </span>
          </div>
          <p className="text-xs text-[#6B7A90] mt-0.5">
            Ghi nhận và tôn vinh những tấm gương nỗ lực vươn lên, làm việc tốt và đạt thành tích cao
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={triggerCelebrate}
            className="px-3.5 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Hiệu ứng chúc mừng 🎉
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Tuyên dương học sinh
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              selectedCategory === cat.id
                ? 'bg-[#1677FF] text-white border-[#1677FF] shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Commendation Cards Grid (Requirement 12) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCommendations.map((cmd) => {
          const student = students.find((s) => s.id === cmd.studentId);
          const avatar =
            student?.avatar ||
            'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80';

          return (
            <div
              key={cmd.id}
              onClick={() => viewStudentProfile(cmd.studentId)}
              className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              {/* Subtle decorative background glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent -mr-6 -mt-6 rounded-full pointer-events-none" />

              <div>
                {/* Header row: Category Badge & Trophy Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getCategoryBadgeClass(
                      cmd.category
                    )}`}
                  >
                    {getCategoryIcon(cmd.category)}
                    {cmd.category}
                  </span>

                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {cmd.date}
                  </span>
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={avatar}
                    alt={cmd.studentName}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-400/60 shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-[#172B4D] group-hover:text-[#1677FF] transition-colors">
                      {cmd.studentName}
                    </h3>
                    <div className="text-xs text-slate-400 font-medium">
                      Lớp 6A4 • Mã HS: {student?.studentCode || '6A4-001'}
                    </div>
                  </div>
                </div>

                {/* Commendation Title & Description */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 my-2">
                  <div className="font-bold text-xs text-slate-800 mb-1 flex items-center gap-1.5">
                    <Medal className="w-4 h-4 text-amber-500 shrink-0" />
                    {cmd.title}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {cmd.description}
                  </p>
                </div>
              </div>

              {/* Award Type Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {cmd.awardType}
                </span>
                <span className="font-semibold text-[#1677FF] group-hover:underline">
                  Xem học bạ →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <AddCommendationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
