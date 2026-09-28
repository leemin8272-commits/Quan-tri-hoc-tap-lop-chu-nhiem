import React, { useState, useMemo } from 'react';
import { useClass } from '../../context/ClassContext';
import { Student } from '../../types';
import { StudentModal } from '../modals/StudentModal';
import { ImportExcelModal } from '../modals/ImportExcelModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Search,
  Plus,
  FileSpreadsheet,
  Download,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    viewStudentProfile,
    showToast,
  } = useClass();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Nam' | 'Nữ'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Đang học' | 'Nghỉ phép' | 'Tạm nghỉ'>('all');
  const [squadFilter, setSquadFilter] = useState<number | 'all'>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Delete confirm dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.parentPhone.includes(searchTerm) ||
        s.parentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchGender = genderFilter === 'all' || s.gender === genderFilter;
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchSquad = squadFilter === 'all' || s.squad === squadFilter;

      return matchSearch && matchGender && matchStatus && matchSquad;
    });
  }, [students, searchTerm, genderFilter, statusFilter, squadFilter]);

  // Paginated students
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  // Export CSV/Excel
  const handleExportExcel = () => {
    const header = '\uFEFFSTT,Mã HS,Họ và tên,Giới tính,Ngày sinh,Tên phụ huynh,SĐT phụ huynh,Địa chỉ,Tổ,Trạng thái,Hạnh kiểm\n';
    const rows = filteredStudents
      .map(
        (s, idx) =>
          `"${idx + 1}","${s.studentCode}","${s.fullName}","${s.gender}","${s.birthday}","${s.parentName}","${s.parentPhone}","${s.address.replace(/"/g, '""')}","Tổ ${s.squad}","${s.status}","${s.conduct}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Danh_Sach_Hoc_Sinh_6A4_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      title: 'Xuất dữ liệu thành công',
      message: `Đã xuất ${filteredStudents.length} học sinh ra tệp Excel (.csv UTF-8).`,
    });
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setIsAddEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsAddEditModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteStudent(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Action Buttons */}
      <div className="bg-white rounded-2xl p-5 border border-[#E3ECF8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#172B4D] tracking-tight">
              DANH SÁCH HỌC SINH LỚP 6A4
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#1677FF] border border-blue-200">
              {students.length} học sinh
            </span>
          </div>
          <p className="text-xs text-[#6B7A90] mt-0.5">
            Quản lý hồ sơ, phụ huynh, liên lạc và cập nhật thông tin học sinh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Import Excel
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600" />
            Export Excel
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Thêm học sinh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E3ECF8] shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full lg:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm theo tên, mã, SĐT PH..."
            className="w-full bg-[#F3F8FF] hover:bg-slate-100 text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-[#1677FF] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Gender */}
          <div className="flex items-center gap-1 bg-[#F3F8FF] p-1 rounded-xl text-xs">
            {(['all', 'Nam', 'Nữ'] as const).map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGenderFilter(g);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  genderFilter === g
                    ? 'bg-white text-[#1677FF] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g === 'all' ? 'Tất cả' : g}
              </button>
            ))}
          </div>

          {/* Squad */}
          <select
            value={squadFilter}
            onChange={(e) => {
              setSquadFilter(e.target.value === 'all' ? 'all' : Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-[#F3F8FF] text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả tổ</option>
            <option value={1}>Tổ 1</option>
            <option value={2}>Tổ 2</option>
            <option value={3}>Tổ 3</option>
            <option value={4}>Tổ 4</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-[#F3F8FF] text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Đang học">Đang học</option>
            <option value="Nghỉ phép">Nghỉ phép</option>
            <option value="Tạm nghỉ">Tạm nghỉ</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F3F8FF] text-[#6B7A90] font-bold border-b border-[#E3ECF8]">
                <th className="py-3.5 px-4 text-center w-12">STT</th>
                <th className="py-3.5 px-4">Mã HS</th>
                <th className="py-3.5 px-4">Họ và tên</th>
                <th className="py-3.5 px-4 text-center">Giới tính</th>
                <th className="py-3.5 px-4">Ngày sinh</th>
                <th className="py-3.5 px-4">Tên phụ huynh</th>
                <th className="py-3.5 px-4">Số điện thoại</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3ECF8]">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    Không tìm thấy học sinh nào phù hợp bộ lọc
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((st, index) => {
                  const globalIndex = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                      onClick={() => viewStudentProfile(st.id)}
                    >
                      <td className="py-3 px-4 text-center font-semibold text-slate-400">
                        {globalIndex}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {st.studentCode}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatar}
                            alt={st.fullName}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[#172B4D] group-hover:text-[#1677FF] transition-colors">
                              {st.fullName}
                            </span>
                            <div className="text-[11px] text-slate-400 font-medium">
                              Tổ {st.squad} • {st.conduct}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            st.gender === 'Nam'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {st.gender}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">{st.birthday}</td>

                      <td className="py-3 px-4 text-slate-700 font-medium">{st.parentName}</td>

                      <td className="py-3 px-4 font-mono text-slate-700">{st.parentPhone}</td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            st.status === 'Đang học'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : st.status === 'Nghỉ phép'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div
                          className="flex items-center justify-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => viewStudentProfile(st.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Xem hồ sơ 360°"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(st)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(st.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#E3ECF8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Hiển thị{' '}
            <span className="font-bold text-slate-800">
              {filteredStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, filteredStudents.length)}
            </span>{' '}
            trên <span className="font-bold text-slate-800">{filteredStudents.length}</span> học sinh
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#1677FF] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        initialData={editingStudent}
        onSave={(data) => {
          if (editingStudent) {
            updateStudent(data);
          } else {
            addStudent(data);
          }
        }}
      />

      {/* Import Excel Modal */}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Xác nhận xóa học sinh"
        message="Hành động này sẽ xóa vĩnh viễn thông tin học sinh và các bản ghi điểm số liên quan khỏi hệ thống lớp 6A4."
        confirmLabel="Xóa học sinh"
        cancelLabel="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
