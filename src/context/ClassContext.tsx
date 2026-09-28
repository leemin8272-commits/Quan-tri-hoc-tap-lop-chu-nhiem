import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Student,
  SubjectItem,
  StudentAcademicRecord,
  BehaviorRecord,
  CommendationRecord,
  TeacherNote,
  ParentContactRecord,
  Announcement,
  ScheduleItem,
  WeeklyReport,
  SystemAlert,
  AttendanceStatus,
  UserRole,
  TimeframeFilter,
} from '../types';
import {
  CLASS_INFO,
  SUBJECTS,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_BEHAVIORS,
  INITIAL_COMMENDATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SCHEDULE,
  INITIAL_PARENT_CONTACTS,
  INITIAL_TEACHER_NOTES,
  INITIAL_WEEKLY_REPORTS,
  generateAcademicRecords,
  DAYS_OF_WEEK,
} from '../data/mockData';

export type NavPage =
  | 'overview'
  | 'students'
  | 'academic'
  | 'attendance'
  | 'discipline'
  | 'commendation'
  | 'profile'
  | 'statistics'
  | 'reports'
  | 'ai_assistant'
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface ClassContextType {
  activePage: NavPage;
  setActivePage: (page: NavPage) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  viewStudentProfile: (studentId: string) => void;
  timeframe: TimeframeFilter;
  setTimeframe: (tf: TimeframeFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  classInfo: typeof CLASS_INFO;
  updateClassInfo: (info: Partial<typeof CLASS_INFO>) => void;
  subjects: SubjectItem[];
  students: Student[];
  academicRecords: Record<string, StudentAcademicRecord>;
  attendance: Record<string, Record<string, { status: AttendanceStatus; note?: string }>>;
  behaviors: BehaviorRecord[];
  commendations: CommendationRecord[];
  teacherNotes: TeacherNote[];
  parentContacts: ParentContactRecord[];
  announcements: Announcement[];
  schedule: ScheduleItem[];
  weeklyReports: WeeklyReport[];
  systemAlerts: SystemAlert[];
  unreadAlertsCount: number;
  markAlertRead: (id: string) => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  updateSubjectScore: (studentId: string, subjectId: string, field: 'tx1' | 'tx2' | 'gk' | 'ck', value: number) => void;
  updateAttendance: (studentId: string, date: string, status: AttendanceStatus, note?: string) => void;
  markAllPresentForDate: (date: string) => void;
  addBehavior: (behavior: Omit<BehaviorRecord, 'id'>) => void;
  toggleBehaviorStatus: (id: string) => void;
  addCommendation: (commendation: Omit<CommendationRecord, 'id'>) => void;
  addTeacherNote: (note: Omit<TeacherNote, 'id'>) => void;
  addParentContact: (contact: Omit<ParentContactRecord, 'id'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  saveWeeklyReport: (report: WeeklyReport) => void;
  resetAllData: () => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'gvcn_class_data_v1_';

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<NavPage>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('s-001');
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('Tuần này');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userRole, setUserRole] = useState<UserRole>('GVCN');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent States
  const [classInfo, setClassInfo] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'classInfo');
    return saved ? JSON.parse(saved) : CLASS_INFO;
  });

  const [subjects] = useState<SubjectItem[]>(SUBJECTS);

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [academicRecords, setAcademicRecords] = useState<Record<string, StudentAcademicRecord>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'academicRecords');
    return saved ? JSON.parse(saved) : generateAcademicRecords(INITIAL_STUDENTS);
  });

  const [attendance, setAttendance] = useState<Record<string, Record<string, { status: AttendanceStatus; note?: string }>>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [behaviors, setBehaviors] = useState<BehaviorRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'behaviors');
    return saved ? JSON.parse(saved) : INITIAL_BEHAVIORS;
  });

  const [commendations, setCommendations] = useState<CommendationRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'commendations');
    return saved ? JSON.parse(saved) : INITIAL_COMMENDATIONS;
  });

  const [teacherNotes, setTeacherNotes] = useState<TeacherNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'teacherNotes');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_NOTES;
  });

  const [parentContacts, setParentContacts] = useState<ParentContactRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'parentContacts');
    return saved ? JSON.parse(saved) : INITIAL_PARENT_CONTACTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [schedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);

  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'weeklyReports');
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_REPORTS;
  });

  const [readAlertIds, setReadAlertIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'readAlerts');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'classInfo', JSON.stringify(classInfo));
  }, [classInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'academicRecords', JSON.stringify(academicRecords));
  }, [academicRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'behaviors', JSON.stringify(behaviors));
  }, [behaviors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'commendations', JSON.stringify(commendations));
  }, [commendations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'teacherNotes', JSON.stringify(teacherNotes));
  }, [teacherNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'parentContacts', JSON.stringify(parentContacts));
  }, [parentContacts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'weeklyReports', JSON.stringify(weeklyReports));
  }, [weeklyReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'readAlerts', JSON.stringify(readAlertIds));
  }, [readAlertIds]);

  // Toast dispatch
  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const viewStudentProfile = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActivePage('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic Alert Engine (Requirement 20: Auto alert detection)
  const systemAlerts = useMemo<SystemAlert[]>(() => {
    const alerts: SystemAlert[] = [];

    students.forEach((student) => {
      const academic = academicRecords[student.id];
      const studentAttendance = attendance[student.id] || {};

      // Count attendance stats
      let unexcusedCount = 0;
      let lateCount = 0;
      let totalAbsence = 0;

      Object.values(studentAttendance).forEach((rec: { status: AttendanceStatus; note?: string }) => {
        if (rec.status === 'unexcused') {
          unexcusedCount++;
          totalAbsence++;
        }
        if (rec.status === 'excused') {
          totalAbsence++;
        }
        if (rec.status === 'late') {
          lateCount++;
        }
      });

      // Violations count
      const studentViolations = behaviors.filter((b) => b.studentId === student.id);
      const studentCommendations = commendations.filter((c) => c.studentId === student.id);

      // 1. Academic alert: GPA < 5.0
      if (academic && academic.gpa < 5.0) {
        alerts.push({
          id: `alert-gpa-low-${student.id}`,
          type: 'academic_danger',
          studentId: student.id,
          studentName: student.fullName,
          message: `Điểm trung bình dưới 5.0 (${academic.gpa} điểm)`,
          detail: 'Học sinh có nguy cơ xếp loại yếu, cần lên kế hoạch phụ đạo bổ trợ ngay.',
          severity: 'danger',
          date: 'Hôm nay',
          isRead: readAlertIds.includes(`alert-gpa-low-${student.id}`),
        });
      }

      // 2. Declining trend
      if (academic && academic.trend === 'down') {
        alerts.push({
          id: `alert-trend-down-${student.id}`,
          type: 'declining_trend',
          studentId: student.id,
          studentName: student.fullName,
          message: `Điểm số có xu hướng giảm liên tục (${academic.previousGpa} → ${academic.gpa})`,
          detail: 'Đặc biệt ở môn Toán và khoa học tự nhiên, cần trao đổi với phụ huynh.',
          severity: 'warning',
          date: 'Tuần này',
          isRead: readAlertIds.includes(`alert-trend-down-${student.id}`),
        });
      }

      // 3. Attendance alert: >= 3 unexcused or total absences
      if (unexcusedCount >= 3 || totalAbsence >= 3) {
        alerts.push({
          id: `alert-absent-${student.id}`,
          type: 'absence_warning',
          studentId: student.id,
          studentName: student.fullName,
          message: `Vắng học ${totalAbsence} buổi (${unexcusedCount} buổi không phép)`,
          detail: 'Cần liên hệ phụ huynh xác minh lý do vắng và nhắc nhở chuyên cần.',
          severity: 'danger',
          date: 'Hôm nay',
          isRead: readAlertIds.includes(`alert-absent-${student.id}`),
        });
      }

      // 4. Late alert: >= 2 times
      if (lateCount >= 2) {
        alerts.push({
          id: `alert-late-${student.id}`,
          type: 'late_warning',
          studentId: student.id,
          studentName: student.fullName,
          message: `Đi học muộn ${lateCount} lần trong tuần`,
          detail: 'Nhắc nhở học sinh quản lý thời gian đi lại buổi sáng.',
          severity: 'warning',
          date: 'Tuần này',
          isRead: readAlertIds.includes(`alert-late-${student.id}`),
        });
      }

      // 5. Conduct alert: >= 2 violations
      if (studentViolations.length >= 2) {
        alerts.push({
          id: `alert-violation-${student.id}`,
          type: 'conduct_warning',
          studentId: student.id,
          studentName: student.fullName,
          message: `Có ${studentViolations.length} lần vi phạm nề nếp`,
          detail: studentViolations.map((v) => v.violation).join('; '),
          severity: 'warning',
          date: 'Tuần này',
          isRead: readAlertIds.includes(`alert-violation-${student.id}`),
        });
      }

      // 6. Positive progress
      if (academic && academic.trend === 'up') {
        alerts.push({
          id: `alert-progress-${student.id}`,
          type: 'progress_positive',
          studentId: student.id,
          studentName: student.fullName,
          message: `Học sinh có tiến bộ vượt bậc (+${(academic.gpa - (academic.previousGpa || 0)).toFixed(1)} điểm)`,
          detail: 'Có nỗ lực cao trong giờ học, tích cực xây dựng bài.',
          severity: 'success',
          date: 'Tuần này',
          isRead: readAlertIds.includes(`alert-progress-${student.id}`),
        });
      }

      // 7. Commendation suggestion
      if (academic && academic.gpa >= 8.5 && studentViolations.length === 0 && unexcusedCount === 0 && studentCommendations.length === 0) {
        alerts.push({
          id: `alert-commend-${student.id}`,
          type: 'commend_suggest',
          studentId: student.id,
          studentName: student.fullName,
          message: `Đề xuất tuyên dương học sinh xuất sắc toàn diện`,
          detail: `ĐTB ${academic.gpa}, nề nếp tốt, chuyên cần 100%.`,
          severity: 'info',
          date: 'Tuần này',
          isRead: readAlertIds.includes(`alert-commend-${student.id}`),
        });
      }
    });

    return alerts;
  }, [students, academicRecords, attendance, behaviors, commendations, readAlertIds]);

  const unreadAlertsCount = useMemo(() => {
    return systemAlerts.filter((a) => !a.isRead).length;
  }, [systemAlerts]);

  const markAlertRead = (id: string) => {
    setReadAlertIds((prev) => [...new Set([...prev, id])]);
  };

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newId = `s-${Date.now().toString().slice(-4)}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Initialize mock academic record for new student
    const defaultAcademic = generateAcademicRecords([newStudent])[newId];
    setAcademicRecords((prev) => ({
      ...prev,
      [newId]: defaultAcademic,
    }));

    // Initialize attendance
    const defaultAtt: Record<string, { status: AttendanceStatus }> = {};
    DAYS_OF_WEEK.forEach((d) => {
      defaultAtt[d.date] = { status: 'present' };
    });
    setAttendance((prev) => ({
      ...prev,
      [newId]: defaultAtt,
    }));

    showToast({
      type: 'success',
      title: 'Thêm học sinh thành công',
      message: `Đã thêm em ${newStudent.fullName} (${newStudent.studentCode}) vào lớp.`,
    });
  };

  const updateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast({
      type: 'success',
      title: 'Cập nhật thành công',
      message: `Đã lưu thông tin học sinh ${updated.fullName}.`,
    });
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast({
      type: 'info',
      title: 'Đã xóa học sinh',
      message: target ? `Đã xóa học sinh ${target.fullName} khỏi danh sách lớp.` : 'Đã xóa học sinh.',
    });
  };

  const updateSubjectScore = (
    studentId: string,
    subjectId: string,
    field: 'tx1' | 'tx2' | 'gk' | 'ck',
    value: number
  ) => {
    setAcademicRecords((prev) => {
      const current = prev[studentId];
      if (!current) return prev;

      const subScore = current.scores[subjectId];
      if (!subScore) return prev;

      const updatedSub = { ...subScore, [field]: value };
      // recalculate tbm
      updatedSub.tbm = Number(
        ((updatedSub.tx1 + updatedSub.tx2 + updatedSub.gk * 2 + updatedSub.ck * 3) / 7).toFixed(1)
      );

      const newScores = { ...current.scores, [subjectId]: updatedSub };

      // recalculate total gpa
      let total = 0;
      let weights = 0;
      subjects.forEach((sub) => {
        const sc = newScores[sub.id];
        if (sc) {
          total += sc.tbm * sub.coefficient;
          weights += sub.coefficient;
        }
      });
      const gpa = Number((total / weights).toFixed(1));
      let rank: 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu' = 'Khá';
      if (gpa >= 8.0) rank = 'Giỏi';
      else if (gpa >= 6.5) rank = 'Khá';
      else if (gpa >= 5.0) rank = 'Trung bình';
      else rank = 'Yếu';

      return {
        ...prev,
        [studentId]: {
          ...current,
          scores: newScores,
          gpa,
          rank,
        },
      };
    });

    showToast({
      type: 'success',
      title: 'Đã cập nhật điểm số',
      message: 'Hệ thống đã tự động tính lại điểm trung bình môn và xếp loại.',
    });
  };

  const updateAttendance = (studentId: string, date: string, status: AttendanceStatus, note?: string) => {
    setAttendance((prev) => {
      const studentRecs = prev[studentId] || {};
      return {
        ...prev,
        [studentId]: {
          ...studentRecs,
          [date]: { status, note },
        },
      };
    });
  };

  const markAllPresentForDate = (date: string) => {
    setAttendance((prev) => {
      const next = { ...prev };
      students.forEach((s) => {
        next[s.id] = {
          ...(next[s.id] || {}),
          [date]: { status: 'present' },
        };
      });
      return next;
    });

    showToast({
      type: 'success',
      title: 'Đã điểm danh cả lớp có mặt',
      message: `Tất cả ${students.length} học sinh đều được đánh dấu có mặt.`,
    });
  };

  const addBehavior = (data: Omit<BehaviorRecord, 'id'>) => {
    const newRecord: BehaviorRecord = {
      ...data,
      id: `bh-${Date.now().toString().slice(-4)}`,
    };
    setBehaviors((prev) => [newRecord, ...prev]);
    showToast({
      type: 'warning',
      title: 'Đã ghi nhận vi phạm',
      message: `Đã lưu vi phạm cho học sinh ${data.studentName}.`,
    });
  };

  const toggleBehaviorStatus = (id: string) => {
    setBehaviors((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === 'Đã xử lý' ? 'Chưa xử lý' : 'Đã xử lý' }
          : b
      )
    );
    showToast({
      type: 'info',
      title: 'Cập nhật trạng thái xử lý',
      message: 'Đã thay đổi trạng thái vi phạm nề nếp.',
    });
  };

  const addCommendation = (data: Omit<CommendationRecord, 'id'>) => {
    const newRecord: CommendationRecord = {
      ...data,
      id: `cm-${Date.now().toString().slice(-4)}`,
    };
    setCommendations((prev) => [newRecord, ...prev]);
    showToast({
      type: 'success',
      title: 'Tuyên dương học sinh',
      message: `Đã trao tặng khen thưởng cho ${data.studentName}!`,
    });
  };

  const addTeacherNote = (data: Omit<TeacherNote, 'id'>) => {
    const newNote: TeacherNote = {
      ...data,
      id: `tn-${Date.now().toString().slice(-4)}`,
    };
    setTeacherNotes((prev) => [newNote, ...prev]);
    showToast({
      type: 'success',
      title: 'Đã lưu ghi chú GVCN',
      message: 'Ghi chú học sinh đã được cập nhật vào hồ sơ.',
    });
  };

  const addParentContact = (data: Omit<ParentContactRecord, 'id'>) => {
    const newContact: ParentContactRecord = {
      ...data,
      id: `pc-${Date.now().toString().slice(-4)}`,
    };
    setParentContacts((prev) => [newContact, ...prev]);
    showToast({
      type: 'success',
      title: 'Đã lưu trao đổi phụ huynh',
      message: `Ghi nhận cuộc trao đổi với phụ huynh em ${data.studentName}.`,
    });
  };

  const addAnnouncement = (data: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `an-${Date.now().toString().slice(-4)}`,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast({
      type: 'success',
      title: 'Đã gửi thông báo mới',
      message: 'Thông báo đã được gửi đến danh sách phụ huynh học sinh.',
    });
  };

  const saveWeeklyReport = (report: WeeklyReport) => {
    setWeeklyReports((prev) => {
      const exists = prev.findIndex((r) => r.week === report.week);
      if (exists >= 0) {
        const copy = [...prev];
        copy[exists] = report;
        return copy;
      }
      return [report, ...prev];
    });
    showToast({
      type: 'success',
      title: 'Đã lưu báo cáo tuần',
      message: `Báo cáo Tuần ${report.week} đã được lưu thành công.`,
    });
  };

  const updateClassInfo = (info: Partial<typeof CLASS_INFO>) => {
    setClassInfo((prev: typeof CLASS_INFO) => ({ ...prev, ...info }));
    showToast({
      type: 'success',
      title: 'Đã cập nhật thông tin lớp',
      message: 'Cấu hình lớp học đã được áp dụng.',
    });
  };

  const resetAllData = () => {
    localStorage.clear();
    setClassInfo(CLASS_INFO);
    setStudents(INITIAL_STUDENTS);
    setAcademicRecords(generateAcademicRecords(INITIAL_STUDENTS));
    setAttendance(INITIAL_ATTENDANCE);
    setBehaviors(INITIAL_BEHAVIORS);
    setCommendations(INITIAL_COMMENDATIONS);
    setTeacherNotes(INITIAL_TEACHER_NOTES);
    setParentContacts(INITIAL_PARENT_CONTACTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setWeeklyReports(INITIAL_WEEKLY_REPORTS);
    setReadAlertIds([]);
    showToast({
      type: 'info',
      title: 'Đã khôi phục dữ liệu gốc',
      message: 'Dữ liệu mẫu 36 học sinh lớp 6A4 đã được làm mới.',
    });
  };

  return (
    <ClassContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedStudentId,
        setSelectedStudentId,
        viewStudentProfile,
        timeframe,
        setTimeframe,
        searchQuery,
        setSearchQuery,
        userRole,
        setUserRole,
        classInfo,
        updateClassInfo,
        subjects,
        students,
        academicRecords,
        attendance,
        behaviors,
        commendations,
        teacherNotes,
        parentContacts,
        announcements,
        schedule,
        weeklyReports,
        systemAlerts,
        unreadAlertsCount,
        markAlertRead,
        toasts,
        showToast,
        dismissToast,
        addStudent,
        updateStudent,
        deleteStudent,
        updateSubjectScore,
        updateAttendance,
        markAllPresentForDate,
        addBehavior,
        toggleBehaviorStatus,
        addCommendation,
        addTeacherNote,
        addParentContact,
        addAnnouncement,
        saveWeeklyReport,
        resetAllData,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClass = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClass must be used within a ClassProvider');
  }
  return context;
};
