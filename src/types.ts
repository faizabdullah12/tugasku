export type UserRole = 'mahasiswa' | 'dosen';

export type ActiveTab =
  | 'dashboard'
  | 'unggah-tugas'
  | 'riwayat-pengiriman'
  | 'nilai-feedback'
  | 'dosen-dashboard';

export interface Profile {
  id: string;
  name: string;
  nim: string | null;
  major: string | null;
  semester: string | null;
  academic_week: number;
  avatar_url: string | null;
  logo_url: string | null;
  role: UserRole;
}

export const DEFAULT_COURSE_NAME = 'Pengembangan Aplikasi dan Web';

export type SubmissionStatus = 'menunggu-nilai' | 'dinilai';

export interface SubmissionItem {
  id: string;
  courseName: string;
  title: string;
  description: string;
  deadlineAt: string | null;
  submissionCode: string;
  fileName: string;
  filePath: string;
  fileSize: string;
  fileType: string;
  sha256Hash: string | null;
  githubUrl: string | null;
  notes: string | null;
  status: SubmissionStatus;
  score: number | null;
  maxScore: number;
  grade: string | null;
  lecturerFeedback: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  submittedAt: string;
}