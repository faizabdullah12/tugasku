import React, { useMemo, useState } from 'react';
import { DosenDashboardData, DosenSubmissionRow, gradeSubmission, getFileSignedUrl } from '../lib/data';
import {
  LogOut,
  FileCheck,
  Clock,
  Download,
  ExternalLink,
  Award,
  Users,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DosenDashboardViewProps {
  dosenData: DosenDashboardData;
  onLogout: () => void;
  onRefresh: () => void;
}

function formatDateTimeID(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
}

export const DosenDashboardView: React.FC<DosenDashboardViewProps> = ({ dosenData, onLogout, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'menunggu-nilai' | 'dinilai'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [scoreInput, setScoreInput] = useState<Record<string, string>>({});
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileLoadingId, setFileLoadingId] = useState<string | null>(null);

  const waiting = useMemo(() => dosenData.submissions.filter((s) => s.status === 'menunggu-nilai'), [dosenData.submissions]);
  const graded = useMemo(() => dosenData.submissions.filter((s) => s.status === 'dinilai'), [dosenData.submissions]);
  const avgScore = useMemo(() => {
    if (graded.length === 0) return null;
    return graded.reduce((sum, s) => sum + (s.score ?? 0), 0) / graded.length;
  }, [graded]);

  const filteredSubmissions = useMemo(() => {
    if (filterStatus === 'all') return dosenData.submissions;
    return dosenData.submissions.filter((s) => s.status === filterStatus);
  }, [dosenData.submissions, filterStatus]);

  const toggleExpand = (row: DosenSubmissionRow) => {
    setErrorMsg(null);
    setExpandedId((prev) => (prev === row.id ? null : row.id));
    if (!(row.id in scoreInput)) {
      setScoreInput((prev) => ({ ...prev, [row.id]: row.score != null ? String(row.score) : '' }));
    }
    if (!(row.id in feedbackInput)) {
      setFeedbackInput((prev) => ({ ...prev, [row.id]: row.lecturerFeedback ?? '' }));
    }
  };

  const handleOpenFile = async (filePath: string, rowId: string) => {
    setFileLoadingId(rowId);
    const url = await getFileSignedUrl(filePath);
    setFileLoadingId(null);
    if (!url) {
      setErrorMsg('Gagal membuka berkas. Coba lagi.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSaveScore = async (row: DosenSubmissionRow) => {
    setErrorMsg(null);
    const rawScore = scoreInput[row.id];
    const score = Number(rawScore);
    if (!rawScore || isNaN(score) || score < 0 || score > 100) {
      setErrorMsg('Masukkan nilai antara 0 - 100.');
      return;
    }
    setSavingId(row.id);
    try {
      await gradeSubmission({
        submissionId: row.id,
        dosenId: dosenData.profile.id,
        score,
        maxScore: 100,
        feedback: feedbackInput[row.id] ?? '',
      });
      setExpandedId(null);
      onRefresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menyimpan nilai.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] px-4 sm:px-8 py-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#0b1c30]">Dashboard Dosen</h1>
            <p className="text-sm text-[#464555]">Halo, {dosenData.profile.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-sm font-semibold text-rose-600 hover:underline"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#d3e4fe] text-[#3525cd] flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-[#0b1c30]">{waiting.length}</span>
              <span className="text-xs text-[#464555]">Menunggu dinilai</span>
            </div>
          </div>
          <div className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#6ffbbe]/70 text-[#002113] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-[#0b1c30]">{graded.length}</span>
              <span className="text-xs text-[#464555]">Sudah dinilai</span>
            </div>
          </div>
          <div className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#e2dfff] text-[#0f0069] flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-[#3525cd]">{avgScore !== null ? avgScore.toFixed(1) : '-'}</span>
              <span className="text-xs text-[#464555]">Rata-rata nilai</span>
            </div>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="flex items-center gap-2">
          {(['all', 'menunggu-nilai', 'dinilai'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterStatus === tab ? 'bg-[#3525cd] text-white shadow-xs' : 'bg-white border border-indigo-100 text-[#464555] hover:bg-[#eff4ff]'
              }`}
            >
              {tab === 'all' ? `Semua (${dosenData.submissions.length})` : tab === 'menunggu-nilai' ? `Menunggu Nilai (${waiting.length})` : `Sudah Dinilai (${graded.length})`}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
            {errorMsg}
          </div>
        )}

        {/* SUBMISSION LIST */}
        <div className="flex flex-col gap-3">
          {filteredSubmissions.length === 0 && (
            <div className="p-8 bg-white rounded-2xl shadow-xs border border-indigo-100 text-center text-sm text-[#464555] flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-[#777587]" />
              Belum ada tugas yang masuk pada kategori ini.
            </div>
          )}

          {filteredSubmissions.map((row) => {
            const isExpanded = expandedId === row.id;
            return (
              <div key={row.id} className="bg-white rounded-2xl shadow-xs border border-indigo-100 overflow-hidden">
                <button
                  onClick={() => toggleExpand(row)}
                  className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-[#eff4ff]/50 transition-colors"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#0b1c30]">{row.title}</span>
                      <span className="text-[11px] text-[#777587]">{row.studentName} ({row.studentNim})</span>
                    </div>
                    <span className="text-xs text-[#464555] mt-0.5">
                      {row.courseName} • Dikirim {formatDateTimeID(row.submittedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        row.status === 'dinilai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {row.status === 'dinilai' ? <FileCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {row.status === 'dinilai' ? `${row.score}/${row.maxScore}` : 'Menunggu'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#777587]" /> : <ChevronDown className="w-4 h-4 text-[#777587]" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-indigo-50 flex flex-col gap-4 bg-[#f8f9ff]">
                    {row.description && (
                      <div>
                        <span className="text-[11px] font-bold text-[#464555] uppercase block mb-1">Deskripsi</span>
                        <p className="text-xs text-[#0b1c30] leading-relaxed whitespace-pre-line">{row.description}</p>
                      </div>
                    )}

                    {row.notes && (
                      <div>
                        <span className="text-[11px] font-bold text-[#464555] uppercase block mb-1">Catatan Mahasiswa</span>
                        <p className="text-xs text-[#0b1c30] leading-relaxed whitespace-pre-line">{row.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenFile(row.filePath, row.id)}
                        disabled={fileLoadingId === row.id}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold transition-all disabled:opacity-60"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {fileLoadingId === row.id ? 'Membuka...' : `Lihat Berkas (${row.fileName})`}
                      </button>

                      {row.githubUrl && (
                        <a
                          href={row.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#3525cd] text-xs font-bold transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Buka Repositori
                        </a>
                      )}
                    </div>

                    {row.status === 'dinilai' ? (
                      <div className="p-3.5 bg-white rounded-xl border border-indigo-100 text-xs text-[#464555]">
                        <span className="font-bold text-[#0b1c30] block mb-1">
                          Sudah dinilai: {row.score}/{row.maxScore} (Grade {row.grade})
                        </span>
                        {row.lecturerFeedback && <p className="leading-relaxed whitespace-pre-line">{row.lecturerFeedback}</p>}
                        <span className="text-[11px] text-[#777587] block mt-1">
                          Tugas yang sudah dinilai tidak dapat diubah lagi.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 p-3.5 bg-white rounded-xl border border-indigo-100">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#0b1c30]">Nilai (0 - 100)</label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={scoreInput[row.id] ?? ''}
                            onChange={(e) => setScoreInput((prev) => ({ ...prev, [row.id]: e.target.value }))}
                            className="w-28 px-3 py-2 rounded-lg border border-indigo-100 text-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#0b1c30]">Feedback untuk Mahasiswa</label>
                          <textarea
                            rows={3}
                            value={feedbackInput[row.id] ?? ''}
                            onChange={(e) => setFeedbackInput((prev) => ({ ...prev, [row.id]: e.target.value }))}
                            placeholder="Tuliskan catatan atau masukan untuk tugas ini..."
                            className="w-full p-2.5 rounded-lg border border-indigo-100 text-xs resize-none"
                          />
                        </div>
                        <button
                          onClick={() => handleSaveScore(row)}
                          disabled={savingId === row.id}
                          className="self-end px-5 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold disabled:opacity-60"
                        >
                          {savingId === row.id ? 'Menyimpan...' : 'Simpan Nilai'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};