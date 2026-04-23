// src/layouts/MainLayout.js
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar'; // Nhớ tạo file này
import '../App.css';

const MainLayout = ({ children, currentPageTitle }) => {
  return (
    <div className="app-container">
      {/* 1. Sidebar cố định bên trái */}
      <Sidebar />

      {/* 2. Vùng nội dung chính bên phải */}
      <div className="main-content">
        {/* 3. Header thanh lịch phía trên */}
        <Navbar pageTitle={currentPageTitle} />
        
        {/* 4. Nội dung thay đổi của từng trang */}
        <main className="page-container">
          {children}
        </main>

        {/* 5. Footer phía dưới */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;