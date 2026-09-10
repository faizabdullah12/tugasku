import { supabase } from './supabase';
import { Profile, SubmissionItem, SubmissionStatus } from '../types';

export interface DashboardData {
  profile: Profile;
  submissions: SubmissionItem[];
}

export interface DosenSubmissionRow extends SubmissionItem {
  studentName: string;
  studentNim: string;
}

export interface DosenDashboardData {
  profile: Profile;
  submissions: DosenSubmissionRow[];
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

export function gradeLetterFromScore(score: number, maxScore: number): string {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  if (pct >= 85) return 'A';
  if (pct >= 75) return 'B';
  if (pct >= 65) return 'C';
  if (pct >= 50) return 'D';
  return 'E';
}

async function getProfile(userId: string): Promise<Profile> {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !data) throw new Error('Profil tidak ditemukan.');
  return data as Profile;
}

function mapSubmission(s: any): SubmissionItem {
  return {
    id: s.id,
    courseName: s.course_name,
    title: s.title,
    description: s.description ?? '',
    deadlineAt: s.deadline_at ?? null,
    submissionCode: s.submission_code,
    fileName: s.file_name,
    filePath: s.file_path,
    fileSize: formatFileSize(s.file_size),
    fileType: s.file_type ?? '',
    sha256Hash: s.sha256_hash ?? null,
    githubUrl: s.github_url ?? null,
    notes: s.notes ?? null,
    status: (s.status as SubmissionStatus) ?? 'menunggu-nilai',
    score: s.score ?? null,
    maxScore: s.max_score ?? 100,
    grade: s.grade ?? null,
    lecturerFeedback: s.lecturer_feedback ?? null,
    reviewedByName: s.reviewer?.name ?? null,
    reviewedAt: s.reviewed_at ?? null,
    submittedAt: s.submitted_at,
  };
}

// ---------- MAHASISWA ----------
export async function loadDashboardData(userId: string): Promise<DashboardData> {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const profile = await getProfile(userId);

  const { data: rows, error } = await supabase
    .from('submissions')
    .select('*, reviewer:reviewed_by(name)')
    .eq('student_id', userId)
    .order('submitted_at', { ascending: false });

  if (error) throw new Error('Gagal memuat riwayat tugas.');

  const submissions: SubmissionItem[] = (rows ?? []).map(mapSubmission);

  return { profile, submissions };
}

export async function createSubmission(params: {
  studentId: string;
  title: string;
  description: string;
  deadlineAt: string | null;
  file: File;
  filePath: string;
  githubUrl: string | null;
  notes: string | null;
}): Promise<void> {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const submissionCode = `TGS-${Date.now()}`;

  const { error } = await supabase.from('submissions').insert({
    student_id: params.studentId,
    title: params.title,
    description: params.description || '',
    deadline_at: params.deadlineAt,
    submission_code: submissionCode,
    file_name: params.file.name,
    file_path: params.filePath,
    file_size: params.file.size,
    file_type: params.file.type,
    github_url: params.githubUrl,
    notes: params.notes,
    status: 'menunggu-nilai',
  });

  if (error) throw new Error(error.message);
}

// ---------- DOSEN ----------
export async function loadDosenDashboardData(userId: string): Promise<DosenDashboardData> {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const profile = await getProfile(userId);

  const { data: rows, error } = await supabase
    .from('submissions')
    .select('*, reviewer:reviewed_by(name), student:student_id(name, nim)')
    .order('submitted_at', { ascending: false });

  if (error) throw new Error('Gagal memuat daftar tugas mahasiswa.');

  const submissions: DosenSubmissionRow[] = (rows ?? []).map((r: any) => ({
    ...mapSubmission(r),
    studentName: r.student?.name ?? '-',
    studentNim: r.student?.nim ?? '-',
  }));

  return { profile, submissions };
}

export async function gradeSubmission(params: {
  submissionId: string;
  dosenId: string;
  score: number;
  maxScore: number;
  feedback: string;
}): Promise<void> {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const grade = gradeLetterFromScore(params.score, params.maxScore);

  const { error } = await supabase
    .from('submissions')
    .update({
      score: params.score,
      max_score: params.maxScore,
      grade,
      lecturer_feedback: params.feedback,
      status: 'dinilai',
      reviewed_by: params.dosenId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', params.submissionId);

  if (error) throw new Error(error.message);
}

export async function getFileSignedUrl(filePath: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.storage.from('submissions').createSignedUrl(filePath, 120);
  if (error || !data) return null;
  return data.signedUrl;
}