import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CalendarDays, CheckCircle2, ChevronDown, ChevronRight, Circle, ClipboardList, Download, Paperclip, Upload, Pencil, Plus, Trash2, X } from 'lucide-react';
import avatar from './img/faiz.jpeg';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'TugasMandiri';
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

interface Task {
  id: string;
  meeting: number;
  title: string;
  course: string;
  deadline: string;
  done: boolean;
  answer?: string;
  file?: { name: string; size: number };
}
type Filter = 'semua' | 'belum' | 'selesai';

const KEY = 'tugasmandiri:tasks';
const MEETINGS = Array.from({ length: 16 }, (_, i) => i + 1);
const SEED: Task[] = [
  { id: 't1', meeting: 1, title: 'Tugas Upload Domain', course: 'Pengembangan Aplikasi Web', deadline: '2026-11-10', done: false },
  { id: 't2', meeting: 2, title: 'Laporan Praktikum Jaringan', course: 'Jaringan Komputer', deadline: '2026-11-07', done: false },
  { id: 't3', meeting: 3, title: 'Resume Bab 3 Basis Data', course: 'Basis Data', deadline: '2026-11-02', done: true },
];

const MAX_MB = 10;
const openDb = () =>
  new Promise<IDBDatabase>((res, rej) => {
    const r = indexedDB.open('tugasmandiri', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('files');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
const idb = async <T,>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>) => {
  const d = await openDb();
  return new Promise<T>((res, rej) => {
    const r = fn(d.transaction('files', mode).objectStore('files'));
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
};
const size = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

function load(): Task[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Task[]).map((t) => ({ ...t, meeting: t.meeting || 1 })) : SEED;
  } catch {
    return SEED;
  }
}
const fmt = (d: string) =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Tanpa tenggat';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(load);
  const [filter, setFilter] = useState<Filter>('semua');
  const [editing, setEditing] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ meeting: 1, title: '', course: '', deadline: '' });
  const [note, setNote] = useState<{ id: string; text: string } | null>(null);
  const [openSet, setOpenSet] = useState<Set<number>>(new Set([1]));
  const [error, setError] = useState('');

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  const counts = useMemo(() => {
    const done = tasks.filter((t) => t.done).length;
    return { semua: tasks.length, belum: tasks.length - done, selesai: done };
  }, [tasks]);

  const inMeeting = (n: number) =>
    tasks
      .filter((t) => t.meeting === n && (filter === 'semua' || (filter === 'selesai' ? t.done : !t.done)))
      .sort((a, b) => Number(a.done) - Number(b.done) || (a.deadline || '9999').localeCompare(b.deadline || '9999'));
  const toggleOpen = (n: number) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n); else next.add(n);
      return next;
    });

  const openForm = (t: Task | null, meeting = 1) => {
    setEditing(t);
    setForm(t ? { meeting: t.meeting, title: t.title, course: t.course, deadline: t.deadline } : { meeting, title: '', course: '', deadline: '' });
    setError('');
    setOpen(true);
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Judul tugas wajib diisi.');
    const data = { meeting: form.meeting, title: form.title.trim(), course: form.course.trim() || 'Umum', deadline: form.deadline };
    setTasks((prev) =>
      editing
        ? prev.map((t) => (t.id === editing.id ? { ...t, ...data } : t))
        : [{ id: crypto.randomUUID(), done: false, ...data }, ...prev]
    );
    setOpenSet((prev) => new Set(prev).add(form.meeting));
    setOpen(false);
  };
  const upload = async (t: Task, f: File) => {
    if (f.size > MAX_MB * 1024 * 1024) return window.alert(`Ukuran berkas maksimal ${MAX_MB} MB.`);
    try {
      await idb('readwrite', (s) => s.put(f, t.id));
      setTasks((p) => p.map((x) => (x.id === t.id ? { ...x, done: true, file: { name: f.name, size: f.size } } : x)));
    } catch {
      window.alert('Gagal menyimpan berkas. Coba lagi.');
    }
  };
  const download = async (t: Task) => {
    try {
      const blob = await idb<Blob | undefined>('readonly', (s) => s.get(t.id));
      if (!blob) return window.alert('Berkas tidak ditemukan di browser ini.');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = t.file?.name ?? 'jawaban'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.alert('Gagal membuka berkas.');
    }
  };
  const removeFile = async (t: Task) => {
    if (!window.confirm(`Hapus berkas jawaban "${t.file?.name}"?`)) return;
    await idb('readwrite', (s) => s.delete(t.id)).catch(() => undefined);
    setTasks((p) => p.map((x) => (x.id === t.id ? { ...x, file: undefined } : x)));
  };
  const saveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;
    const text = note.text.trim();
    setTasks((p) => p.map((x) => (x.id === note.id ? { ...x, answer: text || undefined } : x)));
    setNote(null);
  };
  const toggle = (id: string) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (t: Task) => {
    if (!window.confirm(`Hapus tugas "${t.title}"?`)) return;
    void idb('readwrite', (s) => s.delete(t.id)).catch(() => undefined);
    setTasks((p) => p.filter((x) => x.id !== t.id));
  };

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  const pct = counts.semua ? Math.round((counts.selesai / counts.semua) * 100) : 0;
  const nav: { id: Filter; label: string; icon: React.ReactNode }[] = [
    { id: 'semua', label: 'Semua Tugas', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'belum', label: 'Belum Selesai', icon: <Circle className="w-5 h-5" /> },
    { id: 'selesai', label: 'Selesai', icon: <CheckCircle2 className="w-5 h-5" /> },
  ];
  const field = 'w-full px-3.5 py-2.5 text-sm text-[#221f1a] rounded-md border border-[#ddd2bd]';

  return (
    <div className="min-h-screen md:flex text-[#221f1a]">
      <aside id="app-sidebar" className="hidden md:flex md:w-64 shrink-0 flex-col gap-1 px-4 py-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2.5 px-2 mb-6">
          <span className="w-9 h-9 rounded-lg bg-[#b4492a] text-white grid place-items-center"><BookOpen className="w-5 h-5" /></span>
          <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{APP_NAME}</span>
        </div>
        {nav.map((n) => (
          <button key={n.id} onClick={() => setFilter(n.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left ${filter === n.id ? 'bg-[#f3e1d3] text-[#8f3519] border-l-4 border-[#b4492a]' : 'text-[#5a5446] hover:bg-[#e8dfcd]'}`}>
            {n.icon}<span className="flex-1">{n.label}</span><span className="text-xs">{counts[n.id]}</span>
          </button>
        ))}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header id="app-header" className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 sm:px-8 py-3">
          <div>
            <div className="text-xs text-[#8b8272]">{today}</div>
            <div className="text-sm font-semibold">Daftar Tugas Kuliah</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight hidden sm:block">
              <div className="text-xs font-medium uppercase">Faiz Abdullah Fawaz / 1247050114</div>
              <div className="text-xs text-[#8b8272]">Mahasiswa</div>
            </div>
            <a href="/profile/index.html" title="Lihat profil" aria-label="Lihat profil" className="shrink-0 rounded-full"><img src={avatar} alt="Foto profil" className="w-10 h-10 rounded-full object-cover border border-[#ddd2bd] hover:ring-2 hover:ring-[#b4492a] transition" /></a>
          </div>
        </header>

        <main className="px-4 sm:px-8 py-6 max-w-4xl w-full mx-auto flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl">Tugas Kuliah</h1>
              <p className="text-sm text-[#5a5446] mt-1">Pengembangan Aplikasi Web</p>
            </div>
            <button onClick={() => openForm(null, [...openSet][0] ?? 1)} className="px-4 py-2.5 bg-[#b4492a] text-white text-sm font-bold rounded-md flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tambah Tugas
            </button>
          </div>

          <section className="grid grid-cols-3 gap-3">
            {[['Total', counts.semua], ['Belum Selesai', counts.belum], ['Selesai', counts.selesai]].map(([l, v]) => (
              <div key={l as string} className="bg-white border border-[#e2d7c3] rounded-lg p-4">
                <div className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{v}</div>
                <div className="text-xs text-[#5a5446]">{l}</div>
              </div>
            ))}
            <div className="col-span-3 bg-white border border-[#e2d7c3] rounded-lg p-4">
              <div className="flex justify-between text-xs text-[#5a5446] mb-2"><span>Progres</span><span>{pct}%</span></div>
              <div className="h-2 rounded-full bg-[#efe8da] overflow-hidden"><div className="h-full bg-[#b4492a] transition-all" style={{ width: `${pct}%` }} /></div>
            </div>
          </section>

          <div className="flex gap-2 md:hidden overflow-x-auto">
            {nav.map((n) => (
              <button key={n.id} onClick={() => setFilter(n.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${filter === n.id ? 'bg-[#221f1a] text-white border-[#221f1a]' : 'bg-white text-[#5a5446] border-[#ddd2bd]'}`}>
                {n.label} ({counts[n.id]})
              </button>
            ))}
          </div>

          <section className="flex flex-col gap-3">
            {MEETINGS.map((n) => {
              const all = tasks.filter((t) => t.meeting === n);
              const list = inMeeting(n);
              const isOpen = openSet.has(n);
              const done = all.filter((t) => t.done).length;
              return (
                <div key={n} className={`rounded-xl border border-[#e2d7c3] ${isOpen ? 'bg-white' : 'bg-[#efe8da]'}`}>
                  <button onClick={() => toggleOpen(n)} aria-expanded={isOpen} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span className="flex-1 text-sm font-bold">Pertemuan {n}</span>
                    <span className="text-xs text-[#5a5446]">{all.length ? `${done}/${all.length} selesai` : 'Kosong'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-3 sm:px-4 pb-4 flex flex-col gap-2.5">
                      {list.length === 0 && <p className="text-xs text-[#5a5446] px-1 py-2">{all.length ? 'Tidak ada tugas pada filter ini.' : 'Belum ada tugas di pertemuan ini.'}</p>}
                      {list.map((t) => {
                        const late = !t.done && t.deadline && new Date(t.deadline + 'T23:59:59') < new Date();
                        return (
                          <article key={t.id} className="border border-[#221f1a]/80 rounded-md bg-[#fffdf8]">
                            <div className="flex items-center gap-3 px-3.5 py-3">
                            <button onClick={() => toggle(t.id)} aria-label={t.done ? 'Tandai belum selesai' : 'Tandai selesai'} className="shrink-0 text-[#b4492a]">
                              {t.done ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-semibold truncate ${t.done ? 'line-through text-[#8b8272]' : ''}`}>{t.title}</div>
                              <div className="text-xs text-[#5a5446] flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                                <span>{t.course}</span>
                                <span className={`flex items-center gap-1 ${late ? 'text-[#ba1a1a] font-semibold' : ''}`}><CalendarDays className="w-3.5 h-3.5" />{late ? 'Lewat: ' : ''}{fmt(t.deadline)}</span>
                              </div>
                            </div>
                            <span className="hidden sm:inline text-xs text-[#8b8272]">Tugas</span>
                            <span className={`hidden sm:inline px-2.5 py-1 rounded-full text-[11px] font-bold ${t.done ? 'bg-[#d5f3e6] text-[#006c49]' : 'bg-[#fbe9cc] text-[#885500]'}`}>
                              {t.done ? 'Selesai' : 'Belum Selesai'}
                            </span>
                            <button onClick={() => openForm(t)} aria-label="Edit" className="p-1.5 text-[#5a5446] hover:text-[#b4492a]"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => remove(t)} aria-label="Hapus" className="p-1.5 text-[#5a5446] hover:text-[#ba1a1a]"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 px-3.5 py-2 border-t border-dashed border-[#ddd2bd] text-xs">
                              <Paperclip className="w-3.5 h-3.5 text-[#8b8272]" />
                              {t.file ? (
                                <>
                                  <span className="font-semibold truncate max-w-[14rem]">{t.file.name}</span>
                                  <span className="text-[#8b8272]">{size(t.file.size)}</span>
                                  <button onClick={() => void download(t)} className="ml-auto flex items-center gap-1 font-bold text-[#b4492a]"><Download className="w-3.5 h-3.5" />Unduh</button>
                                  <label className="cursor-pointer font-bold text-[#5a5446]">Ganti<input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void upload(t, f); }} /></label>
                                  <button onClick={() => void removeFile(t)} className="font-bold text-[#ba1a1a]">Hapus</button>
                                </>
                              ) : (
                                <>
                                  <span className="text-[#8b8272]">Belum ada jawaban</span>
                                  <label className="ml-auto cursor-pointer px-3 py-1.5 bg-[#b4492a] text-white font-bold rounded-md flex items-center gap-1.5">
                                    <Upload className="w-3.5 h-3.5" />Unggah jawaban
                                    <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void upload(t, f); }} />
                                  </label>
                                </>
                              )}
                            </div>
                            <div className="px-3.5 py-2.5 border-t border-dashed border-[#ddd2bd] text-xs">
                              {note?.id === t.id ? (
                                <form onSubmit={saveNote} className="flex flex-col gap-2">
                                  <label className="font-bold">Deskripsi jawaban</label>
                                  <textarea autoFocus rows={3} maxLength={1000} value={note.text} onChange={(e) => setNote({ id: t.id, text: e.target.value })}
                                    placeholder="Jelaskan jawabanmu: cara pengerjaan, tautan repo, atau catatan untuk dosen" className="w-full px-3 py-2 text-sm rounded-md border border-[#ddd2bd] resize-none" />
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#8b8272] mr-auto">{note.text.length}/1000</span>
                                    <button type="button" onClick={() => setNote(null)} className="px-3 py-1.5 font-bold text-[#5a5446]">Batal</button>
                                    <button type="submit" className="px-3 py-1.5 bg-[#b4492a] text-white font-bold rounded-md">Simpan</button>
                                  </div>
                                </form>
                              ) : t.answer ? (
                                <div className="flex items-start gap-3">
                                  <p className="flex-1 whitespace-pre-wrap text-[#221f1a] leading-relaxed"><span className="font-bold">Deskripsi: </span>{t.answer}</p>
                                  <button onClick={() => setNote({ id: t.id, text: t.answer ?? '' })} className="font-bold text-[#b4492a] shrink-0">Edit</button>
                                </div>
                              ) : (
                                <button onClick={() => setNote({ id: t.id, text: '' })} className="font-bold text-[#b4492a] flex items-center gap-1.5"><Pencil className="w-3.5 h-3.5" />Tambah deskripsi jawaban</button>
                              )}
                            </div>
                          </article>
                        );
                      })}
                      <button onClick={() => openForm(null, n)} className="self-start mt-1 px-3 py-2 text-xs font-bold text-[#b4492a] border border-dashed border-[#b4492a] rounded-md flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Tambah tugas di Pertemuan {n}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </main>
        <footer className="mt-auto px-4 sm:px-8 py-4 text-xs text-[#5a5446]">© 2026 {APP_NAME} • v{APP_VERSION} • UIN SGD Bandung</footer>
      </div>

      {open && (
        <div className="fixed inset-0 z-20 bg-black/40 grid place-items-center p-4" onClick={() => setOpen(false)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-xl border border-[#e2d7c3] p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg">{editing ? 'Edit Tugas' : 'Tambah Tugas'}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Tutup"><X className="w-5 h-5" /></button>
            </div>
            <label className="text-xs font-bold">Pertemuan</label>
            <select className={field} value={form.meeting} onChange={(e) => setForm({ ...form, meeting: Number(e.target.value) })}>
              {MEETINGS.map((n) => <option key={n} value={n}>Pertemuan {n}</option>)}
            </select>
            <label className="text-xs font-bold">Judul tugas *</label>
            <input autoFocus className={field} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Contoh: Laporan Praktikum" />
            <label className="text-xs font-bold">Mata kuliah</label>
            <input className={field} value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="Contoh: Basis Data" />
            <label className="text-xs font-bold">Tenggat</label>
            <input type="date" className={field} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            {error && <p className="text-xs text-[#ba1a1a]">{error}</p>}
            <button type="submit" className="mt-1 py-2.5 bg-[#b4492a] text-white text-sm font-bold rounded-md">{editing ? 'Simpan Perubahan' : 'Tambah'}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;