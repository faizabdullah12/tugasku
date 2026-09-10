import React, { useState, useEffect } from 'react';
import { ActiveTab, SubmissionItem } from './types';
import type { DashboardData, DosenDashboardData } from './lib/data';
import { loadDashboardData, loadDosenDashboardData } from './lib/data';
import { supabase } from './lib/supabase';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { UploadView } from './components/UploadView';
import { ReceiptView } from './components/ReceiptView';
import { EvaluationView } from './components/EvaluationView';
import { LoginView } from './components/LoginView';
import { DosenDashboardView } from './components/DosenDashboardView';
import {
  SearchModal,
  MessageModal,
  HelpModal,
  SettingsModal
} from './components/Modals';
import {
  LayoutDashboard,
  UploadCloud,
  History,
  Award,
  CheckCircle2
} from 'lucide-react';

export function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [dosenData, setDosenData] = useState<DosenDashboardData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | undefined>();
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setDataError(null);
    try {
      if (!supabase) throw new Error('Supabase belum dikonfigurasi. Buat file .env.local dari .env.example.');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoggedIn(false);
        setData(null);
        setDosenData(null);
        return;
      }
      setIsLoggedIn(true);

      const { data: profileRow, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profileRow) throw new Error('Profil tidak ditemukan.');

      if (profileRow.role === 'dosen') {
        setDosenData(await loadDosenDashboardData(user.id));
        setData(null);
        setActiveTab('dosen-dashboard');
      } else {
        setData(await loadDashboardData(user.id));
        setDosenData(null);
        setActiveTab('dashboard');
      }
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Data tidak dapat dimuat.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Keyboard shortcut for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectSubmissionFromSearch = (submission: SubmissionItem) => {
    setSelectedSubmissionId(submission.id);
    if (submission.status === 'dinilai') {
      setActiveTab('nilai-feedback');
    } else {
      setActiveTab('riwayat-pengiriman');
    }
  };

  const handleUploadSuccess = () => {
    showToast('Tugas berhasil dikirim!');
    setSelectedSubmissionId(undefined);
    void loadData();
    setActiveTab('riwayat-pengiriman');
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    setIsLoggedIn(false);
    setData(null);
    setDosenData(null);
  };

  // ---------- LOADING ----------
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[#464555]">
        Memuat data dari Supabase...
      </div>
    );
  }

  // ---------- BELUM LOGIN ----------
  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={() => void loadData()} />;
  }

  // ---------- ERROR (setelah login tapi data gagal dimuat) ----------
  if (dataError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700">
          {dataError}
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD DOSEN ----------
  if (dosenData) {
    return <DosenDashboardView dosenData={dosenData} onLogout={handleLogout} onRefresh={() => void loadData()} />;
  }

  if (!data) {
    return null;
  }

  const selectedSubmission = data.submissions.find((s) => s.id === selectedSubmissionId) ?? null;
  const latestReceipt = selectedSubmission ?? data.submissions[0] ?? null;
  const gradedSubmissions = data.submissions.filter((s) => s.status === 'dinilai');
  const selectedEvaluation =
    (selectedSubmission?.status === 'dinilai' ? selectedSubmission : null) ?? gradedSubmissions[0] ?? null;

  // ---------- DASHBOARD MAHASISWA ----------
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#006c49] text-white rounded-2xl shadow-xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Desktop & Drawer Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        profile={data.profile}
      />

      {/* Top Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenMobileMenu={() => setIsOpenMobile(true)}
        onNavigateToUpload={() => setActiveTab('unggah-tugas')}
        onNavigateToFeedback={() => setActiveTab('nilai-feedback')}
        onLogout={handleLogout}
        profile={data.profile}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 lg:ml-64 pt-20 pb-20 lg:pb-12 px-4 sm:px-6 md:px-8 transition-all">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateToUpload={() => setActiveTab('unggah-tugas')}
            onNavigateToEvaluation={(id) => {
              setSelectedSubmissionId(id);
              setActiveTab('nilai-feedback');
            }}
            onNavigateToReceipt={(id) => {
              setSelectedSubmissionId(id);
              setActiveTab('riwayat-pengiriman');
            }}
            submissions={data.submissions}
            profile={data.profile}
          />
        )}

        {activeTab === 'unggah-tugas' && (
          <UploadView
            studentId={data.profile.id}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onSubmitSuccess={handleUploadSuccess}
            onOpenHelp={() => setHelpOpen(true)}
          />
        )}

        {activeTab === 'riwayat-pengiriman' && (
          <ReceiptView
            onBackToDashboard={() => setActiveTab('dashboard')}
            submission={latestReceipt}
          />
        )}

        {activeTab === 'nilai-feedback' && (
          <EvaluationView
            onBackToDashboard={() => setActiveTab('dashboard')}
            onOpenMessageModal={() => setMessageOpen(true)}
            submission={selectedEvaluation}
            history={gradedSubmissions}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (for native mobile feel) */}
      <nav
        id="mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-t border-indigo-100/70 z-40 flex items-center justify-around px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
            activeTab === 'dashboard' ? 'text-[#3525cd] font-bold' : 'text-[#777587]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('unggah-tugas')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
            activeTab === 'unggah-tugas' ? 'text-[#3525cd] font-bold' : 'text-[#777587]'
          }`}
        >
          <UploadCloud className="w-5 h-5" />
          <span className="text-[10px]">Unggah</span>
        </button>

        <button
          onClick={() => setActiveTab('riwayat-pengiriman')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
            activeTab === 'riwayat-pengiriman' ? 'text-[#3525cd] font-bold' : 'text-[#777587]'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px]">Riwayat</span>
        </button>

        <button
          onClick={() => setActiveTab('nilai-feedback')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
            activeTab === 'nilai-feedback' ? 'text-[#3525cd] font-bold' : 'text-[#777587]'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px]">Nilai</span>
        </button>
      </nav>

      {/* Global Dialog Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectSubmission={handleSelectSubmissionFromSearch}
        submissions={data.submissions}
      />

      <MessageModal
        isOpen={messageOpen}
        onClose={() => setMessageOpen(false)}
      />

      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default App;