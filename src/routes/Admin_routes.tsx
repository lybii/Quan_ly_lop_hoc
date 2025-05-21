import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../admin/Admin_dashboard';
import { ClassInfor } from '../page/Class_infor';
import { StudentList } from '../page/Student_list';
import { EditProfile } from '../admin/Edit_Profile';
import UserManager from '../admin/UserManager';
import Library from '../admin/Library';
import { Classroom } from '../admin/AdminClass';
import Logout from '../components/Logout';

const AdminRoutes = () => (
  <Routes>
    <Route path="" element={<AdminDashboard />}></Route>
    <Route path="users" element={<UserManager />}></Route>
    <Route path="library" element={<Library />} />
    <Route path="classroom" element={<Classroom />}></Route>
    <Route path="classroom/infor" element={<ClassInfor />}></Route>
    <Route path="classroom/infor/studentlist" element={<StudentList />}></Route>
    <Route path="profile" element={<EditProfile />} />
    <Route path="logout" element={<Logout />} />
  </Routes>
);

export default AdminRoutes;
