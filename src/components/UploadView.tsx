import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { createSubmission } from '../lib/data';
import { DEFAULT_COURSE_NAME } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  Upload,
  FileArchive,
  RefreshCw,
  Trash2,
  Send,
  HelpCircle,
  GitBranch,
  FileText,
  BookOpen,
  Calendar
} from 'lucide-react';

interface UploadViewProps {
  studentId: string;
  onBackToDashboard: () => void;
  onSubmitSuccess: () => void;
  onOpenHelp: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  studentId,
  onBackToDashboard,
  onSubmitSuccess,
  onOpenHelp,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [integrityChecked, setIntegrityChecked] = useState(false);

  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickFile = (file: File) => {
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    setFileUploaded(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) pickFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) pickFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!title.trim()) {
      setErrorMsg('Judul tugas wajib diisi.');
      return;
    }
    if (!fileUploaded) {
      setErrorMsg('Silakan unggah berkas tugas terlebih dahulu.');
      return;
    }
    if (!integrityChecked) {
      setErrorMsg('Harap centang Pernyataan Integritas & Kejujuran Akademik.');
      return;
    }
    void submitToSupabase();
  };

  const submitToSupabase = async () => {
    if (!supabase || !fileInputRef.current?.files?.[0]) {
      setErrorMsg('Supabase belum siap atau berkas belum dipilih.');
      return;
    }
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const file = fileInputRef.current.files[0];
      if (!user) {
        setErrorMsg('Sesi pengguna tidak ditemukan. Silakan masuk kembali.');
        return;
      }
      const filePath = `${user.id}/${crypto.randomUUID()}-${file.name}`;
      const uploadResult = await supabase.storage.from('submissions').upload(filePath, file, { upsert: false });
      if (uploadResult.error) {
        setErrorMsg(uploadResult.error.message);
        return;
      }
      try {
        await createSubmission({
          studentId,
          title: title.trim(),
          description: description.trim(),
          deadlineAt: deadline ? new Date(deadline).toISOString() : null,
          file,
          filePath,
          githubUrl: repoUrl.trim() || null,
          notes: notes.trim() || null,
        });
      } catch (insertErr) {
        await supabase.storage.from('submissions').remove([filePath]);
        setErrorMsg(insertErr instanceof Error ? insertErr.message : 'Gagal menyimpan tugas.');
        return;
      }
      onSubmitSuccess();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
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
          <span className="font-bold text-[#0b1c30]">Unggah Tugas Baru</span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3525cd] via-[#4338ca] to-[#4f46e5] text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-100">
          <BookOpen className="w-4 h-4" />
          {DEFAULT_COURSE_NAME}
        </div>
        <h1 className="relative z-10 text-xl sm:text-2xl font-extrabold mt-1">Unggah Tugas Mandiri</h1>
        <p className="relative z-10 text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl">
          Tentukan sendiri judul tugas yang kamu kerjakan, lalu unggah berkasnya. Tidak perlu menunggu tugas dibuat oleh dosen.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#3525cd]" />
            <h3 className="text-sm font-bold text-[#0b1c30]">Detail Tugas</h3>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="input-title" className="text-xs font-bold text-[#0b1c30]">
              Judul Tugas <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="input-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Tugas Pembelajaran Java - Modul OOP"
              className="w-full px-3.5 py-2.5 bg-[#eff4ff] text-sm text-[#0b1c30] rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="input-description" className="text-xs font-bold text-[#0b1c30]">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              id="input-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ringkasan apa yang dikerjakan dalam tugas ini..."
              className="w-full p-3 bg-[#eff4ff] text-xs text-[#0b1c30] rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 leading-relaxed resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="input-deadline" className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#777587]" />
              Tenggat Pribadi (Opsional)
            </label>
            <input
              id="input-deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#eff4ff] text-sm text-[#0b1c30] rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20"
            />
            <span className="text-[11px] text-[#777587]">Hanya catatan pribadi, tidak memengaruhi penilaian.</span>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#3525cd]" />
              <h3 className="text-sm font-bold text-[#0b1c30]">Unggah Berkas Tugas</h3>
            </div>
            <span className="text-xs text-[#464555]">Wajib diisi • 1 File</span>
          </div>

          <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 hover:border-[#3525cd] bg-[#eff4ff]/60 hover:bg-[#eff4ff] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-white text-[#3525cd] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-[#0b1c30]">Tarik dan lepas file tugas Anda di sini</span>
            <span className="text-xs text-[#3525cd] font-semibold mt-1">atau klik untuk memilih berkas dari komputer</span>
          </div>

          {fileUploaded && (
            <div className="p-4 rounded-xl bg-[#eff4ff] border border-indigo-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#3525cd] text-white flex items-center justify-center flex-shrink-0">
                  <FileArchive className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0b1c30] truncate">{fileName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006c49] flex-shrink-0" />
                  </div>
                  <span className="text-[11px] text-[#464555]">{fileSize}</span>
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
          )}
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#3525cd]" />
            <h3 className="text-sm font-bold text-[#0b1c30]">Catatan Tambahan untuk Dosen</h3>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="input-repo-url" className="text-xs font-bold text-[#0b1c30]">
              Tautan Repositori GitHub / GitLab (Opsional)
            </label>
            <div className="relative flex items-center">
              <GitBranch className="w-4 h-4 text-[#777587] absolute left-3 pointer-events-none" />
              <input
                id="input-repo-url"
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full pl-9 pr-4 py-2 bg-[#eff4ff] text-xs font-mono text-[#0b1c30] rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="input-submission-notes" className="text-xs font-bold text-[#0b1c30]">
              Catatan Khusus Pengerjaan
            </label>
            <textarea
              id="input-submission-notes"
              rows={3}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan untuk dosen, misalnya cara menjalankan program..."
              className="w-full p-3 bg-[#eff4ff] text-xs text-[#0b1c30] rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 leading-relaxed resize-none"
            />
            <div className="flex justify-end text-[11px] text-[#777587]">
              <span>{notes.length} / 500 karakter</span>
            </div>
          </div>
        </div>

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
            Saya menyatakan dengan sungguh-sungguh bahwa berkas tugas ini adalah hasil karya mandiri saya.
          </label>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenHelp}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl hover:bg-[#eff4ff] text-[#464555] text-xs font-semibold transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Butuh Bantuan?</span>
          </button>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            <span>{isUploading ? 'Mengirim...' : 'Kirim Tugas Mandiri'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};