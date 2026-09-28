import React from 'react';
import { useClass } from '../../context/ClassContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useClass();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
        };

        const bgStyles = {
          success: 'bg-white border-l-4 border-emerald-500 text-slate-800 shadow-lg shadow-emerald-500/10',
          warning: 'bg-white border-l-4 border-amber-500 text-slate-800 shadow-lg shadow-amber-500/10',
          error: 'bg-white border-l-4 border-red-500 text-slate-800 shadow-lg shadow-red-500/10',
          info: 'bg-white border-l-4 border-blue-500 text-slate-800 shadow-lg shadow-blue-500/10',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-slate-100 transition-all duration-300 transform translate-y-0 opacity-100 ${bgStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-sm">
              <div className="font-semibold text-slate-900">{toast.title}</div>
              {toast.message && <div className="text-slate-600 mt-0.5 text-xs leading-relaxed">{toast.message}</div>}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
