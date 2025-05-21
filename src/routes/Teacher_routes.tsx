import { Route, Routes } from 'react-router-dom';
import Dashboard from '../teacher/Dashboard';
import Library from '../page/Library';
import { Classroom } from '../page/Classroom';
import { StudentList } from '../page/Student_list';
import { EditProfile } from '../teacher/Edit_Profile';
import { ClassInfor } from '../page/Class_infor';
import Calendar from '../teacher/Calendar';
import { RollCallList } from '../teacher/classroom/RollCall';
import {
  AssignmentInfor,
  AssignmentList,
} from '../teacher/classroom/Assignment';
import { AddAssignment } from '../teacher/classroom/Add_assign';
import { NotificationList } from '../teacher/classroom/Notification';
import { ScoreList } from '../teacher/classroom/Score';
import Logout from '../components/Logout';
import { ChangePassword } from '../components/Change_pass';
const TeacherRoutes = () => (
  <Routes>
    <Route path="" element={<Dashboard />} />
    <Route path="calendar" element={<Calendar />} />
    <Route path="library" element={<Library />} />
    <Route path="classroom" element={<Classroom />} />
    <Route path="classroom/:classId" element={<ClassInfor />} />
    <Route path="classroom/:classId/studentlist" element={<StudentList />} />
    <Route path="classroom/:classId/rollcall" element={<RollCallList />} />
    <Route path="classroom/:classId/assignment" element={<AssignmentList />} />
    <Route path="classroom/:classId/assignment/:assignmentId" element={<AssignmentInfor />} />
    <Route path="classroom/:classId/assignment/create" element={<AddAssignment />} />
    <Route path="classroom/:classId/notification" element={<NotificationList />} />
    <Route path="classroom/:classId/score" element={<ScoreList />} />
    <Route path="profile" element={<EditProfile />} />
    <Route path="change-password" element={<ChangePassword />} />
    <Route path="logout" element={<Logout />} />
  </Routes>
);

export default TeacherRoutes;
