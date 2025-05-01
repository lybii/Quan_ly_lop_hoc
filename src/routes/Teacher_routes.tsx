import { Route, Routes } from 'react-router-dom';
import Dashboard from '../teacher/Dashboard';

import Library from '../page/Library';
import { Classroom } from '../page/Classroom';

import { StudentList } from '../page/Student_list';
import { EditProfile } from '../students/Edit_Profile';
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

const TeacherRoutes = () => (
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
    <Route path="/classroom/infor/assignment" element={<AssignmentList />} />
    <Route path="/classroom/infor/assignment/1" element={<AssignmentInfor />} />
    <Route
      path="/classroom/infor/assignment/create"
      element={<AddAssignment />}
    />
    <Route
      path="/classroom/infor/notification"
      element={<NotificationList />}
    />
    <Route path="/classroom/infor/score" element={<ScoreList />} />
    <Route path="/profile" element={<EditProfile />} />
  </Routes>
);

export default TeacherRoutes;
