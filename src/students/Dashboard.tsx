import { Profile } from '../components/Profile';
import { ProfileRank } from '../components/dashboard/Profile_rank';
import { SubjectInDay } from '../components/dashboard/Subject_in_day';
import { Title } from '../components/Title';
import { SearchBox } from '../components/Search_box';
import { DateList } from '../components/dashboard/Day';
import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { classService } from '../services/classService';
import { courseService } from '../services/courseService';

interface Schedule {
  id: number;
  subject: string;
  time: string;
  room?: string;
  date: Date;
}

interface Course {
  id: number;
  courseName: string;
  progress: number;
}

// Helper function to determine background color based on score
const getBackgroundColorByScore = (score: number): string => {
  if (score >= 90) return "bg-green-100";
  if (score >= 80) return "bg-blue-100";
  if (score >= 70) return "bg-yellow-100";
  if (score >= 60) return "bg-orange-100";
  return "bg-red-100";
};

const Dashboard: React.FC = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  
  // States
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user data
        const userResponse = await userService.getCurrentUser();
        if (userResponse.success) {
          setUser(userResponse.data);
          
          // Fetch learning progress with error handling
          try {
            const progressResponse = await classService.getLearningProgress(userResponse.data.id);
            if (progressResponse.success) {
              // Transform progress data to courses for display
              const courseData = progressResponse.data.map((item: any) => ({
                id: item.classId,
                courseName: item.courseCode || item.className,
                progress: item.completionPercentage
              }));
              setCourses(courseData);
            }
          } catch (progressError) {
            console.error("Error fetching learning progress:", progressError);
            // Continue execution despite this error
            setCourses([]);
          }
          
          // Fetch schedule
          try {
            const scheduleResponse = await classService.getStudentSchedule(userResponse.data.id);
            if (scheduleResponse.success && scheduleResponse.data && Array.isArray(scheduleResponse.data)) {
              // Transform schedule data
              const scheduleData = scheduleResponse.data.map((item: any) => ({
                id: item.id,
                subject: item.lectureName || item.subject,
                time: new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                room: item.room,
                date: new Date(item.startTime)
              }));
              setSchedules(scheduleData);
            } else {
              console.warn("No schedule data available or invalid format:", scheduleResponse.message);
              setSchedules([]);
            }
          } catch (scheduleError) {
            console.error("Error fetching schedule:", scheduleError);
            // Continue execution despite this error
            setSchedules([]);
          }
          
          // Fetch grades for leaderboard
          try {
            const gradesResponse = await userService.getUserGrades(userResponse.data.id);
            if (gradesResponse.success && gradesResponse.data) {
              // Transform grades data for the leaderboard
              const gradesData = gradesResponse.data.map((item: any) => ({
                name: item.courseName || item.subject,
               
                score: item.grade || 0,
                backgroundColor: getBackgroundColorByScore(item.grade|| 0)
              }));
              setLeaderboard(gradesData);
            } else {
              console.warn("No grades data available or invalid format:", gradesResponse.message);
              // Set empty leaderboard or fallback to demo data
              setLeaderboard([]);
            }
          } catch (gradesError) {
            console.error("Error fetching grades:", gradesError);
            // Continue execution despite this error
            setLeaderboard([]);
          }
          
          // For demo: Set sample assignments data
          setAssignments([
            { course: "OOP", chapter: "Chapter 5", time: "11:00 AM", status: "Pending" },
            { course: "Python", chapter: "Chapter 4", time: "11:40 AM", status: "Pending" },
            { course: "CNPM", chapter: "Chapter 2", time: "10:00 AM", status: "Completed" }
          ]);
        } else {
          setError(userResponse.message || 'Failed to load user data');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter today's schedule
  const todaySchedule = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    return scheduleDate.getDate() === today.getDate() &&
           scheduleDate.getMonth() === today.getMonth() &&
           scheduleDate.getFullYear() === today.getFullYear();
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-600">
          <div className="text-lg font-bold">Error</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Main Content */}
      <div className="no-scrollbar flex-1 overflow-auto scroll-smooth p-4">
        <Title title="Trang chủ" />
        <SearchBox onSearch={() => {}} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Announcement */}
          <div className="col-span-2 h-[157px] rounded-xl bg-white p-4">
            <h2 className="mb-2 text-lg font-bold md:text-xl">Thông báo</h2>
            <div className="flex h-[74px] items-center rounded-lg bg-sky-200">
              {user && (
                <p className="ml-4">
                  Xin chào! <strong>{user.userName}</strong>
                  {todaySchedule.length > 0
                    ? ` bạn có lịch học môn ${todaySchedule[0].subject} vào lúc `
                    : " bạn không có lịch học hôm nay"}
                  {todaySchedule.length > 0 && <strong>{todaySchedule[0].time}</strong>}
                </p>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="no-scrollbar col-span-1 h-[300px] overflow-auto rounded-3xl bg-white p-4 md:h-[400px]">
            <h2 className="mb-2 text-xl font-bold">Điểm các môn học</h2>
            <div className="flex flex-col gap-2">
              {leaderboard.map((item, index) => (
                <ProfileRank
                  key={index}
                  name={item.name}
              
                  score={item.score}
                  backgroundColor={item.backgroundColor}
                />
              ))}
              {leaderboard.length === 0 && (
                <div className="flex h-64 items-center justify-center text-gray-500">
                  Chưa có dữ liệu điểm môn học
                </div>
              )}
            </div>
          </div>

          {/* Completion Progress */}
          <div className="no-scrollbar col-span-1 h-[300px] overflow-auto rounded-3xl bg-white p-4 md:h-[400px]">
            <h2 className="mb-2 text-xl font-bold">Tiến trình học tập</h2>
            {courses.map((course, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-bold">{course.courseName}</h3>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="flex h-64 items-center justify-center text-gray-500">
                Chưa có dữ liệu tiến trình học tập
              </div>
            )}
          </div>

          {/* Assignments */}
          <div className="col-span-2 rounded-2xl bg-white p-4">
            <h2 className="mb-2 text-xl font-bold">Nhiệm vụ</h2>
            {assignments.map((assignment, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-bold">{assignment.course}</h3>
                <p>{assignment.chapter}</p>
                <p>
                  {assignment.time} - {" "}
                  <span className={assignment.status === 'Completed' ? "text-green-500" : "text-orange-500"}>
                    {assignment.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="-mr-4 -mt-4 hidden rounded-l-2xl bg-white p-4 md:block md:w-1/4">
        {user && (
          <Profile
            name={user.userName}
            image={user.avatar || '../../src/assets/avatar.png'}
            role={user.role?.name || 'User'}
          />
        )}

        <div className="rounded p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold">Tháng {month}</h2>
            <div className="flex gap-2">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-7 flex flex-wrap justify-between">
            <DateList />
          </div>
          <div className="flex items-center justify-center">
            <h1 className="mb-2 text-xl font-bold">Thời khóa biểu</h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ml-auto h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
          {todaySchedule.length > 0 ? (
            todaySchedule.map((schedule, index) => (
              <SubjectInDay
                key={index}
                id={index + 1}
                subject={schedule.subject}
                time={schedule.time}
                room={schedule.room}
              />
            ))
          ) : (
            <div className="flex h-16 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
              Không có lịch học hôm nay
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
