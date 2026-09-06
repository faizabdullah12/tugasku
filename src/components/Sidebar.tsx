import React from 'react';
import { ActiveTab } from '../types';
import { USER_PROFILE } from '../data/mockData';
import { 
  LayoutDashboard, 
  UploadCloud, 
  History, 
  Award, 
  HelpCircle, 
  Settings, 
  X,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCourseFilter: string;
  setSelectedCourseFilter: (code: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedCourseFilter,
  setSelectedCourseFilter,
  isOpenMobile,
  setIsOpenMobile,
  onOpenHelp,
  onOpenSettings,
}) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard Tugas', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'unggah-tugas', label: 'Unggah Tugas', icon: <UploadCloud className="w-5 h-5" /> },
    { id: 'riwayat-pengiriman', label: 'Riwayat Pengiriman', icon: <History className="w-5 h-5" /> },
    { id: 'nilai-feedback', label: 'Nilai & Feedback', icon: <Award className="w-5 h-5" /> },
  ];

  const courses = [
    { code: 'IF3201', name: 'Pemrograman Web', dotColor: 'bg-[#3525cd]' },
    { code: 'IF3204', name: 'Rekayasa Perangkat Lunak', dotColor: 'bg-[#006c49]' },
    { code: 'IF3208', name: 'Basis Data Lanjut', dotColor: 'bg-[#684000]' },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  const handleCourseFilterClick = (courseCode: string) => {
    if (selectedCourseFilter === courseCode) {
      setSelectedCourseFilter('all');
    } else {
      setSelectedCourseFilter(courseCode);
    }
    setActiveTab('dashboard');
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside 
        id="app-sidebar"
        className={`fixed left-0 top-0 h-screen w-64 bg-[#eff4ff] z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between bg-white/70 backdrop-blur-sm border-b border-indigo-100/60">
            <div className="flex items-center gap-2.5">
              <img 
                alt="TugasMandiri Logo" 
                className="h-8 w-auto object-contain rounded-md" 
                src={USER_PROFILE.logoUrl}
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-bold text-[#3525cd] text-base leading-tight tracking-tight flex items-center gap-1">
                  TugasMandiri
                </span>
                <span className="text-[11px] font-semibold text-[#464555] tracking-wide">
                  Portal Akademik
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              className="lg:hidden p-1.5 rounded-lg text-[#464555] hover:bg-white transition-colors"
              onClick={() => setIsOpenMobile(false)}
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Utama Section */}
          <div className="px-4 pt-4">
            <span className="text-[11px] font-bold text-[#464555] uppercase tracking-wider px-2 block mb-1">
              Menu Utama
            </span>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-btn-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all text-left ${
                      isActive 
                        ? 'bg-[#4f46e5] text-white shadow-sm shadow-indigo-300/40' 
                        : 'text-[#464555] hover:bg-[#dce9ff] hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-[#464555]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Mata Kuliah Aktif Section */}
          <div className="px-4 pt-6">
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[11px] font-bold text-[#464555] uppercase tracking-wider">
                Mata Kuliah Aktif
              </span>
              {selectedCourseFilter !== 'all' && (
                <button 
                  onClick={() => setSelectedCourseFilter('all')}
                  className="text-[10px] text-[#3525cd] font-semibold hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <nav className="flex flex-col gap-1">
              {courses.map((course) => {
                const isSelected = selectedCourseFilter === course.code;
                return (
                  <button
                    key={course.code}
                    id={`course-filter-${course.code}`}
                    onClick={() => handleCourseFilterClick(course.code)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all text-left group ${
                      isSelected 
                        ? 'bg-[#dce9ff] text-[#0b1c30] font-bold ring-1 ring-[#3525cd]/30' 
                        : 'text-[#464555] hover:bg-[#dce9ff]/60 hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${course.dotColor} flex-shrink-0 group-hover:scale-125 transition-transform`} />
                    <span className="truncate">{course.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Quick Links */}
        <div className="p-4 border-t border-indigo-100/50">
          <nav className="flex flex-col gap-1">
            <button
              id="btn-help-center"
              onClick={onOpenHelp}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#464555] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors text-left"
            >
              <HelpCircle className="w-4 h-4 text-[#777587]" />
              <span>Pusat Bantuan</span>
            </button>
            <button
              id="btn-app-settings"
              onClick={onOpenSettings}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#464555] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-[#777587]" />
              <span>Pengaturan</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};
