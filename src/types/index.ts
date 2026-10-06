export type UserRole = 'FACULTY' | 'STUDENT';

export interface UserSession {
  token: string;
  tokenType: string;
  userId: number;
  username: string;
  fullName: string;
  role: UserRole;
  studentProfileId?: number;
  rollNumber?: string;
  department?: string;
}

export interface Student {
  id: number;
  rollNumber: string;
  name: string;
  department: 'CSE' | 'AIDS';
  semester: number;
  section: string;
  attendance: number;
  averageMarks: number;
  math: number;
  programming: number;
  dbms: number;
  collegeFeePaid: number;
  collegeFeeTotal: number;
  examFeePaid: number;
  examFeeTotal: number;
}

export interface DashboardStats {
  totalStudents: number;
  avgAttendance: number;
  avgMarks: number;
  defaultersCount: number;
  feesPendingK: number;
  deptStats: {
    CSE: { attendance: number; marks: number };
    AIDS: { attendance: number; marks: number };
  };
  topPerformers: {
    name: string;
    rollNumber: string;
    department: string;
    section: string;
    marks: number;
  }[];
  defaultersList: {
    id: number;
    name: string;
    rollNumber: string;
    department: string;
    section: string;
    attendance: number;
  }[];
}

export interface TimetableSlot {
  id: number;
  time: string;
  subject: string;
  instructor: string;
  room: string;
  isBreak?: boolean;
}

export interface MockTestDoc {
  id: number;
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Receipt {
  id: number;
  receiptNumber: string;
  studentName: string;
  rollNumber: string;
  feeType: string;
  amount: number;
  method: string;
  date: string;
  status: string;
}

export type AccentColor = 'teal' | 'emerald' | 'blue' | 'purple' | 'orange';
