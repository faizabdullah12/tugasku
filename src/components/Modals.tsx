import React, { useState } from 'react';
import { SubmissionItem } from '../types';
import {
  X,
  Search,
  Send,
  CheckCircle2,
  HelpCircle,
  Settings,
  MessageSquare,
  Clock
} from 'lucide-react';

// SEARCH MODAL
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubmission: (submission: SubmissionItem) => void;
  submissions: SubmissionItem[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSubmission,
  submissions,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = submissions.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.courseName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-indigo-50">
          <Search className="w-5 h-5 text-[#3525cd]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul tugas..."
            className="flex-1 text-sm text-[#0b1c30] placeholder:text-[#777587] focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-[#777587]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#777587]">
              Tidak ada tugas yang cocok dengan pencarian &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((submission) => (
              <div
                key={submission.id}
                onClick={() => {
                  onSelectSubmission(submission);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-[#eff4ff] cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0b1c30]">{submission.title}</span>
                    {submission.status === 'dinilai' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold">
                        {submission.score}/{submission.maxScore}
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold">
                        Menunggu
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#464555] block mt-0.5">{submission.courseName}</span>
                </div>
                <span className="text-xs font-bold text-[#3525cd]">Buka →</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// MESSAGE MODAL (kirim pesan ke dosen)
interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setSent(false);
    setMessage('');
    onClose();
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-50">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#3525cd]" />
            <h3 className="text-base font-extrabold text-[#0b1c30]">Kirim Pesan ke Dosen</h3>
          </div>
          <button onClick={handleClose} className="p-1 rounded-lg hover:bg-slate-100 text-[#777587]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="p-6 text-center flex flex-col items-center gap-2 text-xs">
            <CheckCircle2 className="w-8 h-8 text-[#006c49]" />
            <span className="font-bold text-[#0b1c30]">Pesan Tersimpan!</span>
            <span className="text-[#464555]">Catatanmu akan terlihat bersama tugas terkait.</span>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#0b1c30]">Isi Pesan / Pertanyaan</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pertanyaan seputar nilai atau feedback tugas ini..."
                className="p-2.5 bg-[#eff4ff] rounded-xl border border-indigo-100 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-indigo-50">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl hover:bg-[#eff4ff] text-[#464555] font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white font-bold shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirimkan Pesan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// HELP CENTER MODAL
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-50">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#3525cd]" />
            <h3 className="text-base font-extrabold text-[#0b1c30]">Pusat Bantuan TugasMandiri</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-[#777587]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#0b1c30] max-h-80 overflow-y-auto pr-1">
          <div className="p-3 bg-[#eff4ff] rounded-xl">
            <span className="font-bold block mb-1">Bagaimana cara mengunggah tugas?</span>
            <p className="text-[#464555] leading-relaxed">
              Buka menu <strong>Unggah Tugas</strong>, isi judul dan deskripsi tugas yang kamu kerjakan, lalu unggah berkasnya. Tidak perlu menunggu tugas dibuat oleh dosen terlebih dahulu.
            </p>
          </div>

          <div className="p-3 bg-[#eff4ff] rounded-xl">
            <span className="font-bold block mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#885500]" /> Apakah bisa revisi setelah dinilai?
            </span>
            <p className="text-[#464555] leading-relaxed">
              Tidak. Setiap tugas hanya bisa dikirim satu kali dan tidak dapat direvisi setelah dosen memberi nilai. Pastikan berkas sudah final sebelum dikirim.
            </p>
          </div>

          <div className="p-3 bg-[#eff4ff] rounded-xl">
            <span className="font-bold block mb-1">Bagaimana cara melihat nilai?</span>
            <p className="text-[#464555] leading-relaxed">
              Buka menu <strong>Nilai &amp; Feedback</strong> untuk melihat skor dan catatan dosen pada tugas yang sudah dinilai.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-indigo-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#3525cd] text-white text-xs font-bold hover:bg-[#4f46e5]"
          >
            Tutup Bantuan
          </button>
        </div>
      </div>
    </div>
  );
};

// SETTINGS MODAL
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [notifyGrade, setNotifyGrade] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#3525cd]" />
            <h3 className="text-base font-extrabold text-[#0b1c30]">Pengaturan Akun &amp; Portal</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-[#777587]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <span className="font-bold text-[#0b1c30] block mb-2">Preferensi Notifikasi</span>
            <label className="flex items-center justify-between p-3 bg-[#eff4ff] rounded-xl cursor-pointer">
              <span className="font-semibold text-[#0b1c30]">Notifikasi Nilai &amp; Feedback Rilis</span>
              <input
                type="checkbox"
                checked={notifyGrade}
                onChange={(e) => setNotifyGrade(e.target.checked)}
                className="w-4 h-4 text-[#3525cd] rounded"
              />
            </label>
          </div>

          <div>
            <span className="font-bold text-[#0b1c30] block mb-1">Zona Waktu Sistem</span>
            <div className="p-3 bg-[#eff4ff] rounded-xl font-mono text-[#464555]">
              Asia/Jakarta (WIB • UTC+07:00)
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-indigo-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#3525cd] text-white text-xs font-bold hover:bg-[#4f46e5]"
          >
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};