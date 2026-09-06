import React, { useState } from 'react';
import { USER_PROFILE } from '../data/mockData';
import { 
  Search, 
  Bell, 
  School, 
  Menu, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  onNavigateToUpload: () => void;
  onNavigateToFeedback: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenMobileMenu,
  onNavigateToUpload,
  onNavigateToFeedback,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: 'Tenggat Tugas 4 mendekat!',
      desc: 'Pemrograman Web (IF3201) tersisa kurang dari 24 jam.',
      time: '10 menit lalu',
      type: 'warning',
      action: onNavigateToUpload,
    },
    {
      id: 'n2',
      title: 'Nilai Tugas 3 telah dipublikasikan',
      desc: 'Nilai 95/100 dirilis oleh Dr. Ir. Hendra Wijaya, M.T.',
      time: '2 jam lalu',
      type: 'success',
      action: onNavigateToFeedback,
    },
    {
      id: 'n3',
      title: 'Turnitin Check Lolos',
      desc: 'Indeks kesamaan dokumen sebesar 3% (Lolos Batas Aman).',
      time: '1 hari lalu',
      type: 'info',
      action: onNavigateToFeedback,
    },
  ];

  return (
    <header 
      id="app-header"
      className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white/85 backdrop-blur-xl border-b border-indigo-100/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex items-center justify-between px-4 sm:px-6 transition-all"
    >
      {/* Left: Mobile Menu & Search Input */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          id="btn-mobile-menu"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[#464555] hover:bg-[#eff4ff] transition-colors"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button / Trigger */}
        <div 
          onClick={onOpenSearch}
          className="relative flex items-center cursor-pointer group"
          role="search"
        >
          <Search className="absolute left-3 text-[#777587] group-hover:text-[#3525cd] w-4 h-4 pointer-events-none transition-colors" />
          <input
            type="text"
            readOnly
            placeholder="Cari tugas, modul, berkas... (Ctrl+K)"
            className="bg-[#eff4ff] pl-9 pr-4 py-1.5 rounded-xl text-[#0b1c30] placeholder:text-[#777587] text-xs sm:text-sm w-44 sm:w-72 lg:w-80 border border-transparent focus:border-indigo-300 focus:outline-none transition-all cursor-pointer select-none"
          />
          <span className="hidden sm:inline-block absolute right-2.5 px-1.5 py-0.5 rounded bg-white text-[10px] font-mono text-[#777587] shadow-2xs border border-indigo-100">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right: Semester Badge, Notifications, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Semester Pill Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff4ff] text-[#3525cd] text-xs font-bold border border-indigo-100/80">
          <School className="w-3.5 h-3.5" />
          <span>{USER_PROFILE.semester}</span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            id="btn-notification-bell"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-full hover:bg-[#eff4ff] text-[#464555] hover:text-[#0b1c30] transition-colors"
            aria-label="Pemberitahuan"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-indigo-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-indigo-50 flex items-center justify-between">
                <span className="font-bold text-sm text-[#0b1c30]">Notifikasi Terbaru</span>
                <span className="text-[11px] font-semibold text-[#3525cd] bg-indigo-50 px-2 py-0.5 rounded-full">
                  3 Baru
                </span>
              </div>
              <div className="divide-y divide-indigo-50/60 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      item.action();
                      setShowNotifications(false);
                    }}
                    className="p-3 hover:bg-[#eff4ff] transition-colors cursor-pointer flex gap-3 items-start"
                  >
                    <div className="mt-0.5">
                      {item.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-[#885500]" />
                      ) : item.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#3525cd]" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-xs font-bold text-[#0b1c30] truncate">{item.title}</span>
                      <span className="text-[11px] text-[#464555] leading-snug line-clamp-2 mt-0.5">{item.desc}</span>
                      <span className="text-[10px] text-[#777587] mt-1">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-2 border-t border-indigo-50 text-center">
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-[#3525cd] hover:underline"
                >
                  Tandai Semua Sudah Dibaca
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <button
            id="btn-user-profile-menu"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-1 sm:pl-2 py-1 rounded-xl hover:bg-[#eff4ff] transition-colors"
            aria-label="Menu Pengguna"
          >
            <img
              alt="Profile Nadia Savitri"
              className="w-8 h-8 rounded-full object-cover ring-1.5 ring-indigo-200"
              src={USER_PROFILE.avatarUrl}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#0b1c30] leading-tight">
                {USER_PROFILE.name}
              </span>
              <span className="text-[11px] text-[#464555] leading-tight">
                NIM {USER_PROFILE.nim}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#777587] hidden sm:block" />
          </button>

          {/* Profile Menu Popover */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-indigo-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 bg-[#eff4ff] rounded-xl mb-1">
                <p className="font-bold text-xs text-[#0b1c30]">{USER_PROFILE.name}</p>
                <p className="text-[11px] text-[#464555] font-mono mt-0.5">NIM {USER_PROFILE.nim}</p>
                <p className="text-[11px] text-[#3525cd] font-semibold mt-1">{USER_PROFILE.major}</p>
              </div>
              <div className="space-y-0.5 text-xs font-semibold text-[#464555]">
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors text-left"
                >
                  <User className="w-4 h-4 text-[#777587]" />
                  <span>Biodata Mahasiswa</span>
                </button>
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert('Sesi demo aktif. Anda masuk sebagai Nadia Savitri.');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 text-[#ba1a1a] transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-[#ba1a1a]" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
