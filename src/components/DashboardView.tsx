import React, { useMemo, useState, useEffect } from 'react';
import { Profile, SubmissionItem } from '../types';
import {
  Calendar,
  Clock,
  Upload,
  CheckCircle2,
  Award,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquareQuote,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateToUpload: () => void;
  onNavigateToEvaluation: (submissionId: string) => void;
  onNavigateToReceipt: (submissionId: string) => void;
  submissions: SubmissionItem[];
  profile: Profile;
}

const PAGE_SIZE = 8;

function formatFullDateID(date: Date): string {
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateTimeID(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToUpload,
  onNavigateToEvaluation,
  onNavigateToReceipt,
  submissions,
  profile,
}) => {
  const [activeTableTab, setActiveTableTab] = useState<'all' | 'waiting' | 'graded'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const waitingSubmissions = useMemo(() => submissions.filter((s) => s.status === 'menunggu-nilai'), [submissions]);
  const gradedSubmissions = useMemo(() => submissions.filter((s) => s.status === 'dinilai'), [submissions]);

  const avgScore = useMemo(() => {
    if (gradedSubmissions.length === 0) return null;
    const total = gradedSubmissions.reduce((sum, s) => sum + (s.score ?? 0), 0);
    return total / gradedSubmissions.length;
  }, [gradedSubmissions]);

  const filteredSubmissions = useMemo(() => {
    if (activeTableTab === 'waiting') return waitingSubmissions;
    if (activeTableTab === 'graded') return gradedSubmissions;
    return submissions;
  }, [activeTableTab, waitingSubmissions, gradedSubmissions, submissions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTableTab]);

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / PAGE_SIZE));
  const pageClamped = Math.min(currentPage, totalPages);
  const pagedSubmissions = filteredSubmissions.slice((pageClamped - 1) * PAGE_SIZE, pageClamped * PAGE_SIZE);

  const recentGraded = useMemo(() => gradedSubmissions.slice(0, 3), [gradedSubmissions]);

  const today = new Date();

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* TOP BANNER */}
      <section
        id="hero-banner"
        className="relative overflow-hidden rounded-2xl bg-[#eff4ff] p-6 sm:p-8 shadow-xs border border-indigo-100/70"
      >
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#3525cd]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2dfff] text-[#0f0069] text-xs font-bold">
                <Calendar className="w-3.5 h-3.5" />
                {formatFullDateID(today)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0b1c30] tracking-tight mt-1">
              Halo, {profile.name}!
            </h1>
            <p className="text-sm sm:text-base text-[#464555] leading-relaxed">
              Kamu sudah mengunggah <strong className="text-[#0b1c30] font-bold">{submissions.length} tugas</strong> secara mandiri.
            </p>
          </div>

          <button
            onClick={onNavigateToUpload}
            className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Unggah Tugas Baru</span>
          </button>
        </div>
      </section>

      {/* METRIC KPI STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTableTab('waiting')}
          className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100/80 flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464555]">Menunggu Penilaian</span>
            <span className="w-8 h-8 rounded-xl bg-[#d3e4fe] text-[#3525cd] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#3525cd]" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30]">{waitingSubmissions.length}</span>
            <span className="text-xs text-[#464555]">berkas terkirim</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTableTab('graded')}
          className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100/80 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464555]">Selesai &amp; Dinilai</span>
            <span className="w-8 h-8 rounded-xl bg-[#6ffbbe]/70 text-[#002113] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30]">{gradedSubmissions.length}</span>
            <span className="text-xs text-[#464555]">total tugas tuntas</span>
          </div>
        </div>

        <div
          onClick={() => gradedSubmissions[0] && onNavigateToEvaluation(gradedSubmissions[0].id)}
          className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100/80 flex flex-col justify-between hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464555]">Rata-rata Nilai</span>
            <span className="w-8 h-8 rounded-xl bg-[#e2dfff] text-[#0f0069] flex items-center justify-center">
              <Award className="w-4 h-4 text-[#3525cd]" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-[#3525cd]">
              {avgScore !== null ? avgScore.toFixed(1) : '-'}
            </span>
            <span className="text-xs text-[#464555]">/ 100</span>
          </div>
        </div>
      </section>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          {/* TABEL DAFTAR TUGAS */}
          <div className="flex flex-col gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#0b1c30]">Riwayat Tugas yang Diunggah</h2>
                <p className="text-xs text-[#464555]">Semua tugas mandiri yang pernah kamu kirim</p>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTableTab('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
                    activeTableTab === 'all' ? 'bg-[#3525cd] text-white shadow-xs' : 'bg-[#eff4ff] text-[#464555] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span>Semua Tugas</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTableTab === 'all' ? 'bg-white/20' : 'bg-indigo-100 text-[#3525cd]'}`}>
                    {submissions.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTableTab('waiting')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
                    activeTableTab === 'waiting' ? 'bg-[#3525cd] text-white shadow-xs' : 'bg-[#eff4ff] text-[#464555] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span>Menunggu Nilai</span>
                  <span className="text-[10px] font-bold">{waitingSubmissions.length}</span>
                </button>

                <button
                  onClick={() => setActiveTableTab('graded')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
                    activeTableTab === 'graded' ? 'bg-[#006c49] text-white shadow-xs' : 'bg-[#eff4ff] text-[#464555] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />
                  <span>Sudah Dinilai</span>
                  <span className="text-[10px] font-bold">{gradedSubmissions.length}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[560px]">
                <thead>
                  <tr className="bg-[#eff4ff] text-[#464555] text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3 rounded-l-xl">Judul Tugas</th>
                    <th className="py-3 px-3">Dikirim</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 rounded-r-xl text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50/70 text-xs">
                  {pagedSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-[#464555]">
                        {submissions.length === 0
                          ? 'Belum ada tugas yang diunggah. Klik "Unggah Tugas Baru" untuk mulai.'
                          : 'Tidak ada tugas pada kategori ini.'}
                      </td>
                    </tr>
                  )}
                  {pagedSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-[#0b1c30]">{submission.title}</span>
                          <span className="text-xs text-[#464555] mt-0.5">{submission.courseName}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-bold flex items-center gap-1 text-[#0b1c30]">
                          <Calendar className="w-3 h-3 text-[#777587]" />
                          {formatDateTimeID(submission.submittedAt)}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {submission.status === 'menunggu-nilai' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff4ff] text-[#3525cd] text-[11px] font-bold">
                            <Clock className="w-3 h-3 text-[#3525cd]" />
                            Menunggu Nilai
                          </span>
                        )}
                        {submission.status === 'dinilai' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6ffbbe]/60 text-[#002113] text-[11px] font-extrabold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#006c49]" />
                            Nilai: {submission.score}/{submission.maxScore}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        {submission.status === 'menunggu-nilai' && (
                          <button
                            onClick={() => onNavigateToReceipt(submission.id)}
                            className="p-2 text-[#464555] hover:text-[#3525cd] rounded-lg hover:bg-[#eff4ff] transition-colors"
                            title="Lihat Bukti Pengiriman"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {submission.status === 'dinilai' && (
                          <button
                            onClick={() => onNavigateToEvaluation(submission.id)}
                            className="px-3 py-1.5 bg-[#eff4ff] text-[#3525cd] rounded-xl text-xs font-bold hover:bg-[#dce9ff] transition-all inline-flex items-center gap-1 active:scale-95"
                          >
                            <span>Lihat Nilai</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2 text-[#464555] text-xs">
              <span>
                Menampilkan {pagedSubmissions.length} dari {filteredSubmissions.length} tugas
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={pageClamped === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-lg hover:bg-[#eff4ff] disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#3525cd] text-white">
                  {pageClamped} / {totalPages}
                </span>
                <button
                  disabled={pageClamped === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-lg hover:bg-[#eff4ff] disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-6 min-w-0">
          <div className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-[#006c49]" />
                <h3 className="text-sm font-bold text-[#0b1c30]">Nilai Terbaru</h3>
              </div>
              {recentGraded.length > 0 && (
                <button
                  onClick={() => onNavigateToEvaluation(recentGraded[0].id)}
                  className="text-xs text-[#3525cd] hover:underline font-bold"
                >
                  Semua
                </button>
              )}
            </div>

            {recentGraded.length === 0 ? (
              <p className="text-xs text-[#464555]">Belum ada tugas yang dinilai.</p>
            ) : (
              recentGraded.map((submission) => (
                <div key={submission.id} className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#3525cd] font-bold">{submission.courseName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[#6ffbbe] text-[#002113] font-black">
                      {submission.score}/{submission.maxScore}
                    </span>
                  </div>
                  <span className="text-xs text-[#0b1c30] font-semibold">{submission.title}</span>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-[#464555]">
                    <span>{submission.reviewedByName ?? 'Dosen'}</span>
                    <span>{submission.reviewedAt ? formatDateTimeID(submission.reviewedAt) : ''}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-5 bg-gradient-to-br from-[#4f46e5] to-[#3525cd] rounded-2xl text-white flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold">Sekali Kirim, Final</span>
              <span className="text-[11px] text-[#dad7ff] leading-snug mt-0.5">
                Tugas yang sudah dinilai tidak dapat direvisi. Pastikan berkas benar sebelum mengirim.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};