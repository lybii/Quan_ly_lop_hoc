import { Routes, Route } from 'react-router-dom';
import Dashboard from '../students/Dashboard';
import Calendar from '../students/Calendar';
import { Classroom } from '../page/Classroom';
import Library from '../page/Library';
import { ClassInfor } from '../students/classroom/Class_infor';
import { StudentList } from '../page/Student_list';
import { RollCallList } from '../students/classroom/RollCall';
import {
  AssignmentInfor,
  AssignmentList,
} from '../students/classroom/Assignment';
import { NotificationList } from '../students/classroom/Notification';
import { ScoreList } from '../students/classroom/Score';
import { EditProfile } from '../students/Edit_Profile';

const StudentRoutes = () => (
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
    <Route path="/classroom/infor/rollcall" element={<RollCallList />}></Route>
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
  </Routes>
);

export default StudentRoutes;
