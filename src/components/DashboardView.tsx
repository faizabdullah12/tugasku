import React, { useState } from 'react';
import { TaskItem } from '../types';
import { MOCK_TASKS, COURSES } from '../data/mockData';
import { 
  Calendar, 
  Clock, 
  Timer, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  FileText, 
  ShieldCheck, 
  MessageSquareQuote,
  Filter,
  ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateToUpload: (taskId?: string) => void;
  onNavigateToEvaluation: (taskId?: string) => void;
  onNavigateToReceipt: (taskId?: string) => void;
  selectedCourseFilter: string;
  setSelectedCourseFilter: (code: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToUpload,
  onNavigateToEvaluation,
  onNavigateToReceipt,
  selectedCourseFilter,
  setSelectedCourseFilter,
}) => {
  const [activeTableTab, setActiveTableTab] = useState<'all' | 'urgent' | 'pending' | 'submitted'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [calendarMonth, setCalendarMonth] = useState<'current' | 'next'>('current');

  // Filter tasks based on course filter & table status tab
  const filteredTasks = MOCK_TASKS.filter((task) => {
    if (selectedCourseFilter !== 'all' && task.courseCode !== selectedCourseFilter) {
      return false;
    }
    if (activeTableTab === 'urgent') {
      return task.isUrgent || (task.daysRemaining && task.daysRemaining <= 3);
    }
    if (activeTableTab === 'pending') {
      return task.status === 'belum-dikumpul' || task.status === 'draf';
    }
    if (activeTableTab === 'submitted') {
      return task.status === 'menunggu-nilai' || task.status === 'dinilai';
    }
    return true;
  });

  const urgentTasks = MOCK_TASKS.filter((t) => t.isUrgent || (t.daysRemaining && t.daysRemaining <= 3));

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* TOP BANNER & URGENT ALERT HERO */}
      <section 
        id="hero-banner"
        className="relative overflow-hidden rounded-2xl bg-[#eff4ff] p-6 sm:p-8 shadow-xs border border-indigo-100/70"
      >
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#3525cd]/5 blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-20 w-64 h-64 rounded-full bg-[#885500]/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2dfff] text-[#0f0069] text-xs font-bold">
                <Calendar className="w-3.5 h-3.5" />
                Kamis, 24 Oktober 2024
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#dce9ff] text-[#464555] text-xs font-semibold">
                Minggu Akademik 8
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0b1c30] tracking-tight mt-1">
              Halo, Nadia Savitri! 👋
            </h1>
            <p className="text-sm sm:text-base text-[#464555] leading-relaxed">
              Kamu memiliki <strong className="text-[#0b1c30] font-bold">3 tugas aktif</strong> pekan ini. Satu tugas penting membutuhkan perhatianmu sebelum besok malam.
            </p>
          </div>

          {/* Urgent Deadline Countdown Card */}
          <div 
            id="urgent-deadline-card"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-amber-200/80 min-w-full sm:min-w-[360px] lg:min-w-[380px]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#ffddb8] flex items-center justify-center text-[#2a1700] flex-shrink-0 shadow-xs">
              <Timer className="w-6 h-6 text-[#885500]" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] uppercase tracking-wider text-[#684000] font-extrabold">
                  Tenggat Terdekat
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-[11px] font-bold animate-pulse">
                  23j 45m lagi
                </span>
              </div>
              <span className="text-sm sm:text-base font-bold text-[#0b1c30] truncate mt-0.5">
                Tugas 4: REST API &amp; Auth
              </span>
              <span className="text-xs text-[#464555]">
                IF3201 • Besok, 23:59 WIB
              </span>
            </div>
            <button
              id="btn-urgent-serahkan"
              onClick={() => onNavigateToUpload('tugas-4-web')}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#3525cd] hover:bg-[#4f46e5] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all text-center flex-shrink-0 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Serahkan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* METRIC KPI STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Perlu Dikerjakan */}
        <div 
          onClick={() => setActiveTableTab('pending')}
          className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100/80 flex flex-col justify-between hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464555]">Perlu Dikerjakan</span>
            <span className="w-8 h-8 rounded-xl bg-[#ffddb8]/70 text-[#2a1700] flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-[#885500]" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30]">3</span>
            <span className="text-xs text-[#464555]">tugas aktif</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[#653e00]">
            <span className="w-2 h-2 rounded-full bg-[#684000] animate-ping" />
            <span className="text-xs font-bold">1 tugas deadline &lt; 24 jam</span>
          </div>
        </div>

        {/* Card 2: Menunggu Penilaian */}
        <div 
          onClick={() => setActiveTableTab('submitted')}
          className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100/80 flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464555]">Menunggu Penilaian</span>
            <span className="w-8 h-8 rounded-xl bg-[#d3e4fe] text-[#3525cd] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#3525cd]" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30]">2</span>
            <span className="text-xs text-[#464555]">berkas terkirim</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[#464555]">
            <span className="w-2 h-2 rounded-full bg-[#3525cd]" />
            <span className="text-xs font-medium">Estimasi nilai: 27 Okt</span>
          </div>
        </div>

        {/* Card 3: Selesai & Dinilai */}
        <div 
          onClick={() => onNavigateToEvaluation('tugas-3-web')}
          className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100/80 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464555]">Selesai &amp; Dinilai</span>
            <span className="w-8 h-8 rounded-xl bg-[#6ffbbe]/70 text-[#002113] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30]">12</span>
            <span className="text-xs text-[#464555]">total tugas tuntas</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[#006c49]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">100% tepat waktu</span>
          </div>
        </div>

        {/* Card 4: Indeks Prestasi Tugas */}
        <div 
          onClick={() => onNavigateToEvaluation('tugas-3-web')}
          className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100/80 flex flex-col justify-between hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464555]">Indeks Prestasi Tugas</span>
            <span className="w-8 h-8 rounded-xl bg-[#e2dfff] text-[#0f0069] flex items-center justify-center">
              <Award className="w-4 h-4 text-[#3525cd]" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-[#3525cd]">88.5</span>
            <span className="text-xs text-[#464555]">/ 100</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-bold text-[#006c49]">Predikat A (Sangat Memuaskan)</span>
            <svg className="w-14 h-4" fill="none" viewBox="0 0 50 12">
              <path 
                className="text-[#006c49]" 
                d="M1 10C8 8 16 11 24 6C32 1 40 5 49 2" 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeWidth="2.5" 
              />
            </svg>
          </div>
        </div>
      </section>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 8 COLS: Urgent Action Cards + Task Table */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          {/* SECTION: TUGAS MENDATANG & MENDESAK (CARDS) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#684000]" />
                <h2 className="text-lg font-bold text-[#0b1c30]">
                  Tugas Mendatang &amp; Mendesak
                </h2>
              </div>
              <span className="text-xs text-[#464555]">Prioritas berdasarkan tenggat</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Urgent Card 1: REST API */}
              <div className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col justify-between gap-4 hover:shadow-md transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#684000]" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#3525cd] text-xs font-bold">
                      IF3201 • Pemrograman Web
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-[11px] font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#684000] animate-ping" />
                      Tersisa 1 Hari
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0b1c30] mb-1">
                    Tugas 4: REST API &amp; Auth JWT
                  </h3>
                  <p className="text-xs text-[#464555] line-clamp-2 leading-relaxed">
                    Implementasikan sistem otentikasi berbasis token JWT lengkap dengan Refresh Token dan Middleware Authorization role-based.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-3 bg-[#eff4ff] -mx-5 -mb-5 p-4 rounded-b-2xl border-t border-indigo-100/60">
                  <div className="flex items-center justify-between text-xs text-[#464555]">
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      Dr. Ir. Hendra Wijaya, M.T.
                    </span>
                    <span className="font-bold text-[#3525cd]">Bobot 15%</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[#684000] font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      25 Okt 2024, 23:59 WIB
                    </span>
                    <button
                      onClick={() => onNavigateToUpload('tugas-4-web')}
                      className="px-3.5 py-1.5 bg-[#3525cd] hover:bg-[#4f46e5] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Sekarang</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Urgent Card 2: SRS & UML */}
              <div className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col justify-between gap-4 hover:shadow-md transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#3525cd]" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#006c49] text-xs font-bold">
                      IF3204 • Rekayasa P. Lunak
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-[#464555] text-[11px] font-semibold">
                      Tersisa 3 Hari
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0b1c30] mb-1">
                    Dokumen SRS &amp; Diagram UML
                  </h3>
                  <p className="text-xs text-[#464555] line-clamp-2 leading-relaxed">
                    Penyusunan dokumen Software Requirements Specification IEEE format 830 berserta Use Case, Activity, dan Class diagram.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-3 bg-[#eff4ff] -mx-5 -mb-5 p-4 rounded-b-2xl border-t border-indigo-100/60">
                  <div className="flex items-center justify-between text-xs text-[#464555]">
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      Siti Nurhaliza, S.T., M.Kom.
                    </span>
                    <span className="font-bold text-[#3525cd]">Bobot 20%</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[#464555] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      27 Okt 2024, 18:00 WIB
                    </span>
                    <button
                      onClick={() => onNavigateToUpload('tugas-srs-rpl')}
                      className="px-3.5 py-1.5 bg-[#d3e4fe] hover:bg-[#c3c0ff] text-[#0b1c30] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#3525cd]" />
                      <span>Buka Draf</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: TABEL DAFTAR TUGAS DENGAN FILTER */}
          <div className="flex flex-col gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-indigo-100">
            {/* Header & Tabs */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0b1c30]">Daftar Semua Tugas</h2>
                  <p className="text-xs text-[#464555]">Pantau seluruh status penugasan semester ini</p>
                </div>

                {/* Filter Mata Kuliah Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#464555]">Mata Kuliah:</span>
                  <div className="relative">
                    <select
                      id="select-course-filter"
                      value={selectedCourseFilter}
                      onChange={(e) => setSelectedCourseFilter(e.target.value)}
                      className="appearance-none bg-[#eff4ff] pl-3 pr-8 py-1.5 rounded-xl text-[#0b1c30] text-xs font-bold border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 cursor-pointer"
                    >
                      <option value="all">Semua Mata Kuliah (5)</option>
                      {COURSES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} - {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tab Bar Navigation Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  id="tab-filter-all"
                  onClick={() => setActiveTableTab('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
                    activeTableTab === 'all'
                      ? 'bg-[#3525cd] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#464555] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span>Semua Tugas</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTableTab === 'all' ? 'bg-white/20' : 'bg-indigo-100 text-[#3525cd]'}`}>
                    17
                  </span>
                </button>

                <button
                  id="tab-filter-urgent"
                  onClick={() => setActiveTableTab('urgent')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
                    activeTableTab === 'urgent'
                      ? 'bg-[#684000] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#464555] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#684000]" />
                  <span>Mendesak (&lt; 3 Hari)</span>
                  <span className="text-[10px] font-bold">2</span>
                </button>

                <button
                  id="tab-filter-pending"
                  onClick={() => setActiveTableTab('pending')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
                    activeTableTab === 'pending'
                      ? 'bg-[#3525cd] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#464555] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span>Belum Dikumpulkan</span>
                  <span className="text-[10px] font-bold">3</span>
                </button>

                <button
                  id="tab-filter-submitted"
                  onClick={() => setActiveTableTab('submitted')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
                    activeTableTab === 'submitted'
                      ? 'bg-[#006c49] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#464555] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />
                  <span>Sudah Dikumpulkan</span>
                  <span className="text-[10px] font-bold">14</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-[#eff4ff] text-[#464555] text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3 rounded-l-xl">Mata Kuliah &amp; Judul Tugas</th>
                    <th className="py-3 px-3">Batas Waktu</th>
                    <th className="py-3 px-3">Format Berkas</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 rounded-r-xl text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50/70 text-xs">
                  {filteredTasks.slice(0, 4).map((task) => (
                    <tr key={task.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                      {/* Course and Title */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-[#0b1c30]">
                            {task.title}
                          </span>
                          <span className="text-xs text-[#464555] mt-0.5">
                            {task.courseCode} • {task.courseName}
                          </span>
                        </div>
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`font-bold flex items-center gap-1 ${task.isUrgent ? 'text-[#684000]' : 'text-[#0b1c30]'}`}>
                            <Calendar className="w-3 h-3 text-[#777587]" />
                            {task.deadlineText}
                          </span>
                          <span className="text-[11px] text-[#464555]">
                            {task.deadlineDate}
                          </span>
                        </div>
                      </td>

                      {/* File Format */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#dce9ff] font-mono text-[11px] font-bold text-[#0b1c30]">
                            {task.fileFormat}
                          </span>
                          <span className="text-[#464555] text-xs">
                            {task.maxSize}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {task.status === 'belum-dikumpul' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffddb8] text-[#2a1700] text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#684000]" />
                            Belum Dikumpul
                          </span>
                        )}
                        {task.status === 'draf' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dce9ff] text-[#464555] text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#777587]" />
                            Draf Tersimpan
                          </span>
                        )}
                        {task.status === 'menunggu-nilai' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff4ff] text-[#3525cd] text-[11px] font-bold">
                            <Clock className="w-3 h-3 text-[#3525cd]" />
                            Menunggu Nilai
                          </span>
                        )}
                        {task.status === 'dinilai' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6ffbbe]/60 text-[#002113] text-[11px] font-extrabold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#006c49]" />
                            Nilai: {task.score}/{task.maxScore}
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        {task.status === 'belum-dikumpul' && (
                          <button
                            onClick={() => onNavigateToUpload(task.id)}
                            className="px-3.5 py-1.5 bg-[#3525cd] hover:bg-[#4f46e5] text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1 active:scale-95"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Kirim</span>
                          </button>
                        )}
                        {task.status === 'draf' && (
                          <button
                            onClick={() => onNavigateToUpload(task.id)}
                            className="px-3.5 py-1.5 bg-[#dce9ff] text-[#0b1c30] rounded-xl text-xs font-bold hover:bg-[#c3c0ff] transition-all inline-flex items-center gap-1 active:scale-95"
                          >
                            <span>Lanjutkan</span>
                          </button>
                        )}
                        {task.status === 'menunggu-nilai' && (
                          <button
                            onClick={() => onNavigateToReceipt(task.id)}
                            className="p-2 text-[#464555] hover:text-[#3525cd] rounded-lg hover:bg-[#eff4ff] transition-colors"
                            title="Lihat Bukti Pengiriman"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {task.status === 'dinilai' && (
                          <button
                            onClick={() => onNavigateToEvaluation(task.id)}
                            className="px-3 py-1.5 bg-[#eff4ff] text-[#3525cd] rounded-xl text-xs font-bold hover:bg-[#dce9ff] transition-all inline-flex items-center gap-1 active:scale-95"
                          >
                            <span>Rubrik</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2 text-[#464555] text-xs">
              <span>Menampilkan {filteredTasks.slice(0, 4).length} dari 17 tugas terdaftar</span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-1 rounded-lg hover:bg-[#eff4ff] disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${currentPage === 1 ? 'bg-[#3525cd] text-white' : 'hover:bg-[#eff4ff]'}`}>
                  1
                </span>
                <button
                  onClick={() => setCurrentPage(2)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${currentPage === 2 ? 'bg-[#3525cd] text-white' : 'hover:bg-[#eff4ff]'}`}
                >
                  2
                </button>
                <button
                  disabled={currentPage === 2}
                  onClick={() => setCurrentPage(2)}
                  className="p-1 rounded-lg hover:bg-[#eff4ff] disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: Mini Calendar & Study Timeline Widgets */}
        <div className="lg:col-span-4 flex flex-col gap-6 min-w-0">
          {/* MINI DEADLINE CALENDAR WIDGET */}
          <div 
            id="mini-calendar-widget"
            className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#3525cd]" />
                <h3 className="text-sm font-bold text-[#0b1c30]">
                  {calendarMonth === 'current' ? 'Oktober 2024' : 'November 2024'}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCalendarMonth('current')}
                  className="p-1 rounded-full hover:bg-[#eff4ff] text-[#464555]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCalendarMonth('next')}
                  className="p-1 rounded-full hover:bg-[#eff4ff] text-[#464555]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
              <span className="text-[#777587] py-1 text-[11px]">Sen</span>
              <span className="text-[#777587] py-1 text-[11px]">Sel</span>
              <span className="text-[#777587] py-1 text-[11px]">Rab</span>
              <span className="text-[#777587] py-1 text-[11px]">Kam</span>
              <span className="text-[#777587] py-1 text-[11px]">Jum</span>
              <span className="text-[#777587] py-1 text-[11px]">Sab</span>
              <span className="text-[#777587] py-1 text-[11px]">Min</span>

              {/* Week 3 */}
              <span className="py-2 text-[#c7c4d8]">20</span>
              <span className="py-2 text-[#0b1c30]">21</span>
              <span className="py-2 text-[#0b1c30]">22</span>
              <span className="py-2 text-[#0b1c30]">23</span>

              {/* 24: Hari Ini */}
              <div className="relative py-2 flex items-center justify-center font-bold text-white bg-[#3525cd] rounded-xl shadow-xs">
                <span>24</span>
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#ffddb8]" />
              </div>

              {/* 25: Deadline REST API */}
              <div 
                onClick={() => onNavigateToUpload('tugas-4-web')}
                className="relative py-2 flex items-center justify-center font-bold text-[#2a1700] bg-[#ffddb8] rounded-xl cursor-pointer hover:ring-2 hover:ring-amber-400"
                title="Tugas 4: REST API Deadline"
              >
                <span>25</span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ba1a1a]" />
              </div>

              <span className="py-2 text-[#0b1c30]">26</span>

              {/* Week 4 */}
              {/* 27: Deadline SRS */}
              <div 
                onClick={() => onNavigateToUpload('tugas-srs-rpl')}
                className="relative py-2 flex items-center justify-center font-bold text-[#002113] bg-[#6ffbbe] rounded-xl cursor-pointer hover:ring-2 hover:ring-emerald-400"
                title="SRS Software Deadline"
              >
                <span>27</span>
              </div>
              <span className="py-2 text-[#0b1c30]">28</span>
              <span className="py-2 text-[#0b1c30]">29</span>
              <span className="py-2 text-[#0b1c30]">30</span>
              <span className="py-2 text-[#0b1c30]">31</span>
              <span className="py-2 text-[#c7c4d8]">1</span>
              <span className="py-2 text-[#c7c4d8]">2</span>
            </div>

            {/* Agenda Pekan Ini */}
            <div className="flex flex-col gap-2 pt-2 border-t border-indigo-50">
              <span className="text-[11px] uppercase tracking-wider text-[#464555] font-bold">
                Agenda Pekan Ini
              </span>
              <div 
                onClick={() => onNavigateToUpload('tugas-4-web')}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#684000] mt-1.5 flex-shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#0b1c30] truncate">
                    Tugas 4: REST API (IF3201)
                  </span>
                  <span className="text-[11px] text-[#464555]">
                    Jumat, 25 Okt • 23:59
                  </span>
                </div>
              </div>

              <div 
                onClick={() => onNavigateToUpload('tugas-srs-rpl')}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#006c49] mt-1.5 flex-shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#0b1c30] truncate">
                    Dokumen SRS Software (IF3204)
                  </span>
                  <span className="text-[11px] text-[#464555]">
                    Minggu, 27 Okt • 18:00
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT FEEDBACK & INSTRUCTOR REMARKS */}
          <div className="p-5 bg-white rounded-2xl shadow-xs border border-indigo-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-[#006c49]" />
                <h3 className="text-sm font-bold text-[#0b1c30]">
                  Catatan Dosen Terkini
                </h3>
              </div>
              <button
                onClick={() => onNavigateToEvaluation('tugas-3-web')}
                className="text-xs text-[#3525cd] hover:underline font-bold"
              >
                Semua
              </button>
            </div>

            {/* Review Card 1 */}
            <div className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#3525cd] font-bold">Kecerdasan Buatan</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#6ffbbe] text-[#002113] font-black">
                  95/100
                </span>
              </div>
              <p className="text-xs text-[#0b1c30] italic leading-relaxed">
                “Struktur pruning alpha-beta rapi dan penjelasan analisis kompleksitas sangat komprehensif. Kerja bagus!”
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] text-[#464555]">
                <span>Prof. Bambang Riyanto</span>
                <span>2 hari lalu</span>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="p-3.5 bg-[#eff4ff] rounded-xl flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#3525cd] font-bold">Basis Data Lanjut</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#dce9ff] text-[#0b1c30] font-black">
                  82/100
                </span>
              </div>
              <p className="text-xs text-[#0b1c30] italic leading-relaxed">
                “Indexing B-Tree tepat sasaran, namun dokumentasi query execution plan pada PostgreSQL perlu diperjelas.”
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] text-[#464555]">
                <span>Dr. Rina Wulandari</span>
                <span>18 Okt 2024</span>
              </div>
            </div>
          </div>

          {/* ACADEMIC INTEGRITY BANNER */}
          <div className="p-5 bg-gradient-to-br from-[#4f46e5] to-[#3525cd] rounded-2xl text-white flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold">Pemeriksaan Anti-Plagiarisme</span>
              <span className="text-[11px] text-[#dad7ff] leading-snug mt-0.5">
                Seluruh dokumen terunggah dipindai otomatis via Turnitin universitas.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
