import React, { useState } from 'react';
import { MOCK_RUBRICS, LECTURER_DATA } from '../data/mockData';
import { 
  ArrowLeft, 
  Printer, 
  Scale, 
  Award, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  Play, 
  Pause, 
  Volume2, 
  FileText, 
  Download, 
  TrendingUp, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface EvaluationViewProps {
  onBackToDashboard: () => void;
  onOpenDisputeModal: () => void;
  onOpenMessageModal: () => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  onBackToDashboard,
  onOpenDisputeModal,
  onOpenMessageModal,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35); // in percentage

  const rubrics = MOCK_RUBRICS;
  const lecturer = LECTURER_DATA;

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handlePrintTranscript = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
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
          <span className="text-[#464555]">Pemrograman Web</span>
          <span>›</span>
          <span className="font-bold text-[#0b1c30]">
            Nilai &amp; Feedback: Tugas 3 Database Relasional
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintTranscript}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-indigo-100 hover:bg-[#eff4ff] text-[#0b1c30] text-xs font-bold transition-all shadow-2xs active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-[#3525cd]" />
            <span>Cetak Transkrip</span>
          </button>

          <button
            id="btn-open-dispute"
            onClick={onOpenDisputeModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#3525cd] text-xs font-bold transition-all shadow-2xs active:scale-95"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Ajukan Sanggahan Nilai</span>
          </button>
        </div>
      </div>

      {/* HERO BENTO EVALUATION METRICS */}
      <section 
        id="hero-evaluation-bento"
        className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 sm:p-8 bg-white rounded-2xl shadow-xs border border-indigo-100"
      >
        {/* Score & Percentile Overview (Left 6 cols) */}
        <div className="md:col-span-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6ffbbe]/70 text-[#002113] text-xs font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006c49]" />
                Selesai Dinilai • 20 Okt 2024
              </span>
              <span className="text-xs text-[#464555] font-mono">
                IF-3201
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] tracking-tight mt-1">
              Tugas 3: Database Relasional &amp; Migrasi
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-black text-[#3525cd] tracking-tight">
              95
            </span>
            <span className="text-xl font-bold text-[#777587]">/ 100</span>
            <span className="ml-2 px-3 py-1 rounded-full bg-emerald-50 text-[#006c49] text-xs font-bold border border-emerald-200">
              5% teratas dari 54 mahasiswa
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#464555] pt-2 border-t border-indigo-50">
            <ShieldCheck className="w-4 h-4 text-[#006c49]" />
            <span>Terverifikasi resmi oleh Tim Dosen Kurikulum Informatika</span>
          </div>
        </div>

        {/* Circular Donut Visual (Middle 3 cols) */}
        <div className="md:col-span-3 flex flex-col items-center justify-center p-4 bg-[#eff4ff] rounded-2xl">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Donut SVG */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-indigo-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#3525cd]"
                strokeDasharray="95, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-[#0b1c30]">95%</span>
              <span className="text-[10px] font-bold text-[#464555]">Akurasi</span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#3525cd] mt-2">
            Target Capaian Terlampaui
          </span>
        </div>

        {/* Grade Badge & CPL (Right 3 cols) */}
        <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end p-4 bg-[#eff4ff] rounded-2xl">
          <span className="text-[11px] font-bold text-[#464555] uppercase tracking-wider">
            Predikat Akhir
          </span>
          <div className="flex flex-col items-start md:items-end">
            <span className="text-4xl font-black text-[#006c49]">Grade A</span>
            <span className="text-xs font-extrabold text-[#00714d] mt-0.5">
              Sangat Baik
            </span>
          </div>
          <div className="text-right text-xs text-[#464555]">
            <span className="block font-semibold">Capaian Pembelajaran (CPL):</span>
            <span className="text-[#006c49] font-bold">Sangat Memuaskan</span>
          </div>
        </div>
      </section>

      {/* EVALUATOR / DOSEN PENGAMPU CARD */}
      <section className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            alt={lecturer.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-200"
            src={lecturer.avatarUrl}
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#0b1c30]">
              {lecturer.name}
            </span>
            <span className="text-xs text-[#464555]">
              {lecturer.nip} • {lecturer.role}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="px-3 py-1 rounded-xl bg-[#eff4ff] text-xs font-medium text-[#464555]">
            Waktu koreksi: <strong className="text-[#0b1c30]">{lecturer.correctionTime}</strong>
          </div>
          <div className="px-3 py-1 rounded-xl bg-[#eff4ff] text-xs font-medium text-[#464555] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#006c49]" />
            Turnitin: <strong className="text-[#006c49]">{lecturer.turnitinPlagiarism}</strong>
          </div>
          <button
            id="btn-message-lecturer"
            onClick={onOpenMessageModal}
            className="px-4 py-1.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Kirim Pesan</span>
          </button>
        </div>
      </section>

      {/* TWO COLUMN GRID: Rubric Breakdown (Left 7 cols) & Lecturer Feedback & Audio Memo (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 7 COLS: Rincian Rubrik Penilaian */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#0b1c30]">
              Rincian Rubrik Penilaian
            </h2>
            <span className="text-xs text-[#464555]">Total 4 Kriteria Evaluasi</span>
          </div>

          <div className="flex flex-col gap-3">
            {rubrics.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-[#eff4ff] text-[#3525cd] text-xs font-black flex items-center justify-center font-mono">
                      {item.number}
                    </span>
                    <h3 className="text-sm font-bold text-[#0b1c30]">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-[#0b1c30]">
                      {item.score}
                    </span>
                    <span className="text-xs text-[#777587]">/ {item.maxScore}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#eff4ff] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#006c49] h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.badgeType === 'emerald'
                        ? 'bg-[#6ffbbe]/70 text-[#002113]'
                        : item.badgeType === 'amber'
                        ? 'bg-[#ffddb8] text-[#2a1700]'
                        : 'bg-[#dce9ff] text-[#0b1c30]'
                    }`}
                  >
                    {item.badgeText}
                  </span>
                  <span className="text-[11px] text-[#464555] font-mono font-semibold">
                    {item.percentage}%
                  </span>
                </div>

                <p className="text-xs text-[#464555] leading-relaxed pt-1 border-t border-indigo-50">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT 5 COLS: Feedback Dosen, Audio Memo & File Annotations */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Lecturer Quotation Card */}
          <div className="p-6 bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                alt="Dr. Hendra"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                src={lecturer.quoteAvatarUrl}
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <h3 className="text-sm font-bold text-[#0b1c30]">
                  Feedback Dosen Pengajar
                </h3>
                <span className="text-xs text-[#464555]">Ulasan Langsung Penguji</span>
              </div>
            </div>

            <div className="p-4 bg-[#eff4ff] rounded-xl border border-indigo-100">
              <p className="text-xs text-[#0b1c30] italic leading-relaxed">
                {lecturer.quote}
              </p>
            </div>

            {/* Interactive Audio Note Player */}
            <div className="p-4 bg-gradient-to-r from-[#eff4ff] to-[#dce9ff] rounded-2xl border border-indigo-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#0b1c30]">
                  <Volume2 className="w-4 h-4 text-[#3525cd]" />
                  <span>Catatan Suara Dosen (Audio Memo)</span>
                </div>
                <span className="font-mono text-[11px] text-[#464555]">01:24</span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="w-9 h-9 rounded-full bg-[#3525cd] hover:bg-[#4f46e5] text-white flex items-center justify-center shadow-xs transition-transform active:scale-90 flex-shrink-0"
                  aria-label={isPlayingAudio ? 'Jeda Audio' : 'Putar Catatan Suara'}
                >
                  {isPlayingAudio ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>

                {/* Animated sound wave bars */}
                <div className="flex items-center gap-1 flex-1 h-8">
                  {[40, 60, 25, 80, 95, 45, 70, 85, 30, 90, 60, 75, 50, 65, 80, 40, 20, 90, 70].map(
                    (height, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all duration-200 ${
                          idx < 8 ? 'bg-[#3525cd]' : 'bg-indigo-200'
                        } ${isPlayingAudio ? 'animate-pulse' : ''}`}
                        style={{ height: `${height}%` }}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#464555]">
                <span>{isPlayingAudio ? 'Sedang diputar...' : 'Klik putar untuk mendengarkan'}</span>
                <span>00:32 / 01:24</span>
              </div>
            </div>

            {/* Evaluated Document Download */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-xs font-bold text-[#0b1c30]">
                Berkas Anotasi Dosen:
              </span>
              <div
                onClick={() => alert('Mengunduh Berkas Anotasi PDF: Feedback_Evaluasi_Tugas3_Nadia.pdf...')}
                className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-5 h-5 text-[#ba1a1a] flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#0b1c30] truncate group-hover:text-[#3525cd]">
                      Feedback_Evaluasi_Tugas3_Nadia.pdf
                    </span>
                    <span className="text-[11px] text-[#464555]">
                      1.2 MB • Catatan Koreksi &amp; Koreksi ERD
                    </span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-[#777587] group-hover:text-[#3525cd] transition-colors flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Sanggahan Nilai Quick Card */}
          <div className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#3525cd]" />
              <h3 className="text-sm font-bold text-[#0b1c30]">
                Kebijakan Sanggahan Nilai
              </h3>
            </div>
            <p className="text-xs text-[#464555] leading-relaxed">
              Mahasiswa berhak mengajukan permohonan peninjauan kembali nilai maksimal 3x24 jam setelah nilai diumumkan dengan menyertakan argumen teknis.
            </p>
            <button
              onClick={onOpenDisputeModal}
              className="w-full py-2 px-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#3525cd] font-bold text-xs transition-colors text-center active:scale-95"
            >
              Buka Form Sanggahan Nilai
            </button>
          </div>
        </div>
      </div>

      {/* HISTORICAL GRADE TRAJECTORY SECTION */}
      <section className="p-6 bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-[#0b1c30]">
              Trajektori Nilai Akademik Nadia (Tren Penugasan)
            </h2>
            <p className="text-xs text-[#464555]">
              Pemantauan konsistensi performa nilai pada mata kuliah Pemrograman Web (IF3201)
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#006c49] font-bold bg-emerald-50 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span>Kenaikan Konsisten (+5.5%)</span>
          </div>
        </div>

        {/* Trend Cards & SVG Curve */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* T1 */}
          <div className="p-4 bg-[#eff4ff] rounded-xl flex flex-col justify-between gap-2 border border-indigo-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#464555]">Tugas 1</span>
              <span className="px-2 py-0.5 rounded bg-white text-[11px] font-bold text-[#0b1c30]">
                14 Sep 2024
              </span>
            </div>
            <span className="text-sm font-bold text-[#0b1c30]">
              HTML5, CSS Flexbox &amp; Grid
            </span>
            <div className="flex items-baseline justify-between pt-2 border-t border-indigo-100/60">
              <span className="text-2xl font-black text-[#0b1c30]">90</span>
              <span className="text-xs font-extrabold text-[#006c49]">Grade A</span>
            </div>
          </div>

          {/* T2 */}
          <div className="p-4 bg-[#eff4ff] rounded-xl flex flex-col justify-between gap-2 border border-indigo-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#464555]">Tugas 2</span>
              <span className="px-2 py-0.5 rounded bg-white text-[11px] font-bold text-[#0b1c30]">
                28 Sep 2024
              </span>
            </div>
            <span className="text-sm font-bold text-[#0b1c30]">
              DOM Manipulation &amp; Async API
            </span>
            <div className="flex items-baseline justify-between pt-2 border-t border-indigo-100/60">
              <span className="text-2xl font-black text-[#0b1c30]">92</span>
              <span className="text-xs font-extrabold text-[#006c49]">Grade A</span>
            </div>
          </div>

          {/* T3 (Current) */}
          <div className="p-4 bg-gradient-to-br from-[#eff4ff] to-[#dce9ff] rounded-xl flex flex-col justify-between gap-2 border-2 border-[#3525cd]/40 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#3525cd]">Tugas 3 (Sekarang)</span>
              <span className="px-2 py-0.5 rounded bg-[#3525cd] text-white text-[11px] font-bold">
                18 Okt 2024
              </span>
            </div>
            <span className="text-sm font-bold text-[#0b1c30]">
              Database Relasional &amp; Migrasi
            </span>
            <div className="flex items-baseline justify-between pt-2 border-t border-indigo-200/60">
              <span className="text-2xl font-black text-[#3525cd]">95</span>
              <span className="text-xs font-extrabold text-[#006c49]">Grade A (Top 5%)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
