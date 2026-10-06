import axios from 'axios';
import { UserSession, DashboardStats, Student, TimetableSlot, MockTestDoc, Receipt } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: async (username: string, password?: string, role?: string): Promise<UserSession> => {
    const res = await api.post('/auth/login', { username, password, role });
    return res.data;
  },
};

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },
};

export const studentApi = {
  getAll: async (params?: { department?: string; search?: string }): Promise<Student[]> => {
    const res = await api.get('/students', { params });
    return res.data;
  },
  getById: async (idOrRoll: string | number): Promise<Student> => {
    const res = await api.get(`/students/${idOrRoll}`);
    return res.data;
  },
  update: async (idOrRoll: string | number, data: { name?: string; attendance?: number }): Promise<Student> => {
    const res = await api.put(`/students/${idOrRoll}`, data);
    return res.data;
  },
  updateMarks: async (idOrRoll: string | number, marks: { math?: number; programming?: number; dbms?: number }): Promise<Student> => {
    const res = await api.put(`/marks/${idOrRoll}`, marks);
    return res.data;
  },
};

export const timetableApi = {
  getSlots: async (day: string): Promise<TimetableSlot[]> => {
    const res = await api.get('/timetable', { params: { day } });
    return res.data;
  },
};

export const feeApi = {
  pay: async (data: { rollNumber: string; feeType: 'college' | 'exam'; amount: number; method: string }): Promise<{ success: boolean; student: Student; receipt: Receipt }> => {
    const res = await api.post('/fees/pay', data);
    return res.data;
  },
  getReceipts: async (rollNumber?: string): Promise<Receipt[]> => {
    const res = await api.get('/receipts', { params: { rollNumber } });
    return res.data;
  },
};

export const mockTestApi = {
  getAll: async (): Promise<MockTestDoc[]> => {
    const res = await api.get('/mock-tests');
    return res.data;
  },
  upload: async (data: { title: string; fileName: string; fileSize?: string }): Promise<MockTestDoc> => {
    const res = await api.post('/mock-tests', data);
    return res.data;
  },
};

export default api;
