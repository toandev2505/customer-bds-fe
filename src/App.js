import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CustomerManagement from './pages/CustomerManagement';
import LoginPage from './pages/LoginPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token || token === "undefined") return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardContent />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

const DashboardContent = () => {
  const [currentView, setCurrentView] = React.useState('all');

  const getUser = () => {
    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser || savedUser === "undefined") {
        return { fullName: "Administrator" };
      }
      return JSON.parse(savedUser);
    } catch (e) {
      return { fullName: "Administrator" };
    }
  };

  const user = getUser();

  const handleLogout = () => {
    if (window.confirm("Xác nhận đăng xuất khỏi hệ thống?")) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        <header className="bg-white h-20 flex justify-between items-center px-10 border-b border-slate-100">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Quản lý khách hàng</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hệ thống trực tuyến</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-2 pr-4 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 bg-white text-emerald-600 rounded-xl flex items-center justify-center font-black shadow-sm border border-slate-100">
              AD
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Quyền hạn</p>
              <p className="text-xs font-bold text-slate-700 leading-none">{user.fullName}</p>
            </div>
          </div>
        </header>

        <main className="p-10 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <CustomerManagement />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;