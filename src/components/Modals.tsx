import React, { useState } from 'react';
import { ActiveTab, TaskItem } from '../types';
import { MOCK_TASKS, LECTURER_DATA } from '../data/mockData';
import { 
  X, 
  Search, 
  Upload, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Settings, 
  Scale, 
  MessageSquare,
  FileArchive,
  AlertCircle
} from 'lucide-react';

// SEARCH MODAL
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTask: (task: TaskItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTask,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredTasks = MOCK_TASKS.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.courseName.toLowerCase().includes(query.toLowerCase()) ||
      t.courseCode.toLowerCase().includes(query.toLowerCase()) ||
      t.lecturer.toLowerCase().includes(query.toLowerCase())
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
            placeholder="Cari tugas, kode mata kuliah, dosen..."
            className="flex-1 text-sm text-[#0b1c30] placeholder:text-[#777587] focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-[#777587]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#777587]">
              Tidak ada tugas yang cocok dengan pencarian &quot;{query}&quot;
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => {
                  onSelectTask(task);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-[#eff4ff] cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0b1c30]">{task.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-[#3525cd] font-semibold">
                      {task.courseCode}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#464555] block mt-0.5">
                    {task.courseName} • Dosen: {task.lecturer}
                  </span>
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

// REVISION MODAL
interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRevision: () => void;
}

export const RevisionModal: React.FC<RevisionModalProps> = ({
  isOpen,
  onClose,
  onSubmitRevision,
}) => {
  const [revisionNotes, setRevisionNotes] = useState('');
  const [hasFile, setHasFile] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRevision();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-50">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#3525cd]" />
            <h3 className="text-base font-extrabold text-[#0b1c30]">Ajukan Revisi Berkas</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-[#777587]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div className="p-3 bg-[#eff4ff] rounded-xl text-[#464555] leading-relaxed">
            Pengajuan revisi sebelum <strong className="text-[#0b1c30]">25 Okt 2024 23:59 WIB</strong> akan otomatis menggantikan berkas Versi 1 tanpa penalti nilai. Kesempatan revisi tersisa: <strong className="text-[#3525cd]">2 kali</strong>.
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-[#0b1c30]">Unggah Berkas Pengganti (.ZIP / .PDF)</span>
            <label className="border-2 border-dashed border-indigo-200 rounded-xl p-4 text-center cursor-pointer hover:bg-[#eff4ff] transition-colors flex flex-col items-center">
              <FileArchive className="w-8 h-8 text-[#3525cd] mb-1" />
              <span className="font-bold text-[#0b1c30]">
                {hasFile ? '210401089_NadiaSavitri_Tugas4_v2.zip' : 'Klik untuk memilih berkas revisi baru'}
              </span>
              <span className="text-[10px] text-[#777587] mt-0.5">Maksimal 50 MB</span>
              <input
                type="file"
                className="hidden"
                onChange={() => setHasFile(true)}
              />
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[#0b1c30]">Alasan &amp; Ringkasan Perbaikan</label>
            <textarea
              required
              rows={3}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="Contoh: 'Memperbaiki bug otentikasi role pada endpoint /admin dan menambahkan 2 test case baru.'"
              className="p-2.5 bg-[#eff4ff] rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-indigo-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl hover:bg-[#eff4ff] text-[#464555] font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white font-bold shadow-xs active:scale-95"
            >
              Kirimkan Revisi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// DISPUTE MODAL (SANGGAHAN NILAI)
interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({ isOpen, onClose }) => {
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-50">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#3525cd]" />
            <h3 className="text-base font-extrabold text-[#0b1c30]">Ajukan Sanggahan Nilai</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-[#777587]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center gap-2 text-xs">
            <CheckCircle2 className="w-10 h-10 text-[#006c49]" />
            <span className="font-bold text-sm text-[#0b1c30]">Sanggahan Berhasil Terkirim!</span>
            <span className="text-[#464555]">
              Permohonan Anda diteruskan kepada Dosen Dr. Ir. Hendra Wijaya, M.T. Estimasi verifikasi 1-2 hari kerja.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            <div className="p-3 bg-[#eff4ff] rounded-xl text-[#464555] leading-relaxed">
              Tugas: <strong className="text-[#0b1c30]">Tugas 3: Database Relasional &amp; Migrasi</strong> • Nilai Sekarang: <strong className="text-[#3525cd]">95 / 100 (Grade A)</strong>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#0b1c30]">Kriteria Rubrik yang Disanggah</label>
              <select className="p-2.5 bg-[#eff4ff] rounded-xl border border-indigo-100 focus:outline-none">
                <option>03. Query Kompleks &amp; Relasi (28/30)</option>
                <option>04. Dokumentasi ERD &amp; Laporan (22/25)</option>
                <option>Lainnya</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#0b1c30]">Argumen Teknis &amp; Bukti Pengerjaan</label>
              <textarea
                required
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan alasan teknis permohonan peninjauan nilai beserta baris kode atau referensi dokumen..."
                className="p-2.5 bg-[#eff4ff] rounded-xl border border-indigo-100 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-indigo-50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl hover:bg-[#eff4ff] text-[#464555] font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white font-bold shadow-xs active:scale-95"
              >
                Kirimkan Permohonan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// MESSAGE LECTURER MODAL
interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-50">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#3525cd]" />
            <h3 className="text-base font-extrabold text-[#0b1c30]">Kirim Pesan ke Dosen</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-[#777587]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="p-6 text-center flex flex-col items-center gap-2 text-xs">
            <CheckCircle2 className="w-8 h-8 text-[#006c49]" />
            <span className="font-bold text-[#0b1c30]">Pesan Terkirim Langsung!</span>
            <span className="text-[#464555]">Notifikasi telah diteruskan ke portal dosen.</span>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex flex-col gap-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-[#eff4ff] rounded-xl">
              <img
                src={LECTURER_DATA.avatarUrl}
                alt="Dosen"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-indigo-200"
              />
              <div className="flex flex-col">
                <span className="font-bold text-[#0b1c30]">{LECTURER_DATA.name}</span>
                <span className="text-[11px] text-[#464555]">{LECTURER_DATA.role}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#0b1c30]">Isi Pesan / Pertanyaan</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Selamat pagi Pak Hendra, izin bertanya mengenai saran indexing pada kriteria query Tugas 3..."
                className="p-2.5 bg-[#eff4ff] rounded-xl border border-indigo-100 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-indigo-50">
              <button
                type="button"
                onClick={onClose}
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
            <span className="font-bold block mb-1">Bagaimana cara mengunggah berkas revisi?</span>
            <p className="text-[#464555] leading-relaxed">
              Anda dapat membuka menu <strong>Riwayat Pengiriman</strong> dan menekan tombol <strong>Ajukan Revisi Berkas</strong>. Revisi sebelum tenggat waktu tidak dikenakan pengurangan nilai.
            </p>
          </div>

          <div className="p-3 bg-[#eff4ff] rounded-xl">
            <span className="font-bold block mb-1">Berapa batas ukuran maksimal file?</span>
            <p className="text-[#464555] leading-relaxed">
              Batas ukuran maksimal per pengiriman tugas adalah <strong>50 MB</strong> dalam format ZIP, RAR, atau PDF.
            </p>
          </div>

          <div className="p-3 bg-[#eff4ff] rounded-xl">
            <span className="font-bold block mb-1">Apa fungsi Checksum SHA-256 pada bukti terima?</span>
            <p className="text-[#464555] leading-relaxed">
              Checksum SHA-256 merupakan sidik jari kriptografi unik untuk membuktikan keaslian berkas tugas yang Anda kumpulkan agar terbebas dari sengketa waktu atau integritas file.
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
  const [notifyDeadline, setNotifyDeadline] = useState(true);
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
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 bg-[#eff4ff] rounded-xl cursor-pointer">
                <span className="font-semibold text-[#0b1c30]">Pengingat Tenggat Waktu (24 Jam &amp; 3 Jam)</span>
                <input
                  type="checkbox"
                  checked={notifyDeadline}
                  onChange={(e) => setNotifyDeadline(e.target.checked)}
                  className="w-4 h-4 text-[#3525cd] rounded"
                />
              </label>
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
