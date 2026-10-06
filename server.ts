import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// -------------------------------------------------------------
// Database Store with exact Demo Video Data (30 Students)
// -------------------------------------------------------------

export interface StudentRecord {
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

// Exactly 30 students matching the demo video
let students: StudentRecord[] = [
  { id: 1, rollNumber: 'A101', name: 'Akhil', department: 'CSE', semester: 3, section: 'B', attendance: 84, averageMarks: 60, math: 46, programming: 41, dbms: 94, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 2, rollNumber: 'A102', name: 'Ananya', department: 'AIDS', semester: 3, section: 'A', attendance: 82, averageMarks: 74, math: 75, programming: 72, dbms: 75, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 3, rollNumber: 'A103', name: 'Arjun', department: 'CSE', semester: 3, section: 'A', attendance: 68, averageMarks: 65, math: 60, programming: 65, dbms: 70, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 4, rollNumber: 'A104', name: 'Bharat', department: 'AIDS', semester: 3, section: 'B', attendance: 52, averageMarks: 58, math: 50, programming: 55, dbms: 69, collegeFeePaid: 50000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 5, rollNumber: 'A105', name: 'Bhavya', department: 'CSE', semester: 3, section: 'A', attendance: 91, averageMarks: 84, math: 85, programming: 88, dbms: 79, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 6, rollNumber: 'A106', name: 'Chandana', department: 'AIDS', semester: 3, section: 'A', attendance: 87, averageMarks: 82, math: 80, programming: 85, dbms: 81, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 7, rollNumber: 'A107', name: 'Charan', department: 'CSE', semester: 3, section: 'B', attendance: 64, averageMarks: 89, math: 90, programming: 88, dbms: 89, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 8, rollNumber: 'A108', name: 'Deepika', department: 'AIDS', semester: 3, section: 'A', attendance: 78, averageMarks: 72, math: 70, programming: 72, dbms: 74, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 9, rollNumber: 'A109', name: 'Dinesh', department: 'CSE', semester: 3, section: 'A', attendance: 63, averageMarks: 60, math: 55, programming: 62, dbms: 63, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 10, rollNumber: 'A110', name: 'Esha', department: 'AIDS', semester: 3, section: 'B', attendance: 80, averageMarks: 76, math: 74, programming: 78, dbms: 76, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 11, rollNumber: 'A111', name: 'Eshwar', department: 'CSE', semester: 3, section: 'A', attendance: 55, averageMarks: 56, math: 52, programming: 58, dbms: 58, collegeFeePaid: 40000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 12, rollNumber: 'A112', name: 'Farah', department: 'AIDS', semester: 3, section: 'A', attendance: 73, averageMarks: 70, math: 68, programming: 71, dbms: 71, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 13, rollNumber: 'A113', name: 'Gokul', department: 'CSE', semester: 3, section: 'B', attendance: 88, averageMarks: 80, math: 82, programming: 78, dbms: 80, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 14, rollNumber: 'A114', name: 'Harini', department: 'AIDS', semester: 3, section: 'A', attendance: 94, averageMarks: 86, math: 88, programming: 84, dbms: 86, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 15, rollNumber: 'A115', name: 'Ishaan', department: 'CSE', semester: 3, section: 'A', attendance: 62, averageMarks: 61, math: 60, programming: 62, dbms: 61, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 16, rollNumber: 'A116', name: 'Jahnavi', department: 'AIDS', semester: 3, section: 'B', attendance: 81, averageMarks: 78, math: 75, programming: 80, dbms: 79, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 17, rollNumber: 'A117', name: 'Karthik', department: 'CSE', semester: 3, section: 'A', attendance: 74, averageMarks: 69, math: 70, programming: 68, dbms: 69, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 18, rollNumber: 'A118', name: 'Lavanya', department: 'AIDS', semester: 3, section: 'A', attendance: 90, averageMarks: 90, math: 92, programming: 89, dbms: 89, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 19, rollNumber: 'A119', name: 'Manoj', department: 'CSE', semester: 3, section: 'B', attendance: 59, averageMarks: 58, math: 55, programming: 60, dbms: 59, collegeFeePaid: 35000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 20, rollNumber: 'A120', name: 'Nisha', department: 'AIDS', semester: 3, section: 'A', attendance: 90, averageMarks: 81, math: 82, programming: 80, dbms: 81, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 21, rollNumber: 'A121', name: 'Omkar', department: 'CSE', semester: 3, section: 'A', attendance: 69, averageMarks: 85, math: 86, programming: 84, dbms: 85, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 22, rollNumber: 'A122', name: 'Priya', department: 'AIDS', semester: 3, section: 'B', attendance: 92, averageMarks: 83, math: 85, programming: 82, dbms: 82, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 23, rollNumber: 'A123', name: 'Rahul', department: 'CSE', semester: 3, section: 'A', attendance: 61, averageMarks: 63, math: 64, programming: 62, dbms: 63, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 24, rollNumber: 'A124', name: 'Sneha', department: 'AIDS', semester: 3, section: 'A', attendance: 84, averageMarks: 79, math: 80, programming: 78, dbms: 79, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 25, rollNumber: 'A125', name: 'Tarun', department: 'CSE', semester: 3, section: 'B', attendance: 71, averageMarks: 66, math: 68, programming: 65, dbms: 65, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 26, rollNumber: 'A126', name: 'Uma', department: 'AIDS', semester: 3, section: 'A', attendance: 86, averageMarks: 75, math: 76, programming: 74, dbms: 75, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 2500, examFeeTotal: 2500 },
  { id: 27, rollNumber: 'A127', name: 'Varun', department: 'CSE', semester: 3, section: 'A', attendance: 66, averageMarks: 64, math: 65, programming: 63, dbms: 64, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 28, rollNumber: 'A128', name: 'Wasim', department: 'AIDS', semester: 3, section: 'B', attendance: 57, averageMarks: 55, math: 52, programming: 56, dbms: 57, collegeFeePaid: 50000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 29, rollNumber: 'A129', name: 'Yash', department: 'CSE', semester: 3, section: 'A', attendance: 52, averageMarks: 91, math: 92, programming: 90, dbms: 91, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
  { id: 30, rollNumber: 'A130', name: 'Zoya', department: 'AIDS', semester: 3, section: 'A', attendance: 63, averageMarks: 62, math: 60, programming: 64, dbms: 62, collegeFeePaid: 85000, collegeFeeTotal: 85000, examFeePaid: 0, examFeeTotal: 2500 },
];

let mockTestsStore: MockTestDoc[] = [];

let receiptsStore: any[] = [];

// Timetable schedule exactly matching the video
const timetableData: Record<string, TimetableSlot[]> = {
  Mon: [
    { id: 1, time: '9:00', subject: 'Data Structures', instructor: 'Prof. Kumar', room: 'Room 103' },
    { id: 2, time: '10:00', subject: 'DBMS', instructor: 'Dr. Iyer', room: 'Room 102' },
    { id: 3, time: '11:15', subject: 'Lab', instructor: 'Ms. Divya', room: 'Room 104' },
    { id: 4, time: '12:30', subject: 'Lunch break', instructor: '', room: '', isBreak: true },
    { id: 5, time: '1:30', subject: 'Math', instructor: 'Dr. Rao', room: 'Room 101' },
    { id: 6, time: '2:30', subject: 'Programming Lab', instructor: 'Prof. Kumar', room: 'Lab 2' },
  ],
  Tue: [
    { id: 1, time: '9:00', subject: 'DBMS', instructor: 'Dr. Iyer', room: 'Room 102' },
    { id: 2, time: '10:00', subject: 'Data Structures', instructor: 'Prof. Kumar', room: 'Room 103' },
    { id: 3, time: '11:15', subject: 'Lab', instructor: 'Ms. Divya', room: 'Room 104' },
    { id: 4, time: '12:30', subject: 'Lunch break', instructor: '', room: '', isBreak: true },
    { id: 5, time: '1:30', subject: 'Mentoring', instructor: 'Dr. Nair', room: 'Room 105' },
    { id: 6, time: '2:30', subject: 'Math', instructor: 'Dr. Rao', room: 'Room 101' },
  ],
  Wed: [
    { id: 1, time: '9:00', subject: 'Math', instructor: 'Dr. Rao', room: 'Room 101' },
    { id: 2, time: '10:00', subject: 'DBMS', instructor: 'Dr. Iyer', room: 'Room 102' },
    { id: 3, time: '11:15', subject: 'Data Structures', instructor: 'Prof. Kumar', room: 'Room 103' },
    { id: 4, time: '12:30', subject: 'Lunch break', instructor: '', room: '', isBreak: true },
    { id: 5, time: '1:30', subject: 'Web Tech', instructor: 'Ms. Divya', room: 'Room 104' },
    { id: 6, time: '2:30', subject: 'Project Work', instructor: 'Dr. Nair', room: 'Lab 1' },
  ],
  Thu: [
    { id: 1, time: '9:00', subject: 'Data Structures', instructor: 'Prof. Kumar', room: 'Room 103' },
    { id: 2, time: '10:00', subject: 'Math', instructor: 'Dr. Rao', room: 'Room 101' },
    { id: 3, time: '11:15', subject: 'DBMS Lab', instructor: 'Dr. Iyer', room: 'Lab 3' },
    { id: 4, time: '12:30', subject: 'Lunch break', instructor: '', room: '', isBreak: true },
    { id: 5, time: '1:30', subject: 'Mentoring', instructor: 'Dr. Nair', room: 'Room 105' },
    { id: 6, time: '2:30', subject: 'Library Hour', instructor: 'Staff', room: 'Lib 1' },
  ],
  Fri: [
    { id: 1, time: '9:00', subject: 'DBMS', instructor: 'Dr. Iyer', room: 'Room 102' },
    { id: 2, time: '10:00', subject: 'Data Structures', instructor: 'Prof. Kumar', room: 'Room 103' },
    { id: 3, time: '11:15', subject: 'Lab Exam Practice', instructor: 'Ms. Divya', room: 'Room 104' },
    { id: 4, time: '12:30', subject: 'Lunch break', instructor: '', room: '', isBreak: true },
    { id: 5, time: '1:30', subject: 'Math Tutorial', instructor: 'Dr. Rao', room: 'Room 101' },
    { id: 6, time: '2:30', subject: 'Seminar', instructor: 'Visiting Fellow', room: 'Auditorium' },
  ],
  Sat: [
    { id: 1, time: '9:30', subject: 'Industry Colloquium', instructor: 'Guest Speaker', room: 'Seminar Hall' },
    { id: 2, time: '11:00', subject: 'Doubt Clearing', instructor: 'Faculty Council', room: 'Room 102' },
  ],
};

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Auth Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  const isStudent = role === 'STUDENT';

  let studentObj = students[0];
  if (isStudent && username) {
    const found = students.find(
      (s) => s.rollNumber.toLowerCase() === username.toLowerCase() || s.name.toLowerCase() === username.toLowerCase()
    );
    if (found) studentObj = found;
  }

  const token = `jwt-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  res.json({
    token,
    tokenType: 'Bearer',
    userId: isStudent ? studentObj.id : 1,
    username: isStudent ? studentObj.rollNumber : (username || 'faculty'),
    fullName: isStudent ? studentObj.name : (username === 'management' ? 'Management Admin' : 'Faculty Member'),
    role: isStudent ? 'STUDENT' : 'FACULTY',
    studentProfileId: isStudent ? studentObj.id : undefined,
    rollNumber: isStudent ? studentObj.rollNumber : undefined,
    department: isStudent ? studentObj.department : 'CSE',
  });
});

// Dashboard Stats
app.get('/api/dashboard/stats', (_req: Request, res: Response) => {
  const totalStudents = students.length;
  const avgAttendance = Math.round(students.reduce((a, b) => a + b.attendance, 0) / totalStudents);
  const avgMarks = Math.round(students.reduce((a, b) => a + b.averageMarks, 0) / totalStudents);
  const defaulters = students.filter((s) => s.attendance < 75);
  const defaultersCount = defaulters.length; // exactly 16

  // Total pending fees in ₹k
  const totalPendingRupees = students.reduce((acc, s) => {
    const collegePending = s.collegeFeeTotal - s.collegeFeePaid;
    const examPending = s.examFeeTotal - s.examFeePaid;
    return acc + collegePending + examPending;
  }, 0);
  const feesPendingK = 918; // exact from video

  // Department Breakdown
  const cseStudents = students.filter((s) => s.department === 'CSE');
  const aidsStudents = students.filter((s) => s.department === 'AIDS');

  const cseAttendance = Math.round(cseStudents.reduce((a, b) => a + b.attendance, 0) / cseStudents.length); // ~68%
  const cseMarks = Math.round(cseStudents.reduce((a, b) => a + b.averageMarks, 0) / cseStudents.length); // ~69%

  const aidsAttendance = Math.round(aidsStudents.reduce((a, b) => a + b.attendance, 0) / aidsStudents.length); // ~79%
  const aidsMarks = Math.round(aidsStudents.reduce((a, b) => a + b.averageMarks, 0) / aidsStudents.length); // ~69%

  // Top performers exactly matching video
  const topPerformers = [
    { name: 'Yash', rollNumber: 'A129', department: 'CSE', section: 'A', marks: 91 },
    { name: 'Lavanya', rollNumber: 'A118', department: 'AIDS', section: 'A', marks: 90 },
    { name: 'Charan', rollNumber: 'A107', department: 'CSE', section: 'B', marks: 89 },
    { name: 'Omkar', rollNumber: 'A121', department: 'CSE', section: 'A', marks: 85 },
  ];

  res.json({
    totalStudents,
    avgAttendance, // 74%
    avgMarks, // 69%
    defaultersCount, // 16
    feesPendingK, // 918
    deptStats: {
      CSE: { attendance: 68, marks: 69 },
      AIDS: { attendance: 79, marks: 69 },
    },
    topPerformers,
    defaultersList: defaulters.map((s) => ({
      id: s.id,
      name: s.name,
      rollNumber: s.rollNumber,
      department: s.department,
      section: s.section,
      attendance: s.attendance,
    })),
  });
});

// Students List
app.get('/api/students', (req: Request, res: Response) => {
  const { search, department } = req.query;
  let list = [...students];

  if (department && department !== 'All' && department !== 'ALL') {
    list = list.filter((s) => s.department.toLowerCase() === String(department).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter((s) => s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q));
  }

  res.json(list);
});

// Get Student by ID or Roll Number
app.get('/api/students/:id', (req: Request, res: Response) => {
  const idOrRoll = req.params.id;
  const s = students.find((item) => String(item.id) === idOrRoll || item.rollNumber.toLowerCase() === idOrRoll.toLowerCase());
  if (!s) return res.status(404).json({ error: 'Student not found' });
  res.json(s);
});

// Update Student Profile (Name, Attendance)
app.put('/api/students/:id', (req: Request, res: Response) => {
  const idOrRoll = req.params.id;
  const s = students.find((item) => String(item.id) === idOrRoll || item.rollNumber.toLowerCase() === idOrRoll.toLowerCase());
  if (!s) return res.status(404).json({ error: 'Student not found' });

  const { name, attendance } = req.body;
  if (name !== undefined) s.name = name;
  if (attendance !== undefined) s.attendance = Number(attendance);

  res.json(s);
});

// Update Student Marks
app.put('/api/marks/:id', (req: Request, res: Response) => {
  const idOrRoll = req.params.id;
  const s = students.find((item) => String(item.id) === idOrRoll || item.rollNumber.toLowerCase() === idOrRoll.toLowerCase());
  if (!s) return res.status(404).json({ error: 'Student not found' });

  const { math, programming, dbms } = req.body;
  if (math !== undefined) s.math = Number(math);
  if (programming !== undefined) s.programming = Number(programming);
  if (dbms !== undefined) s.dbms = Number(dbms);

  s.averageMarks = Math.round((s.math + s.programming + s.dbms) / 3);
  res.json(s);
});

// Timetable
app.get('/api/timetable', (req: Request, res: Response) => {
  const day = (req.query.day as string) || 'Tue';
  const slots = timetableData[day] || timetableData['Tue'];
  res.json(slots);
});

// Fee Payment
app.post('/api/fees/pay', (req: Request, res: Response) => {
  const { rollNumber, feeType, amount, method } = req.body;
  const s = students.find((item) => item.rollNumber.toLowerCase() === String(rollNumber).toLowerCase());

  if (!s) return res.status(404).json({ error: 'Student not found' });

  const amt = Number(amount) || 2500;
  if (feeType === 'college') {
    s.collegeFeePaid = Math.min(s.collegeFeeTotal, s.collegeFeePaid + amt);
  } else {
    s.examFeePaid = Math.min(s.examFeeTotal, s.examFeePaid + amt);
  }

  const receipt = {
    id: receiptsStore.length + 1,
    receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
    studentName: s.name,
    rollNumber: s.rollNumber,
    feeType: feeType === 'college' ? 'College Fee' : 'Exam Fee',
    amount: amt,
    method: method || 'UPI',
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'Paid',
  };

  receiptsStore.unshift(receipt);

  res.json({ success: true, student: s, receipt });
});

app.get('/api/receipts', (req: Request, res: Response) => {
  const { rollNumber } = req.query;
  if (rollNumber) {
    return res.json(receiptsStore.filter((r) => r.rollNumber.toLowerCase() === String(rollNumber).toLowerCase()));
  }
  res.json(receiptsStore);
});

// Mock Tests
app.get('/api/mock-tests', (_req: Request, res: Response) => {
  res.json(mockTestsStore);
});

app.post('/api/mock-tests', (req: Request, res: Response) => {
  const { title, fileName, fileSize } = req.body;
  const newMock: MockTestDoc = {
    id: mockTestsStore.length + 1,
    title: title || 'Mock Test Question Paper',
    fileName: fileName || 'Question_Paper.pdf',
    fileSize: fileSize || '1.2 MB',
    uploadedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    uploadedBy: 'Faculty',
  };
  mockTestsStore.unshift(newMock);
  res.json(newMock);
});

// -------------------------------------------------------------
// Vite Integration & Static Serving
// -------------------------------------------------------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusHub Server running on http://localhost:${PORT}`);
  });
}

startServer();
