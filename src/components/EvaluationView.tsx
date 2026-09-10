import React from 'react';
import { SubmissionItem } from '../types';
import {
  ArrowLeft,
  Printer,
  Award,
  CheckCircle2,
  MessageSquare,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

interface EvaluationViewProps {
  onBackToDashboard: () => void;
  onOpenMessageModal: () => void;
  submission: SubmissionItem | null;
  history: SubmissionItem[];
}

function formatDateID(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function gradeColor(grade: string | null): string {
  switch (grade) {
    case 'A':
      return 'text-[#006c49]';
    case 'B':
      return 'text-[#3525cd]';
    case 'C':
      return 'text-[#885500]';
    default:
      return 'text-[#ba1a1a]';
  }
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  onBackToDashboard,
  onOpenMessageModal,
  submission,
  history,
}) => {
  if (!submission) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 text-sm text-[#464555] text-center">
        Belum ada tugas yang dinilai dosen.
      </div>
    );
  }

  const handlePrint = () => window.print();
  const percentage = submission.maxScore > 0 ? ((submission.score ?? 0) / submission.maxScore) * 100 : 0;

  return (
    <div className="flex flex-col w-full gap-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Breadcrumbs & Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#464555]">
          <button
            onClick={onBackToDashboard}
            className="hover:text-[#3525cd] flex items-center gap-1 font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <span>›</span>
          <span className="font-bold text-[#0b1c30]">Nilai &amp; Feedback: {submission.title}</span>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-indigo-100 hover:bg-[#eff4ff] text-[#0b1c30] text-xs font-bold transition-all shadow-2xs active:scale-95"
        >
          <Printer className="w-3.5 h-3.5 text-[#3525cd]" />
          <span>Cetak</span>
        </button>
      </div>

      {/* HERO SCORE SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 sm:p-8 bg-white rounded-2xl shadow-xs border border-indigo-100">
        <div className="md:col-span-7 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6ffbbe]/70 text-[#002113] text-xs font-extrabold w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#006c49]" />
              Selesai Dinilai • {submission.reviewedAt ? formatDateID(submission.reviewedAt) : '-'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] tracking-tight mt-1">{submission.title}</h1>
            <p className="text-xs text-[#464555]">{submission.courseName}</p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-black text-[#3525cd] tracking-tight">{submission.score}</span>
            <span className="text-xl font-bold text-[#777587]">/ {submission.maxScore}</span>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col justify-center items-center p-5 bg-[#eff4ff] rounded-2xl gap-2">
          <span className="text-[11px] font-bold text-[#464555] uppercase tracking-wider">Predikat Akhir</span>
          <span className={`text-4xl font-black ${gradeColor(submission.grade)}`}>Grade {submission.grade ?? '-'}</span>
          <span className="text-xs text-[#464555]">{percentage.toFixed(1)}% dari nilai maksimal</span>
        </div>
      </section>

      {/* FEEDBACK CARD */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-6 bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#3525cd]" />
                <h3 className="text-sm font-bold text-[#0b1c30]">Feedback Dosen</h3>
              </div>
              <span className="text-xs text-[#464555]">{submission.reviewedByName ?? 'Dosen'}</span>
            </div>

            {submission.lecturerFeedback ? (
              <p className="text-xs text-[#0b1c30] leading-relaxed bg-[#eff4ff] p-4 rounded-xl whitespace-pre-line">
                {submission.lecturerFeedback}
              </p>
            ) : (
              <p className="text-xs text-[#464555] italic">Dosen belum menuliskan catatan tambahan untuk tugas ini.</p>
            )}

            <button
              id="btn-message-lecturer"
              onClick={onOpenMessageModal}
              className="w-full mt-1 py-2 px-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#3525cd] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Tanya Lebih Lanjut ke Dosen</span>
            </button>
          </div>

          {submission.githubUrl && (
            <div className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#0b1c30]">Repositori yang dinilai</span>
              <a
                href={submission.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#3525cd] hover:underline flex items-center gap-1"
              >
                Buka <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* RIGHT: Statistik ringkas */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 bg-gradient-to-br from-[#4f46e5] to-[#3525cd] rounded-2xl text-white flex flex-col gap-2">
            <Award className="w-6 h-6" />
            <span className="text-xs font-bold">Berkas</span>
            <span className="text-sm font-semibold truncate">{submission.fileName}</span>
            <span className="text-[11px] text-[#dad7ff]">{submission.fileSize}</span>
          </div>
        </div>
      </section>

      {/* HISTORY TRAJECTORY */}
      {history.length > 1 && (
        <section className="p-6 bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#0b1c30]">Riwayat Nilai Tugas Lainnya</h2>
              <p className="text-xs text-[#464555]">Semua tugas yang sudah dinilai dosen</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#006c49] font-bold bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span>{history.length} tugas dinilai</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {history.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl flex flex-col justify-between gap-2 border ${
                  item.id === submission.id
                    ? 'bg-gradient-to-br from-[#eff4ff] to-[#dce9ff] border-2 border-[#3525cd]/40 shadow-xs'
                    : 'bg-[#eff4ff] border-indigo-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#464555] truncate">{item.title}</span>
                  <span className="px-2 py-0.5 rounded bg-white text-[11px] font-bold text-[#0b1c30] flex-shrink-0">
                    {item.reviewedAt ? formatDateID(item.reviewedAt) : '-'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-2 border-t border-indigo-100/60">
                  <span className="text-2xl font-black text-[#0b1c30]">{item.score}</span>
                  <span className={`text-xs font-extrabold ${gradeColor(item.grade)}`}>Grade {item.grade ?? '-'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};