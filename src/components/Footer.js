import React from 'react'; 

const Footer = () => (
  <footer className="bg-white border-t border-slate-100 py-6">
    <div className="max-w-[1440px] mx-auto px-8 flex justify-between items-center">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">© 2026 EstateCRM Project Team</p>
      <div className="flex gap-4 text-[11px] font-bold text-[#14b8a6] uppercase cursor-pointer">
        <span>Báo cáo lỗi</span>
        <span>Hướng dẫn</span>
      </div>
    </div>
  </footer>
);
export default Footer;