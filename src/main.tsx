import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Login from './Login_SignUp/Login';
import SignUp from './Login_SignUp/SignUp';
import Dashboard from './students/Dashboard';
import Calendar from './students/Calendar';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Login /> */}
    {/* <SignUp /> */}
    {/* <Dashboard /> */}
    {/* <Calendar /> */}
    <App />
  </StrictMode>
);
