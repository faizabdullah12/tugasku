import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  Upload, 
  FileArchive, 
  Copy, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Trash2, 
  Send, 
  Bookmark, 
  HelpCircle, 
  GitBranch, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface UploadViewProps {
  onBackToDashboard: () => void;
  onSubmitSuccess: () => void;
  onOpenHelp: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onBackToDashboard,
  onSubmitSuccess,
  onOpenHelp,
}) => {
  // Upload State
  const [fileUploaded, setFileUploaded] = useState(true);
  const [fileName, setFileName] = useState('210401089_NadiaSavitri_Tugas4.zip');
  const [fileSize, setFileSize] = useState('18.4 MB');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(100);

  // Form Inputs
  const [repoUrl, setRepoUrl] = useState('https://github.com/nadiasavitri/webpro-rest-api-jwt');
  const [notes, setNotes] = useState("Tugas telah dilengkapi dengan unit test Jest. File .env.example telah disertakan di root project. Kredensial akun demo: admin@univ.ac.id / Password123!");
  const [integrityChecked, setIntegrityChecked] = useState(true);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Accordion state
  const [expandedRubric, setExpandedRubric] = useState<string | null>('rubric-1');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyFileName = () => {
    navigator.clipboard.writeText('NIM_NamaLengkap_Tugas4.zip');
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setIsUploading(true);
      setUploadProgress(10);
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setFileUploaded(true);
            return 100;
          }
          return prev + 30;
        });
      }, 200);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setIsUploading(true);
      setUploadProgress(10);
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setFileUploaded(true);
            return 100;
          }
          return prev + 30;
        });
      }, 200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUploaded) {
      alert('Silakan unggah berkas tugas terlebih dahulu.');
      return;
    }
    if (!integrityChecked) {
      alert('Harap centang Pernyataan Integritas & Kejujuran Akademik.');
      return;
    }
    onSubmitSuccess();
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
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
            Tugas 4: Implementasi REST API &amp; JWT Authentication
          </span>
        </div>

        {/* Urgency Pill Indicator */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffddb8] text-[#2a1700] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#684000] animate-ping" />
            Mendekati Batas Waktu
          </span>
          <span className="text-xs text-[#464555] font-semibold">
            Sisa Waktu: <strong className="text-[#684000]">1 hari 4 jam</strong>
          </span>
        </div>
      </div>

      {/* Hero Task Banner Card */}
      <section 
        id="task-header-card"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3525cd] via-[#4338ca] to-[#4f46e5] text-white p-6 sm:p-8 shadow-sm"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold font-mono">
                IF-3204 • TUGAS PRAKTIKUM 04
              </span>
              <span className="px-3 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-black">
                Bobot: 15% Nilai Akhir
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Implementasi REST API &amp; JWT Authentication
            </h1>

            <p className="text-sm text-indigo-100 leading-relaxed max-w-xl">
              Bangun arsitektur backend modular berbasis micro-framework dengan validasi role-based access control, hashing bcrypt, serta endpoint unit testing komprehensif.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-indigo-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-indigo-200">Dosen Pengampu</span>
                  <span className="font-bold text-white">Dr. Ir. Hendra Wijaya, M.T.</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-indigo-200">Batas Pengumpulan</span>
                  <span className="font-bold text-white">Jumat, 25 Okt 2024 • 23:59 WIB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Status & Class Progress Box */}
          <div className="bg-white rounded-2xl p-5 text-[#0b1c30] shadow-md min-w-full sm:min-w-[320px] lg:min-w-[340px] flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-50">
              <span className="text-xs font-bold text-[#464555]">Status Pengajuan</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#ba1a1a] text-xs font-bold border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                Belum Dikumpulkan
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#464555] font-semibold">Progress Kelas</span>
                <span className="font-bold text-[#3525cd]">42 dari 54 Mahasiswa</span>
              </div>
              <div className="w-full bg-[#eff4ff] rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-[#006c49] h-full rounded-full transition-all duration-700" 
                  style={{ width: '78%' }}
                />
              </div>
              <div className="flex items-center justify-between pt-2 text-[11px] text-[#464555]">
                <span>78% Mahasiswa sudah mengumpulkan</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006c49]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TWO COLUMN WORKSPACE: Guidelines & Rubrics (Left 5) / Submission Form (Right 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Instruksi Pengerjaan & Rubrik Penilaian (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Instruksi Pengerjaan Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3525cd]" />
                <h3 className="text-sm font-bold text-[#0b1c30]">Instruksi Pengerjaan</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-[#eff4ff] text-[#3525cd] text-[11px] font-bold">
                Revisi v1.2
              </span>
            </div>

            <ul className="flex flex-col gap-3 text-xs text-[#0b1c30] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3525cd] mt-0.5 flex-shrink-0" />
                <span>
                  Gunakan Node.js (Express/Fastify) atau Python (FastAPI) dengan struktur modular (Controller, Service, Repository pattern).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3525cd] mt-0.5 flex-shrink-0" />
                <span>
                  Implementasikan otentikasi JWT: token masa aktif 15 menit dan mekanisme refresh token. Minimal 2 level hak akses: <em>User</em> &amp; <em>Admin</em>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3525cd] mt-0.5 flex-shrink-0" />
                <span>
                  Sertakan file <code className="bg-[#eff4ff] px-1.5 py-0.5 rounded font-mono text-[#3525cd]">collection.json</code> untuk ekspor Postman/Insomnia beserta dokumentasi Environment Variables.
                </span>
              </li>
            </ul>

            {/* Format & Size Box */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#eff4ff] rounded-xl text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#464555] block">
                  Format Berkas
                </span>
                <span className="font-bold text-[#0b1c30] mt-0.5 block">
                  ZIP, RAR, atau PDF
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#464555] block">
                  Batas Ukuran
                </span>
                <span className="font-bold text-[#0b1c30] mt-0.5 block">
                  Maksimal 50.0 MB
                </span>
              </div>
            </div>

            {/* Ketentuan Penamaan File */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#464555]">
                Ketentuan Penamaan File
              </span>
              <div className="flex items-center justify-between p-2.5 bg-[#eff4ff] rounded-xl font-mono text-xs text-[#3525cd] font-semibold border border-indigo-100">
                <span>NIM_NamaLengkap_Tugas4.zip</span>
                <button
                  onClick={handleCopyFileName}
                  className="p-1 rounded hover:bg-white text-[#777587] hover:text-[#3525cd] transition-colors"
                  title="Salin Pola Nama File"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {copiedNotification && (
                <span className="text-[11px] text-[#006c49] font-bold">
                  ✓ Berhasil disalin ke clipboard!
                </span>
              )}
            </div>

            {/* Berkas Pendukung & Template */}
            <div className="flex flex-col gap-2 pt-2 border-t border-indigo-50">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#464555]">
                Berkas Pendukung &amp; Template
              </span>

              {/* Download item 1 */}
              <div 
                onClick={() => alert('Mengunduh starter-code-webpro-auth.zip (3.4 MB)...')}
                className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileArchive className="w-5 h-5 text-[#3525cd] flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#0b1c30] truncate group-hover:text-[#3525cd]">
                      starter-code-webpro-auth.zip
                    </span>
                    <span className="text-[11px] text-[#464555]">
                      3.4 MB • SQLite Schema &amp; Boilerplate
                    </span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-[#777587] group-hover:text-[#3525cd] transition-colors flex-shrink-0" />
              </div>

              {/* Download item 2 */}
              <div 
                onClick={() => alert('Mengunduh Panduan_Penyusunan_Dokumentasi.pdf (840 KB)...')}
                className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-5 h-5 text-[#006c49] flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#0b1c30] truncate group-hover:text-[#006c49]">
                      Panduan_Penyusunan_Dokumentasi.pdf
                    </span>
                    <span className="text-[11px] text-[#464555]">
                      840 KB • Format Laporan Praktikum
                    </span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-[#777587] group-hover:text-[#006c49] transition-colors flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Rubrik Penilaian Accordion Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3525cd]" />
                <h3 className="text-sm font-bold text-[#0b1c30]">Rubrik Penilaian</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6ffbbe]/60 text-[#002113] text-[11px] font-black">
                100 Poin Total
              </span>
            </div>

            {/* Rubric 1 */}
            <div className="border border-indigo-100 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedRubric(expandedRubric === 'rubric-1' ? null : 'rubric-1')}
                className="w-full flex items-center justify-between p-3 bg-[#eff4ff] text-left hover:bg-[#dce9ff] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3525cd]" />
                  <span className="text-xs font-bold text-[#0b1c30]">
                    Arsitektur API &amp; Best Practices
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#3525cd] bg-white px-2 py-0.5 rounded">
                    30%
                  </span>
                  {expandedRubric === 'rubric-1' ? (
                    <ChevronUp className="w-4 h-4 text-[#777587]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#777587]" />
                  )}
                </div>
              </button>
              {expandedRubric === 'rubric-1' && (
                <div className="p-3 bg-white text-xs text-[#464555] leading-relaxed border-t border-indigo-50">
                  Penerapan kaidah RESTful yang konsisten (HTTP Verbs, status code 200, 201, 400, 401, 403, 404, 500), pemisahan router &amp; controller, modular code readability.
                </div>
              )}
            </div>

            {/* Rubric 2 */}
            <div className="border border-indigo-100 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedRubric(expandedRubric === 'rubric-2' ? null : 'rubric-2')}
                className="w-full flex items-center justify-between p-3 bg-[#eff4ff] text-left hover:bg-[#dce9ff] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#006c49]" />
                  <span className="text-xs font-bold text-[#0b1c30]">
                    Keamanan &amp; Autentikasi JWT
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#006c49] bg-white px-2 py-0.5 rounded">
                    30%
                  </span>
                  {expandedRubric === 'rubric-2' ? (
                    <ChevronUp className="w-4 h-4 text-[#777587]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#777587]" />
                  )}
                </div>
              </button>
              {expandedRubric === 'rubric-2' && (
                <div className="p-3 bg-white text-xs text-[#464555] leading-relaxed border-t border-indigo-50">
                  Penanganan secret key via environment variables, expiry time token, dan refresh token blacklist logic saat logout.
                </div>
              )}
            </div>

            {/* Rubric 3 */}
            <div className="border border-indigo-100 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedRubric(expandedRubric === 'rubric-3' ? null : 'rubric-3')}
                className="w-full flex items-center justify-between p-3 bg-[#eff4ff] text-left hover:bg-[#dce9ff] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#684000]" />
                  <span className="text-xs font-bold text-[#0b1c30]">
                    Pengujian Unit (Unit Testing)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#684000] bg-white px-2 py-0.5 rounded">
                    20%
                  </span>
                  {expandedRubric === 'rubric-3' ? (
                    <ChevronUp className="w-4 h-4 text-[#777587]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#777587]" />
                  )}
                </div>
              </button>
              {expandedRubric === 'rubric-3' && (
                <div className="p-3 bg-white text-xs text-[#464555] leading-relaxed border-t border-indigo-50">
                  Minimal 8 test cases mencakup skenario otentikasi sukses, password salah, token kadaluarsa, dan akses role unauthorized.
                </div>
              )}
            </div>

            {/* Rubric 4 */}
            <div className="border border-indigo-100 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedRubric(expandedRubric === 'rubric-4' ? null : 'rubric-4')}
                className="w-full flex items-center justify-between p-3 bg-[#eff4ff] text-left hover:bg-[#dce9ff] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#777587]" />
                  <span className="text-xs font-bold text-[#0b1c30]">
                    Dokumentasi Postman &amp; Readme
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#464555] bg-white px-2 py-0.5 rounded">
                    20%
                  </span>
                  {expandedRubric === 'rubric-4' ? (
                    <ChevronUp className="w-4 h-4 text-[#777587]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#777587]" />
                  )}
                </div>
              </button>
              {expandedRubric === 'rubric-4' && (
                <div className="p-3 bg-white text-xs text-[#464555] leading-relaxed border-t border-indigo-50">
                  README komprehensif memuat langkah instalasi dependencies, setup database, contoh cURL command, dan struktur folder.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Submission Form (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Berkas Upload Card */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#3525cd]" />
                  <h3 className="text-sm font-bold text-[#0b1c30]">Unggah Berkas Tugas</h3>
                </div>
                <span className="text-xs text-[#464555]">
                  Wajib diisi • 1 File Utama
                </span>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,.rar,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Drag and drop interactive zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 hover:border-[#3525cd] bg-[#eff4ff]/60 hover:bg-[#eff4ff] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-white text-[#3525cd] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-[#0b1c30]">
                  Tarik dan lepas file tugas Anda di sini
                </span>
                <span className="text-xs text-[#3525cd] font-semibold mt-1">
                  atau klik untuk memilih berkas dari komputer
                </span>
                <div className="flex items-center gap-2 mt-3 text-[11px] text-[#464555]">
                  <span className="px-2 py-0.5 rounded bg-white font-mono">ZIP</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-white font-mono">RAR</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-white font-mono">PDF</span>
                  <span>•</span>
                  <span>Maksimal 50 MB</span>
                </div>
              </div>

              {/* Uploaded File Status Tile */}
              {fileUploaded && (
                <div className="p-4 rounded-xl bg-[#eff4ff] border border-indigo-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#3525cd] text-white flex items-center justify-center flex-shrink-0">
                        <FileArchive className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#0b1c30] truncate">
                            {fileName}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#006c49] flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#464555] mt-0.5">
                          <span>{fileSize}</span>
                          <span>•</span>
                          <span className="text-[#006c49] font-semibold">
                            {isUploading ? 'Sedang mengunggah...' : 'Selesai diunggah'}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">MD5: e7b29a...f41</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 rounded-lg text-[#464555] hover:text-[#3525cd] hover:bg-white transition-colors"
                        title="Ganti Berkas"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFileUploaded(false)}
                        className="p-1.5 rounded-lg text-[#464555] hover:text-[#ba1a1a] hover:bg-white transition-colors"
                        title="Hapus Berkas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Upload Progress Bar */}
                  <div className="w-full bg-white rounded-full h-1.5 overflow-hidden mt-1">
                    <div 
                      className="bg-[#006c49] h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#464555] pt-0.5">
                    <span className="text-[#006c49] font-bold">
                      ✓ Unggahan 100% Berhasil
                    </span>
                    <span className="font-mono">{fileSize} / {fileSize}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Notes Card */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3525cd]" />
                <h3 className="text-sm font-bold text-[#0b1c30]">
                  Catatan Tambahan untuk Dosen &amp; Asisten Lab
                </h3>
              </div>

              {/* Repo URL Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="input-repo-url" className="font-bold text-[#0b1c30]">
                    Tautan Repositori GitHub / GitLab (Opsional)
                  </label>
                  <span className="text-[11px] text-[#464555]">
                    Pastikan status Public atau beri akses kolaborator
                  </span>
                </div>
                <div className="relative flex items-center">
                  <GitBranch className="w-4 h-4 text-[#777587] absolute left-3 pointer-events-none" />
                  <input
                    id="input-repo-url"
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/nadiasavitri/webpro-rest-api-jwt"
                    className="w-full pl-9 pr-4 py-2 bg-[#eff4ff] text-xs font-mono text-[#0b1c30] rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20"
                  />
                </div>
              </div>

              {/* Special Notes Textarea */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="input-submission-notes" className="font-bold text-[#0b1c30]">
                    Catatan Khusus Pengerjaan &amp; Pengujian
                  </label>
                  <span className="text-[11px] text-[#464555]">
                    Maks. 500 karakter
                  </span>
                </div>
                <textarea
                  id="input-submission-notes"
                  rows={4}
                  maxLength={500}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: 'Tugas telah dilengkapi dengan unit test Jest. File .env.example telah disertakan di root project. Kredensial akun demo: admin@univ.ac.id / Password123!'"
                  className="w-full p-3 bg-[#eff4ff] text-xs text-[#0b1c30] rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 leading-relaxed resize-none"
                />
                <div className="flex justify-end text-[11px] text-[#777587]">
                  <span>{notes.length} / 500 karakter</span>
                </div>
              </div>
            </div>

            {/* Academic Integrity Checkbox Card */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex items-start gap-3">
              <input
                id="checkbox-integrity"
                type="checkbox"
                checked={integrityChecked}
                onChange={(e) => setIntegrityChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-indigo-200 text-[#3525cd] focus:ring-[#3525cd]/30 cursor-pointer"
              />
              <label htmlFor="checkbox-integrity" className="text-xs text-[#464555] leading-relaxed cursor-pointer select-none">
                <strong className="text-[#0b1c30] block mb-0.5">Pernyataan Integritas &amp; Kejujuran Akademik</strong>
                Saya menyatakan dengan sungguh-sungguh bahwa berkas tugas ini adalah hasil karya mandiri saya, disusun sesuai etika akademik, dan bebas dari plagiarisme maupun pemanfaatan kode tanpa atribusi yang sah. Saya memahami konsekuensi akademik apabila terbukti melakukan kecurangan.
              </label>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => alert('Draf penugasan berhasil disimpan secara lokal.')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-xs font-bold transition-all active:scale-95"
                >
                  <Bookmark className="w-4 h-4 text-[#3525cd]" />
                  <span>Simpan Draf</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenHelp}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl hover:bg-[#eff4ff] text-[#464555] text-xs font-semibold transition-all"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Butuh Bantuan?</span>
                </button>
              </div>

              <button
                type="submit"
                id="btn-submit-task"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Tugas Mandiri</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
