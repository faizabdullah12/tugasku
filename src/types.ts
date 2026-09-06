export type ActiveTab = 'dashboard' | 'unggah-tugas' | 'riwayat-pengiriman' | 'nilai-feedback';

export interface TaskItem {
  id: string;
  courseCode: string;
  courseName: string;
  courseColor: 'primary' | 'secondary' | 'tertiary' | 'purple';
  title: string;
  description: string;
  lecturer: string;
  deadlineText: string;
  deadlineDate: string;
  deadlineTime: string;
  isUrgent?: boolean;
  urgentText?: string;
  daysRemaining?: number;
  weight: number;
  fileFormat: string;
  maxSize: string;
  status: 'belum-dikumpul' | 'draf' | 'menunggu-nilai' | 'dinilai';
  statusLabel: string;
  score?: number;
  maxScore?: number;
  grade?: string;
  submittedAt?: string;
}

export interface SubmissionReceipt {
  id: string;
  submissionId: string;
  taskTitle: string;
  courseName: string;
  courseCode: string;
  uploadedAt: string;
  punctualityStatus: string;
  punctualityNote: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  sha256Hash: string;
  githubUrl: string;
  notes: string;
  version: string;
  revisionAttemptsLeft: number;
  lecturerName: string;
  weight: string;
}

export interface RubricItem {
  id: string;
  number: string;
  title: string;
  score: number;
  maxScore: number;
  badgeText: string;
  badgeType: 'emerald' | 'amber' | 'indigo';
  description: string;
  percentage: number;
}
