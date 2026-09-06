import React, { useState, useEffect } from 'react';
import { ActiveTab, TaskItem } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { UploadView } from './components/UploadView';
import { ReceiptView } from './components/ReceiptView';
import { EvaluationView } from './components/EvaluationView';
import { 
  SearchModal, 
  RevisionModal, 
  DisputeModal, 
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
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const handleSelectTaskFromSearch = (task: TaskItem) => {
    if (task.status === 'dinilai') {
      setActiveTab('nilai-feedback');
    } else if (task.status === 'menunggu-nilai') {
      setActiveTab('riwayat-pengiriman');
    } else {
      setActiveTab('unggah-tugas');
    }
  };

  const handleUploadSuccess = () => {
    showToast('Tugas berhasil dikirim dan diverifikasi dengan Checksum SHA-256!');
    setActiveTab('riwayat-pengiriman');
  };

  const handleRevisionSuccess = () => {
    showToast('Berkas revisi Versi 2 berhasil diunggah!');
  };

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
        selectedCourseFilter={selectedCourseFilter}
        setSelectedCourseFilter={setSelectedCourseFilter}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Top Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenMobileMenu={() => setIsOpenMobile(true)}
        onNavigateToUpload={() => setActiveTab('unggah-tugas')}
        onNavigateToFeedback={() => setActiveTab('nilai-feedback')}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 lg:ml-64 pt-20 pb-20 lg:pb-12 px-4 sm:px-6 md:px-8 transition-all">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateToUpload={(taskId) => {
              setActiveTab('unggah-tugas');
            }}
            onNavigateToEvaluation={(taskId) => {
              setActiveTab('nilai-feedback');
            }}
            onNavigateToReceipt={(taskId) => {
              setActiveTab('riwayat-pengiriman');
            }}
            selectedCourseFilter={selectedCourseFilter}
            setSelectedCourseFilter={setSelectedCourseFilter}
          />
        )}

        {activeTab === 'unggah-tugas' && (
          <UploadView
            onBackToDashboard={() => setActiveTab('dashboard')}
            onSubmitSuccess={handleUploadSuccess}
            onOpenHelp={() => setHelpOpen(true)}
          />
        )}

        {activeTab === 'riwayat-pengiriman' && (
          <ReceiptView
            onBackToDashboard={() => setActiveTab('dashboard')}
            onOpenRevisionModal={() => setRevisionOpen(true)}
          />
        )}

        {activeTab === 'nilai-feedback' && (
          <EvaluationView
            onBackToDashboard={() => setActiveTab('dashboard')}
            onOpenDisputeModal={() => setDisputeOpen(true)}
            onOpenMessageModal={() => setMessageOpen(true)}
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
        onSelectTask={handleSelectTaskFromSearch}
      />

      <RevisionModal
        isOpen={revisionOpen}
        onClose={() => setRevisionOpen(false)}
        onSubmitRevision={handleRevisionSuccess}
      />

      <DisputeModal
        isOpen={disputeOpen}
        onClose={() => setDisputeOpen(false)}
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
