import { Routes, Route } from 'react-router-dom';
import Dashboard from '../students/Dashboard';
import Calendar from '../students/Calendar';
import { Classroom } from '../page/Classroom';
import { ClassInfor } from '../page/Class_infor';
import { StudentList } from '../page/Student_list';
import { RollCallList } from '../students/classroom/Lecture';
import {
  AssignmentInfor,
  AssignmentList,
} from '../students/classroom/Assignment';
import { NotificationList } from '../students/classroom/Notification';
import { ScoreList } from '../students/classroom/Score';
import { EditProfile } from '../students/Edit_Profile';
import Logout from '../components/Logout';
import { ChangePassword } from '../components/Change_pass';

const StudentRoutes = () => (
  <Routes>
    <Route path="" element={<Dashboard />}></Route>
    <Route path="calendar" element={<Calendar />}></Route>

    <Route path="classroom" element={<Classroom />} />
    <Route path="classroom/:classId" element={<ClassInfor />} />
    <Route path="classroom/:classId/studentlist" element={<StudentList />} />
    <Route path="classroom/:classId/lectures" element={<RollCallList />} />
    <Route path="classroom/:classId/rollcall" element={<RollCallList />} />
    <Route path="classroom/:classId/assignment" element={<AssignmentList />} />
    <Route
      path="classroom/:classId/assignment/:assignmentId"
      element={<AssignmentInfor />}
    />
    <Route
      path="classroom/:classId/notification"
      element={<NotificationList />}
    />
    <Route path="classroom/:classId/score" element={<ScoreList />} />
    <Route path="profile" element={<EditProfile />} />
    <Route path="change-password" element={<ChangePassword />} />
    <Route path="logout" element={<Logout />} />
  </Routes>
);

export default StudentRoutes;
