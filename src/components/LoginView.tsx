import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';
import { GraduationCap, Loader2 } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

// Email internal tetap, tidak pernah ditampilkan ke user
const ROLE_EMAIL: Record<UserRole, string> = {
  mahasiswa: 'mahasiswa@tugasmandiri.internal',
  dosen: 'dosen@tugasmandiri.internal',
};

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [role, setRole] = useState<UserRole>('mahasiswa');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      setError('Supabase belum dikonfigurasi. Cek file .env.local.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: ROLE_EMAIL[role],
        password,
      });
      if (error) throw error;
      onLoginSuccess();
    } catch (err) {
      setError('Password salah. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <GraduationCap className="w-7 h-7 text-[#3525cd]" />
          <span className="font-bold text-xl text-[#3525cd]">TugasMandiri</span>
        </div>

        {/* Role Switch */}
        <div className="grid grid-cols-2 gap-2 mb-6 bg-[#eff4ff] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setRole('mahasiswa'); setPassword(''); setError(null); }}
            className={`py-2 rounded-lg text-sm font-bold transition-colors ${
              role === 'mahasiswa' ? 'bg-white text-[#3525cd] shadow-sm' : 'text-[#464555]'
            }`}
          >
            Mahasiswa
          </button>
          <button
            type="button"
            onClick={() => { setRole('dosen'); setPassword(''); setError(null); }}
            className={`py-2 rounded-lg text-sm font-bold transition-colors ${
              role === 'dosen' ? 'bg-white text-[#3525cd] shadow-sm' : 'text-[#464555]'
            }`}
          >
            Dosen
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Masukkan Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="px-4 py-2.5 rounded-xl border border-indigo-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
          />

          {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#4f46e5] text-white text-sm font-bold hover:bg-[#4338ca] transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Masuk sebagai {role === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'}
          </button>
        </form>
      </div>
    </div>
  );
};