import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: any) => void;
  initialData?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    studentCode: '',
    fullName: '',
    gender: 'Nam' as 'Nam' | 'Nữ',
    birthday: '',
    avatar: '',
    parentName: '',
    parentPhone: '',
    address: '',
    squad: 1,
    status: 'Đang học' as 'Đang học' | 'Nghỉ phép' | 'Tạm nghỉ',
    conduct: 'Tốt' as 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentCode: initialData.studentCode,
        fullName: initialData.fullName,
        gender: initialData.gender,
        birthday: initialData.birthday,
        avatar: initialData.avatar,
        parentName: initialData.parentName,
        parentPhone: initialData.parentPhone,
        address: initialData.address,
        squad: initialData.squad,
        status: initialData.status,
        conduct: initialData.conduct,
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        studentCode: `6A4-${Math.floor(100 + Math.random() * 900)}`,
        fullName: '',
        gender: 'Nam',
        birthday: '15/05/2014',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
        parentName: '',
        parentPhone: '',
        address: 'Cai Lậy, Tiền Giang',
        squad: 1,
        status: 'Đang học',
        conduct: 'Tốt',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Vui lòng nhập họ và tên học sinh';
    if (!formData.studentCode.trim()) errs.studentCode = 'Vui lòng nhập mã học sinh';
    if (!formData.parentPhone.trim()) errs.parentPhone = 'Vui lòng nhập số điện thoại phụ huynh';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && initialData) {
      onSave({ ...initialData, ...formData });
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1677FF] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? 'Chỉnh sửa thông tin học sinh' : 'Thêm học sinh mới vào lớp 6A4'}
              </h2>
              <p className="text-xs text-slate-500">
                Nhập đầy đủ thông tin cá nhân và liên hệ phụ huynh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mã học sinh *</label>
              <input
                type="text"
                value={formData.studentCode}
                onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
                placeholder="6A4-001"
              />
              {errors.studentCode && (
                <p className="text-red-500 text-xs mt-1">{errors.studentCode}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Họ và tên *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
                placeholder="Nguyễn Văn A"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Giới tính</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ngày sinh</label>
              <input
                type="text"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
                placeholder="DD/MM/YYYY"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tổ học tập</label>
              <select
                value={formData.squad}
                onChange={(e) => setFormData({ ...formData, squad: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white"
              >
                <option value={1}>Tổ 1</option>
                <option value={2}>Tổ 2</option>
                <option value={3}>Tổ 3</option>
                <option value={4}>Tổ 4</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trạng thái học tập</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none bg-white"
              >
                <option value="Đang học">Đang học</option>
                <option value="Nghỉ phép">Nghỉ phép</option>
                <option value="Tạm nghỉ">Tạm nghỉ</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Họ tên phụ huynh</label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
                placeholder="Nguyễn Văn B (Bố)"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số điện thoại PH *</label>
              <input
                type="text"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
                placeholder="0987 123 456"
              />
              {errors.parentPhone && (
                <p className="text-red-500 text-xs mt-1">{errors.parentPhone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Địa chỉ thường trú</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              placeholder="Ấp/Khu phố, Xã/Phường, Huyện/TX..."
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ghi chú đặc biệt của GVCN</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none"
              placeholder="Hoàn cảnh gia đình, sở trường, vấn đề sức khỏe cần lưu ý..."
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-[#1677FF] hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'Lưu thay đổi' : 'Thêm học sinh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
