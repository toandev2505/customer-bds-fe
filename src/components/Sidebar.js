import React from 'react';

const Sidebar = ({ currentView, setCurrentView, onLogout }) => {
  const menuItems = [
    { id: 'all', name: 'Danh sách khách hàng', icon: '👤' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen shadow-sm">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3 text-emerald-600 font-black text-xl">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            🏢
          </div>
          <span className="text-slate-800 tracking-tight">EstateCRM</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id} onClick={() => setCurrentView(item.id)}>
              <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                currentView === item.id 
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600'
              }`}>
                <span className="text-xl">{item.icon}</span>
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 mt-auto border-t border-slate-50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 p-4 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl font-bold transition-all duration-300 shadow-sm text-[11px] uppercase tracking-widest"
        >
          <span>🚪</span> Đăng xuất hệ thống
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;