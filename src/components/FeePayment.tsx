import React, { useState, useEffect } from 'react';
import { Upload, Download, Check, X, CreditCard, QrCode, Building2 } from 'lucide-react';
import { Student, Receipt } from '../types';
import { studentApi, feeApi } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface FeePaymentProps {
  selectedRoll: string;
  onSelectStudentByRoll: (roll: string) => void;
  onExportCsv: () => void;
  onUploadCsv: () => void;
}

export const FeePayment: React.FC<FeePaymentProps> = ({
  selectedRoll,
  onSelectStudentByRoll,
  onExportCsv,
  onUploadCsv,
}) => {
  const { accentStyles } = useTheme();

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  // Pay Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFeeType, setModalFeeType] = useState<'college' | 'exam'>('exam');
  const [amount, setAmount] = useState(2500);
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await studentApi.getAll();
        setAllStudents(list);
        const current = list.find((s) => s.rollNumber === selectedRoll) || list[0];
        if (current) setStudent(current);

        const recs = await feeApi.getReceipts(selectedRoll);
        setReceipts(recs);
      } catch (err) {
        console.error('Failed to load fee details', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedRoll]);

  const handleStudentChange = (roll: string) => {
    onSelectStudentByRoll(roll);
    const found = allStudents.find((s) => s.rollNumber === roll);
    if (found) setStudent(found);
    feeApi.getReceipts(roll).then(setReceipts).catch(() => {});
  };

  const handleOpenPayModal = (type: 'college' | 'exam') => {
    if (!student) return;
    setModalFeeType(type);
    const due = type === 'college'
      ? student.collegeFeeTotal - student.collegeFeePaid
      : student.examFeeTotal - student.examFeePaid;
    setAmount(due > 0 ? due : (type === 'college' ? 85000 : 2500));
    setIsModalOpen(true);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    setPaying(true);
    try {
      const res = await feeApi.pay({
        rollNumber: student.rollNumber,
        feeType: modalFeeType,
        amount,
        method,
      });

      setStudent(res.student);
      setReceipts((prev) => [res.receipt, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Payment failed', err);
    } finally {
      setPaying(false);
    }
  };

  if (!student && !loading) return null;

  const collegePaid = student ? student.collegeFeePaid >= student.collegeFeeTotal : true;
  const examPaid = student ? student.examFeePaid >= student.examFeeTotal : false;

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      {/* Top Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onUploadCsv}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm transition-colors"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload Student CSV</span>
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Fee Payment
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Pay college and exam fees (demo payments).
        </p>

        {/* Student Selector Dropdown (Matching Video 01:34) */}
        <div className="mt-4">
          <select
            value={student?.rollNumber || ''}
            onChange={(e) => handleStudentChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none cursor-pointer"
          >
            {allStudents.map((s) => (
              <option key={s.rollNumber} value={s.rollNumber}>
                {s.name} ({s.rollNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {student && (
        <div className="space-y-4">
          {/* Card 1: College Fee (Matching Video 01:35) */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                College Fee
              </h2>
              {collegePaid ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-bold px-2.5 py-0.5">
                  Paid ✓
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 text-xs font-bold px-2.5 py-0.5">
                  Due ₹{(student.collegeFeeTotal - student.collegeFeePaid).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Paid ₹{student.collegeFeePaid.toLocaleString('en-IN')} of ₹{student.collegeFeeTotal.toLocaleString('en-IN')}
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${accentStyles.gradient}`}
                style={{ width: `${Math.min(100, (student.collegeFeePaid / student.collegeFeeTotal) * 100)}%` }}
              />
            </div>

            <button
              onClick={() => handleOpenPayModal('college')}
              disabled={collegePaid}
              className={`w-full py-3 rounded-xl text-xs font-bold shadow-md transition-all ${
                collegePaid
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : `${accentStyles.gradient} hover:opacity-95`
              }`}
            >
              Pay College Fee
            </button>
          </div>

          {/* Card 2: Exam Fee (Matching Video 01:35) */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Exam Fee
              </h2>
              {examPaid ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-bold px-2.5 py-0.5">
                  Paid ✓
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 text-xs font-bold px-2.5 py-0.5">
                  Due ₹{(student.examFeeTotal - student.examFeePaid).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Paid ₹{student.examFeePaid.toLocaleString('en-IN')} of ₹{student.examFeeTotal.toLocaleString('en-IN')}
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${accentStyles.gradient}`}
                style={{ width: `${Math.min(100, (student.examFeePaid / student.examFeeTotal) * 100)}%` }}
              />
            </div>

            <button
              onClick={() => handleOpenPayModal('exam')}
              disabled={examPaid}
              className={`w-full py-3 rounded-xl text-xs font-bold shadow-md transition-all ${
                examPaid
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : `${accentStyles.gradient} hover:opacity-95`
              }`}
            >
              Pay Exam Fee
            </button>
          </div>

          {/* Section: Receipts (Matching Video 01:35) */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🧾</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Receipts
              </h3>
            </div>

            {receipts.length === 0 ? (
              <div className="py-4 text-xs text-slate-400 dark:text-slate-500 font-medium">
                No payments yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {receipts.map((rec) => (
                  <div key={rec.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {rec.feeType} · ₹{rec.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {rec.receiptNumber} · {rec.method} · {rec.date}
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 text-[10px]">
                      {rec.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pay Fee Modal (Matching Video 01:36) */}
      {isModalOpen && student && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Pay {modalFeeType === 'college' ? 'College Fee' : 'Exam Fee'}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                  {student.name} · {student.rollNumber} · Due ₹{amount.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Method Toggle Buttons (Matching Video 01:36) */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                  Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('UPI')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      method === 'UPI'
                        ? `${accentStyles.gradient} shadow-sm`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('Card')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      method === 'Card'
                        ? `${accentStyles.gradient} shadow-sm`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('NetBanking')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      method === 'NetBanking'
                        ? `${accentStyles.gradient} shadow-sm`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    NetBanking
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={paying}
                className={`w-full py-3 rounded-xl text-xs font-bold shadow-md transition-all ${accentStyles.gradient} hover:opacity-95`}
              >
                {paying ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
