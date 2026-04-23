import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    const API_URL = 'https://bds-management-be.onrender.com/api/auth/login'; 

    try {
        const response = await axios.post(API_URL, { username, password });
        
        
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token); // Cất chìa khóa thật vào máy
            localStorage.setItem('user', JSON.stringify(response.data.user)); 
            navigate('/dashboard'); 
        }
    } catch (err) {
        setError('Tài khoản hoặc mật khẩu thật không đúng!');
    }
};

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 border border-slate-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-xl shadow-emerald-100">
                        CRM
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Đăng Nhập</h2>
                    <p className="text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-widest">Management System</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Tên đăng nhập</label>
                        <input 
                            type="text" 
                            className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            placeholder="username..."
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Mật khẩu</label>
                        <input 
                            type="password" 
                            className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-xl">{error}</p>}
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-95 uppercase tracking-widest text-xs">
                        Vào hệ thống
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;