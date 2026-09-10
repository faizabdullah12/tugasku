import React, { useState } from 'react';
import { SubmissionItem } from '../types';
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Clock,
  FileCheck,
  ExternalLink,
} from 'lucide-react';

interface ReceiptViewProps {
  onBackToDashboard: () => void;
  submission: SubmissionItem | null;
}

function formatDateTimeID(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}, ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB`;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({ onBackToDashboard, submission }) => {
  const [copiedId, setCopiedId] = useState(false);

  if (!submission) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-sm text-[#464555] text-center">
        Belum ada riwayat pengiriman. Unggah tugas pertamamu dulu.
      </div>
    );
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(submission.submissionCode);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
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
          <span className="font-bold text-[#0b1c30]">Bukti Pengiriman {submission.submissionCode}</span>
        </div>

        <button
          id="btn-print-receipt"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-indigo-100 hover:bg-[#eff4ff] text-[#0b1c30] text-xs font-bold transition-all shadow-2xs active:scale-95"
        >
          <Printer className="w-3.5 h-3.5 text-[#3525cd]" />
          <span>Cetak Bukti</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      <section
        id="submission-success-banner"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#006c49] to-[#047857] text-white p-6 sm:p-7 shadow-sm"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Tugas Berhasil Dikirimkan!</h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl leading-relaxed">
                Berkas tugasmu sudah tersimpan dan siap dinilai oleh dosen.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/15 px-3.5 py-2 rounded-xl backdrop-blur-xs flex-shrink-0 self-start md:self-center">
            {submission.status === 'dinilai' ? (
              <CheckCircle2 className="w-5 h-5 text-[#6ffbbe]" />
            ) : (
              <Clock className="w-5 h-5 text-[#6ffbbe]" />
            )}
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-200">Status</span>
              <span className="text-xs font-black text-white">
                {submission.status === 'dinilai' ? 'Sudah Dinilai' : 'Menunggu Penilaian Dosen'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Receipt Details Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-6">
        <div className="pb-4 border-b border-indigo-50">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#3525cd]">
            Rincian Bukti Pengiriman
          </span>
          <h2 className="text-lg font-extrabold text-[#0b1c30]">{submission.title}</h2>
          <p className="text-xs text-[#464555] mt-0.5">{submission.courseName}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col justify-between gap-1">
            <span className="text-[11px] font-bold text-[#464555]">Nomor Tanda Terima</span>
            <div className="flex items-center justify-between font-mono font-bold text-[#0b1c30] text-sm mt-1">
              <span>{submission.submissionCode}</span>
              <button
                onClick={handleCopyId}
                className="p-1 rounded hover:bg-white text-[#777587] hover:text-[#3525cd] transition-colors"
                title="Salin ID Pengiriman"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            {copiedId && <span className="text-[10px] text-[#006c49] font-bold">✓ Tersalin</span>}
          </div>

          <div className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col justify-between gap-1">
            <span className="text-[11px] font-bold text-[#464555]">Waktu Pengiriman</span>
            <span className="font-bold text-[#0b1c30] text-sm mt-1">{formatDateTimeID(submission.submittedAt)}</span>
          </div>

          <div className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col justify-between gap-1">
            <span className="text-[11px] font-bold text-[#464555]">Nama Berkas</span>
            <span className="font-bold text-[#0b1c30] text-sm mt-1 truncate">{submission.fileName}</span>
          </div>

          <div className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col justify-between gap-1">
            <span className="text-[11px] font-bold text-[#464555]">Ukuran Berkas</span>
            <span className="font-bold text-[#0b1c30] text-sm mt-1">{submission.fileSize || '-'}</span>
          </div>

          {submission.githubUrl && (
            <div className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col justify-between gap-1 sm:col-span-2">
              <span className="text-[11px] font-bold text-[#464555]">Tautan Repositori</span>
              <a
                href={submission.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#3525cd] text-sm mt-1 flex items-center gap-1.5 hover:underline break-all"
              >
                {submission.githubUrl}
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            </div>
          )}

          {submission.notes && (
            <div className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col justify-between gap-1 sm:col-span-2">
              <span className="text-[11px] font-bold text-[#464555]">Catatan Pengerjaan</span>
              <span className="text-[#0b1c30] text-xs mt-1 leading-relaxed whitespace-pre-line">{submission.notes}</span>
            </div>
          )}

          {submission.description && (
            <div className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col justify-between gap-1 sm:col-span-2">
              <span className="text-[11px] font-bold text-[#464555]">Deskripsi Tugas</span>
              <span className="text-[#0b1c30] text-xs mt-1 leading-relaxed whitespace-pre-line">{submission.description}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#464555] pt-2 border-t border-indigo-50">
          <ShieldCheck className="w-4 h-4 text-[#006c49]" />
          <span>Berkas tersimpan aman di Supabase Storage dan hanya bisa diakses olehmu dan dosen.</span>
        </div>
      </div>

      {submission.status === 'menunggu-nilai' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100 flex items-center gap-3">
          <FileCheck className="w-8 h-8 text-[#3525cd] flex-shrink-0" />
          <p className="text-xs text-[#464555] leading-relaxed">
            Tugas ini masih menunggu dosen menilai. Cek kembali menu <strong className="text-[#0b1c30]">Nilai &amp; Feedback</strong> secara berkala. Ingat, tugas yang sudah dinilai tidak bisa direvisi, jadi pastikan berkas yang kamu kirim sudah final.
          </p>
        </div>
      )}
    </div>
  );
};