import { Routes, Route } from 'react-router-dom';
import Dashboard from '../students/Dashboard';
import Calendar from '../students/Calendar';
import { Classroom } from '../page/Classroom';
import Library from '../page/Library';
import { ClassInfor } from '../page/Class_infor';
import { StudentList } from '../page/Student_list';
import { RollCallList } from '../students/classroom/RollCall';
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
    <Route path="library" element={<Library />} />{' '}
    <Route path="classroom" element={<Classroom />} />
    <Route path="classroom/:classId" element={<ClassInfor />}>
      <Route path="studentlist" element={<StudentList />} />
      <Route path="rollcall" element={<RollCallList />} />
      <Route path="assignment" element={<AssignmentList />} />
      <Route path="assignment/1" element={<AssignmentInfor />} />
      <Route path="notification" element={<NotificationList />} />
      <Route path="score" element={<ScoreList />} />
    </Route>
    <Route path="profile" element={<EditProfile />} />
    <Route path="change-password" element={<ChangePassword />} />
    <Route path="logout" element={<Logout />} />
  </Routes>
);

export default StudentRoutes;
