import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { X, Upload, FileSpreadsheet, Download, CheckCircle2 } from 'lucide-react';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({ isOpen, onClose }) => {
  const { addStudent, showToast } = useClass();
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<any[]>([]);

  if (!isOpen) return null;

  // Mock template download
  const handleDownloadTemplate = () => {
    const csvContent =
      '\uFEFF' + // UTF-8 BOM
      'Mã HS,Họ và tên,Giới tính,Ngày sinh,Họ tên phụ huynh,SĐT phụ huynh,Địa chỉ,Tổ\n' +
      '6A4-037,Nguyễn Hoàng Nam,Nam,15/08/2014,Nguyễn Văn An,0981112233,TX Cai Lậy,1\n' +
      '6A4-038,Trần Ngọc Hà,Nữ,22/11/2014,Trần Thị Mai,0972223344,Huyện Cai Lậy,2\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Mau_Danh_Sach_Hoc_Sinh_6A4.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Generate preview
      setPreviewRows([
        {
          studentCode: '6A4-037',
          fullName: 'Nguyễn Hoàng Nam',
          gender: 'Nam',
          birthday: '15/08/2014',
          parentName: 'Nguyễn Văn An (Bố)',
          parentPhone: '0981 112 233',
          address: 'TX Cai Lậy, Tiền Giang',
          squad: 1,
          status: 'Đang học',
          conduct: 'Tốt',
          avatar:
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
        },
        {
          studentCode: '6A4-038',
          fullName: 'Trần Ngọc Hà',
          gender: 'Nữ',
          birthday: '22/11/2014',
          parentName: 'Trần Thị Mai (Mẹ)',
          parentPhone: '0972 223 344',
          address: 'Huyện Cai Lậy, Tiền Giang',
          squad: 2,
          status: 'Đang học',
          conduct: 'Tốt',
          avatar:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
        },
      ]);
    }
  };

  const handleConfirmImport = () => {
    if (previewRows.length === 0) return;
    previewRows.forEach((row) => addStudent(row));
    showToast({
      type: 'success',
      title: 'Import dữ liệu thành công',
      message: `Đã nạp thành công ${previewRows.length} học sinh từ tệp ${fileName}.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Nhập danh sách học sinh từ Excel / CSV
              </h3>
              <p className="text-xs text-slate-500">Hỗ trợ các định dạng .xlsx, .xls, .csv</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Template Download */}
          <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
            <span className="text-blue-900 font-medium">
              Chưa có định dạng mẫu chuẩn của trường?
            </span>
            <button
              onClick={handleDownloadTemplate}
              className="text-[#1677FF] font-bold hover:underline flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Tải file Excel mẫu (.csv)
            </button>
          </div>

          {/* Upload Area */}
          <label className="border-2 border-dashed border-slate-200 hover:border-[#1677FF] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20">
            <Upload className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-sm font-semibold text-slate-800">
              {fileName ? fileName : 'Kéo thả tệp hoặc bấm vào đây để chọn'}
            </span>
            <span className="text-xs text-slate-400 mt-1">Dung lượng tối đa 10MB</span>
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleSimulateUpload}
              className="hidden"
            />
          </label>

          {/* Preview rows */}
          {previewRows.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Xem trước dữ liệu ({previewRows.length} học sinh)</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hợp lệ
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 text-xs">
                {previewRows.map((r) => (
                  <div key={r.studentCode} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{r.fullName}</span>{' '}
                      <span className="text-slate-400">({r.studentCode})</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">{r.parentPhone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={previewRows.length === 0}
            className="px-5 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            Xác nhận nạp vào hệ thống
          </button>
        </div>
      </div>
    </div>
  );
};
