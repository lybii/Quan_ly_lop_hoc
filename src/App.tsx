import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './students/Dashboard';
import Calendar from './students/Calendar';
import Library from './students/Library';
import { Classroom } from './students/classroom/Classroom';
import { ClassInfor } from './students/classroom/Class_infor';
import { EditProfile } from './students/Edit_Profile';
import AdminDashboard from './admin/Admin_dashboard';
import { StudentList } from './students/classroom/Student_list';
import { RollCallList } from './students/classroom/RollCall';
import {
  AssignmentInfor,
  AssignmentList,
} from './students/classroom/Assignment';
import { NotificationList } from './students/classroom/Notification';
import { ScoreList } from './students/classroom/Score';

export function App() {
  return (
    <Router>
      <div className="flex h-screen w-full bg-gradient-to-br from-[#4887d4] to-blue-200">
        <div className="flex h-screen w-1/6">
          <Sidebar />
        </div>
        <div className="flex h-screen w-5/6">
          {/* User router */}
          <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/calendar" element={<Calendar />}></Route>
            <Route path="/library" element={<Library />} />
            <Route path="/classroom" element={<Classroom />}></Route>
            <Route path="/classroom/infor" element={<ClassInfor />}></Route>
            <Route
              path="/classroom/infor/studentlist"
              element={<StudentList />}
            ></Route>
            <Route
              path="/classroom/infor/rollcall"
              element={<RollCallList />}
            ></Route>
            <Route
              path="/classroom/infor/assignment"
              element={<AssignmentList />}
            ></Route>
            <Route
              path="/classroom/infor/assignment/1"
              element={<AssignmentInfor />}
            ></Route>
            <Route
              path="/classroom/infor/notification"
              element={<NotificationList />}
            ></Route>
            <Route path="/classroom/infor/score" element={<ScoreList />} />
            <Route path="/profile" element={<EditProfile />} />
            {/* <Route path="/admin_dashboard" element={<AdminDashboard />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}
