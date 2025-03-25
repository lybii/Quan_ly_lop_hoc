import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './students/Dashboard';
import Calendar from './students/Calendar';
import Library from './students/Library';
import { Classroom } from './students/classroom/Classroom';
import { ClassInfor } from './students/classroom/Class_infor';
import { EditProfile } from './students/Edit_Profile';

export function App() {
  return (
    <Router>
      <div className="flex h-screen w-full bg-gradient-to-br from-[#4887d4] to-blue-200">
        <div className="flex h-screen w-1/6">
          <Sidebar />
        </div>
        <div className="flex h-screen w-5/6">
          <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/calendar" element={<Calendar />}></Route>
            <Route path="/library" element={<Library />} />
            <Route path="/classroom" element={<Classroom />}></Route>
            <Route path="/classroom/info" element={<ClassInfor />}></Route>
            <Route path="/profile" element={<EditProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
