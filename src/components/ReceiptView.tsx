import React, { useState } from 'react';
import { MOCK_SUBMISSION_RECEIPT } from '../data/mockData';
import { 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  Copy, 
  Download, 
  Eye, 
  FileArchive, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  QrCode, 
  Clock, 
  HelpCircle,
  FileCheck,
  X
} from 'lucide-react';

interface ReceiptViewProps {
  onBackToDashboard: () => void;
  onOpenRevisionModal: () => void;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({
  onBackToDashboard,
  onOpenRevisionModal,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const receipt = MOCK_SUBMISSION_RECEIPT;

  const handleCopyId = () => {
    navigator.clipboard.writeText(receipt.submissionId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(receipt.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
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
          <span className="text-[#464555]">Riwayat Pengiriman</span>
          <span>›</span>
          <span className="font-bold text-[#0b1c30]">
            Bukti Pengiriman {receipt.submissionId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-print-receipt"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-indigo-100 hover:bg-[#eff4ff] text-[#0b1c30] text-xs font-bold transition-all shadow-2xs active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-[#3525cd]" />
            <span>Cetak Bukti (PDF)</span>
          </button>

          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold transition-all shadow-2xs active:scale-95"
          >
            <span>Kembali ke Dashboard</span>
          </button>
        </div>
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
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Tugas Berhasil Dikirimkan!
                </h1>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                  Tersinkronisasi
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl leading-relaxed">
                Tugas Anda telah diamankan dalam repositori akademik. Bukti tanda terima digital ini diterbitkan secara resmi dan dapat digunakan sebagai verifikasi pengumpulan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/15 px-3.5 py-2 rounded-xl backdrop-blur-xs flex-shrink-0 self-start md:self-center">
            <ShieldCheck className="w-5 h-5 text-[#6ffbbe]" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-200">Status Integritas</span>
              <span className="text-xs font-black text-white">Digital Receipt Valid</span>
            </div>
          </div>
        </div>
      </section>

      {/* TWO COLUMN WORKSPACE: Main Receipt Vault (Left 8) & Metadata/Policy (Right 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 8 COLS: Detailed Receipt Specs */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Receipt Details Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-indigo-50">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#3525cd]">
                  Secured SHA-256 Vault
                </span>
                <h2 className="text-lg font-extrabold text-[#0b1c30]">
                  Rincian Bukti Pengiriman
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#3525cd] font-mono text-xs font-bold">
                {receipt.version}
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Submission ID */}
              <div className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col justify-between gap-1">
                <span className="text-[11px] font-bold text-[#464555]">
                  Nomor Tanda Terima (ID Pengiriman)
                </span>
                <div className="flex items-center justify-between font-mono font-bold text-[#0b1c30] text-sm mt-1">
                  <span>{receipt.submissionId}</span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 rounded hover:bg-white text-[#777587] hover:text-[#3525cd] transition-colors"
                    title="Salin ID Pengiriman"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                {copiedId && (
                  <span className="text-[10px] text-[#006c49] font-bold">✓ Tersalin</span>
                )}
              </div>

              {/* Timestamp */}
              <div className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col justify-between gap-1">
                <span className="text-[11px] font-bold text-[#464555]">
                  Waktu Unggah Resmi (Server Timestamp)
                </span>
                <span className="font-bold text-[#0b1c30] text-xs mt-1">
                  {receipt.uploadedAt}
                </span>
                <span className="text-[10px] text-[#777587]">
                  Waktu Indonesia Barat (WIB)
                </span>
              </div>

              {/* Status Ketepatan Waktu */}
              <div className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col justify-between gap-1 sm:col-span-2">
                <span className="text-[11px] font-bold text-[#464555]">
                  Status Ketepatan Waktu
                </span>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6ffbbe]/70 text-[#002113] text-xs font-extrabold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006c49]" />
                    {receipt.punctualityStatus}
                  </span>
                  <span className="text-xs text-[#006c49] font-bold">
                    ✓ {receipt.punctualityNote}
                  </span>
                </div>
              </div>
            </div>

            {/* File Card with Preview & Download */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#0b1c30]">
                Berkas Terkirim
              </span>
              <div className="p-4 rounded-xl bg-[#eff4ff] border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#3525cd] text-white flex items-center justify-center flex-shrink-0">
                    <FileArchive className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#0b1c30] truncate">
                      {receipt.fileName}
                    </span>
                    <span className="text-[11px] text-[#464555]">
                      {receipt.fileSize} • {receipt.fileType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-[#3525cd] text-xs font-bold border border-indigo-100 transition-colors shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau</span>
                  </button>
                  <button
                    onClick={() => alert(`Mengunduh arsip ${receipt.fileName}...`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Checksum SHA-256 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0b1c30]">
                  Checksum Digital (SHA-256 Fingerprint)
                </span>
                <span className="text-[10px] text-[#464555]">
                  Enkripsi Otentikasi Anti-Modifikasi
                </span>
              </div>
              <div className="p-3 bg-[#eff4ff] rounded-xl flex items-center justify-between gap-2 border border-indigo-100">
                <span className="font-mono text-[11px] text-[#3525cd] truncate select-all">
                  {receipt.sha256Hash}
                </span>
                <button
                  onClick={handleCopyHash}
                  className="p-1 rounded hover:bg-white text-[#777587] hover:text-[#3525cd] transition-colors flex-shrink-0"
                  title="Salin Hash SHA-256"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {copiedHash && (
                <span className="text-[11px] text-[#006c49] font-bold">
                  ✓ Hash berhasil disalin!
                </span>
              )}
            </div>

            {/* Notes & Repo Link */}
            <div className="flex flex-col gap-2 pt-2 border-t border-indigo-50 text-xs">
              <span className="font-bold text-[#0b1c30]">Catatan Pengirim:</span>
              <p className="p-3 bg-[#eff4ff] rounded-xl text-[#464555] italic leading-relaxed">
                “{receipt.notes}”
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-[#0b1c30]">Repositori Terhubung:</span>
                <a 
                  href={receipt.githubUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#3525cd] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>github.com/nadiasavitri/web-rest-api</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Riwayat Log Pengiriman Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-[#0b1c30]">
              Riwayat Log Pengiriman (Submission Audit Log)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="bg-[#eff4ff] text-[#464555] font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3 rounded-l-lg">Versi</th>
                    <th className="py-2.5 px-3">Waktu Eksekusi</th>
                    <th className="py-2.5 px-3">Ukuran</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 rounded-r-lg text-right">Tanda Terima</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50">
                  <tr>
                    <td className="py-3 px-3 font-bold text-[#3525cd]">Versi 1 (Aktif)</td>
                    <td className="py-3 px-3 text-[#464555]">24 Okt 2024, 14:32:15 WIB</td>
                    <td className="py-3 px-3 text-[#0b1c30] font-mono">18.4 MB</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[#006c49] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Terkirim
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={handlePrint}
                        className="text-[#3525cd] font-bold hover:underline"
                      >
                        Unduh Bukti
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: Kebijakan Revisi, Info Modul, QR Otentikasi */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Kebijakan Revisi Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#3525cd]" />
                <h3 className="text-sm font-bold text-[#0b1c30]">Kebijakan Revisi</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#3525cd] text-[11px] font-bold">
                Tersisa 2 Kali
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-indigo-50">
                <span className="text-[#464555]">Batas Akhir Revisi</span>
                <span className="font-bold text-[#0b1c30]">25 Okt 2024, 23:59</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-indigo-50">
                <span className="text-[#464555]">Maksimum Revisi</span>
                <span className="font-bold text-[#0b1c30]">3 Kali</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#464555]">Penalti Keterlambatan</span>
                <span className="font-bold text-[#006c49]">0% (Bebas Penalti)</span>
              </div>
            </div>

            <p className="text-[11px] text-[#464555] leading-relaxed bg-[#eff4ff] p-3 rounded-xl">
              Pengajuan revisi sebelum batas tenggat waktu akan secara otomatis menimpa berkas utama tanpa mengurangi poin penilaian Anda.
            </p>

            <button
              id="btn-open-revision"
              onClick={onOpenRevisionModal}
              className="w-full py-2.5 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#3525cd] font-bold text-xs transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ajukan Revisi Berkas</span>
            </button>
          </div>

          {/* Informasi Modul Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-3 text-xs">
            <h3 className="text-sm font-bold text-[#0b1c30]">Informasi Modul Kuliah</h3>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#777587] block">
                  Mata Kuliah
                </span>
                <span className="font-bold text-[#0b1c30] mt-0.5 block">
                  {receipt.courseName}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#777587] block">
                  Judul Penugasan
                </span>
                <span className="font-bold text-[#0b1c30] mt-0.5 block">
                  {receipt.taskTitle}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#777587] block">
                  Dosen Penilai
                </span>
                <span className="font-bold text-[#0b1c30] mt-0.5 block">
                  {receipt.lecturerName}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#777587] block">
                  Bobot Evaluasi
                </span>
                <span className="font-bold text-[#3525cd] mt-0.5 block">
                  {receipt.weight}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Otentikasi Kampus */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100 flex flex-col items-center text-center gap-3">
            <div className="w-36 h-36 p-2 bg-[#eff4ff] rounded-2xl border border-indigo-100 flex items-center justify-center">
              {/* SVG QR Code Simulation */}
              <svg className="w-full h-full text-[#3525cd]" viewBox="0 0 100 100" fill="currentColor">
                {/* Top-left locator */}
                <rect x="5" y="5" width="30" height="30" rx="4" fill="#3525cd" />
                <rect x="11" y="11" width="18" height="18" rx="2" fill="#eff4ff" />
                <rect x="16" y="16" width="8" height="8" rx="1" fill="#3525cd" />

                {/* Top-right locator */}
                <rect x="65" y="5" width="30" height="30" rx="4" fill="#3525cd" />
                <rect x="71" y="11" width="18" height="18" rx="2" fill="#eff4ff" />
                <rect x="76" y="16" width="8" height="8" rx="1" fill="#3525cd" />

                {/* Bottom-left locator */}
                <rect x="5" y="65" width="30" height="30" rx="4" fill="#3525cd" />
                <rect x="11" y="71" width="18" height="18" rx="2" fill="#eff4ff" />
                <rect x="16" y="76" width="8" height="8" rx="1" fill="#3525cd" />

                {/* Data modules */}
                <rect x="42" y="10" width="6" height="6" />
                <rect x="52" y="15" width="6" height="6" />
                <rect x="42" y="25" width="6" height="6" />
                <rect x="10" y="42" width="6" height="6" />
                <rect x="22" y="52" width="6" height="6" />
                <rect x="42" y="42" width="6" height="6" />
                <rect x="52" y="52" width="6" height="6" />
                <rect x="62" y="42" width="6" height="6" />
                <rect x="72" y="52" width="6" height="6" />
                <rect x="82" y="42" width="6" height="6" />
                <rect x="45" y="65" width="6" height="6" />
                <rect x="55" y="75" width="6" height="6" />
                <rect x="65" y="65" width="6" height="6" />
                <rect x="75" y="75" width="6" height="6" />
                <rect x="85" y="85" width="6" height="6" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-[#0b1c30] block">
                QR Otentikasi Kampus
              </span>
              <span className="text-[11px] text-[#464555] mt-0.5 block max-w-[200px]">
                Pindai untuk memverifikasi keabsahan digital tanda terima di portal universitas.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-50">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#3525cd]" />
                <h3 className="text-sm font-bold text-[#0b1c30]">Pratinjau Berkas Tugas</h3>
              </div>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#eff4ff] rounded-xl text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#464555]">Nama Berkas:</span>
                <span className="font-bold text-[#0b1c30]">{receipt.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">Ukuran:</span>
                <span className="font-bold text-[#0b1c30]">{receipt.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">Kategori:</span>
                <span className="font-bold text-[#0b1c30]">{receipt.fileType}</span>
              </div>
            </div>

            <div className="text-xs text-[#464555] leading-relaxed">
              Struktur arsip terverifikasi mengandung:
              <ul className="list-disc pl-5 mt-1 space-y-1 font-mono text-[11px] text-[#3525cd]">
                <li>/src/controllers/auth.controller.ts</li>
                <li>/src/middleware/jwt.middleware.ts</li>
                <li>/test/auth.test.ts (Jest Unit Test)</li>
                <li>postman_collection.json</li>
                <li>.env.example &amp; README.md</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-indigo-50">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-xs font-bold hover:bg-[#dce9ff]"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
