export type UserRole = 'GVCN' | 'ADMIN' | 'GV_BOMON' | 'PHU_HUYNH' | 'HOC_SINH';

export type TimeframeFilter = 'Hôm nay' | 'Tuần này' | 'Tháng này' | 'Học kỳ I' | 'Học kỳ II' | 'Cả năm';

export type AttendanceStatus = 'present' | 'excused' | 'unexcused' | 'late';

export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  gender: 'Nam' | 'Nữ';
  birthday: string;
  avatar: string;
  parentName: string;
  parentPhone: string;
  address: string;
  classId: string;
  squad: number; // Tổ 1, 2, 3, 4
  status: 'Đang học' | 'Nghỉ phép' | 'Tạm nghỉ';
  conduct: 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
  email?: string;
  notes?: string;
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  tx1: number;
  tx2: number;
  gk: number;
  ck: number;
  tbm: number;
}

export interface StudentAcademicRecord {
  studentId: string;
  semester: 'HK1' | 'HK2';
  scores: Record<string, SubjectScore>;
  gpa: number;
  rank: 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu';
  trend: 'up' | 'down' | 'stable';
  previousGpa?: number;
}

export interface AttendanceRecord {
  date: string;
  dayOfWeek: string;
  status: AttendanceStatus;
  note?: string;
}

export interface BehaviorRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  violation: string;
  action: string;
  status: 'Đã xử lý' | 'Chưa xử lý';
  week: number;
}

export interface CommendationRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  category: 'Xuất sắc' | 'Tiến bộ vượt bậc' | 'Việc tốt' | 'Hoạt động phong trào' | 'Khác';
  title: string;
  description: string;
  awardType: string;
}

export interface TeacherNote {
  id: string;
  studentId: string;
  date: string;
  content: string;
  author: string;
}

export interface ParentContactRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  parentName: string;
  parentPhone: string;
  method: 'Gọi điện' | 'Gặp trực tiếp' | 'Zalo' | 'Sổ liên lạc điện tử';
  content: string;
  feedback: string;
  status: 'Đã hoàn thành' | 'Cần liên hệ lại';
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  type: 'Thông báo' | 'Họp phụ huynh' | 'Lịch kiểm tra' | 'Ngoại khóa' | 'Học phí';
  content: string;
  viewedCount: number;
  confirmedCount: number;
  totalParents: number;
  priority: 'Bình thường' | 'Quan trọng' | 'Khẩn cấp';
}

export interface ScheduleItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'meeting' | 'exam' | 'activity' | 'deadline';
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  teacher: string;
  coefficient: number;
}

export interface WeeklyReport {
  week: number;
  semester: string;
  dateRange: string;
  generalRemark: string;
  academicSummary: string;
  attendanceSummary: string;
  disciplineSummary: string;
  activities: string;
  attentionStudentIds: string[];
  createdDate: string;
}

export interface SystemAlert {
  id: string;
  type: 'academic_danger' | 'declining_trend' | 'absence_warning' | 'late_warning' | 'conduct_warning' | 'progress_positive' | 'commend_suggest';
  studentId: string;
  studentName: string;
  message: string;
  detail: string;
  severity: 'danger' | 'warning' | 'success' | 'info';
  date: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestions?: string[];
}
