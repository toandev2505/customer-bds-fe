// src/components/Navbar.js
import React from 'react';

const Navbar = ({ pageTitle }) => {
  const user = { initials: "AD", name: "Administrator" };

  return (
    <header className="header">
      <div className="header-title">{pageTitle || "Trang chủ"}</div>
      
      <div className="header-actions">
        {/* Có thể thêm nút thông báo ở đây */}
        <div className="user-profile">
          <div className="user-avatar">{user.initials}</div>
          <span className="user-name">{user.name}</span>
          <span className="dropdown-icon">▼</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;