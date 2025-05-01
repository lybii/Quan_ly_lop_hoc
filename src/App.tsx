import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';

import StudentRoutes from './routes/Student_routes';

import TeacherSidebar from './components/sidebar/Teacher_sidebar';
import TeacherRoutes from './routes/Teacher_routes';

export function App() {
  return (
    <Router>
      <div className="flex h-screen w-full bg-gradient-to-br from-[#4887d4] to-blue-200">
        <div className="flex h-screen w-1/6">
          <TeacherSidebar />
        </div>
        <div className="flex h-screen w-5/6">
          {/* User router */}
          {/* <StudentRoutes /> */}
          <TeacherRoutes />
        </div>
      </div>
    </Router>
  );
}
