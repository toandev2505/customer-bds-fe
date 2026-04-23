import React, { useState, useEffect, useCallback } from 'react';
import '../App.css';

const CustomerManagementApp = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('active');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    diaChi: '',
    status: 1,
    ghiChu: ''
  });
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [showReqModal, setShowReqModal] = useState(false);
  const [reqFormData, setReqFormData] = useState({
    diaChi: '',
    minPrice: '',
    maxPrice: '',
    area: '',
    note: ''
  });

  const API_BASE = 'https://bds-management-be.onrender.com/api';

  // Tải danh sách khách hàng
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/customer`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      const customersData = data.data || data;
      
      const validCustomers = Array.isArray(customersData) 
        ? customersData
            .filter(c => c && c.id != null && c.fullName != null)
            .map(c => ({
              ...c,
              status: Number(c.status)
            })) 
        : [];
      
      setCustomers(validCustomers);
    } catch (err) {
      console.error('Load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Xử lý lọc và tìm kiếm
  useEffect(() => {
    let baseData = [];
    
    if (currentView === 'active') {
      baseData = customers.filter(c => c.status === 1);
    } else if (currentView === 'inactive') {
      baseData = customers.filter(c => c.status === 0);
    }

    const searched = baseData.filter(customer => {
      if (!customer) return false;
      const name = (customer.fullName || "").toLowerCase();
      const phone = (customer.phone || "");
      const search = searchTerm.toLowerCase();
      return name.includes(search) || phone.includes(search);
    });

    setFilteredCustomers(searched);
  }, [searchTerm, customers, currentView]);

  // Chuyển khách hàng sang ngưng hoạt động (XÓA MỀM)
  const deactivateCustomer = async (id, customerName, customerData) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn chuyển khách hàng "${customerName}" sang trạng thái NGƯNG HOẠT ĐỘNG?`
    );
    
    if (!confirmDelete) return;

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/customer/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fullName: customerData.fullName,
          phone: customerData.phone,
          email: customerData.email || "",
          diaChi: customerData.diaChi || "",
          status: 0,
          ghiChu: customerData.ghiChu || ""
        })
      });

      if (response.ok) {
        alert(`✅ Đã chuyển khách hàng "${customerName}" sang ngưng hoạt động!`);
        await loadCustomers();
        setCurrentView('inactive');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`❌ Thất bại: ${errorData.message || 'Không thể cập nhật trạng thái'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Lỗi kết nối: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Kích hoạt lại khách hàng
  const activateCustomer = async (id, customerName, customerData) => {
    const confirmActivate = window.confirm(
      `Bạn có chắc chắn muốn KÍCH HOẠT LẠI khách hàng "${customerName}"?`
    );
    
    if (!confirmActivate) return;

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/customer/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fullName: customerData.fullName,
          phone: customerData.phone,
          email: customerData.email || "",
          diaChi: customerData.diaChi || "",
          status: 1,
          ghiChu: customerData.ghiChu || ""
        })
      });

      if (response.ok) {
        alert(`✅ Đã kích hoạt lại khách hàng "${customerName}"!`);
        await loadCustomers();
        setCurrentView('active');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`❌ Thất bại: ${errorData.message || 'Không thể cập nhật trạng thái'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Lỗi kết nối: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Thêm khách hàng mới
  const addCustomer = async () => {
    if (!formData.fullName || !formData.phone) {
      alert('Vui lòng nhập tên và số điện thoại');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/customer`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ ...formData, status: 1 })
      });
      if (response.ok) {
        await loadCustomers();
        setShowModal(false);
        setFormData({ fullName: '', phone: '', email: '', diaChi: '', status: 1, ghiChu: '' });
        alert('✅ Thêm khách hàng thành công!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`❌ Thêm thất bại: ${errorData.message || 'Lỗi không xác định'}`);
      }
    } catch (err) {
      alert('❌ Lỗi kết nối: ' + err.message);
    }
  };

  // Cập nhật thông tin khách hàng
  const updateCustomer = async () => {
    try {
      const response = await fetch(`${API_BASE}/customer/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        await loadCustomers();
        setShowModal(false);
        setSelectedCustomer(null);
        alert('✅ Cập nhật thành công!');
      } else {
        alert('❌ Cập nhật thất bại');
      }
    } catch (err) {
      alert('❌ Lỗi kết nối: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openEdit = (customer) => {
    setModalMode('edit');
    setSelectedCustomer(customer);
    setFormData({
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email || '',
      diaChi: customer.diaChi || '',
      status: customer.status,
      ghiChu: customer.ghiChu || ''
    });
    setShowModal(true);
  };

  const openAdd = () => {
    setModalMode('add');
    setFormData({ fullName: '', phone: '', email: '', diaChi: '', status: 1, ghiChu: '' });
    setShowModal(true);
  };

  // Xem chi tiết nhu cầu
  const loadRequirements = useCallback(async (customerId) => {
    setReqLoading(true);
    try {
      const res = await fetch(`${API_BASE}/customer/requirement?customerId=${customerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRequirements(data.data || data || []);
    } catch (err) {
      console.error("Load requirements error:", err);
      setRequirements([]);
    } finally {
      setReqLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    if (currentView === 'detail' && selectedCustomer?.id) {
      loadRequirements(selectedCustomer.id);
    } else {
      setRequirements([]);
    }
  }, [currentView, selectedCustomer?.id, loadRequirements]);

  // Giao diện Chi tiết
  const CustomerDetail = ({ customer, onBack }) => (
    <div className="min-h-screen bg-[#f5f5f3] p-6">
      
      {/* Back */}
      <button
        onClick={onBack}
        className="text-gray-500 mb-6 flex items-center gap-2"
      >
        ← Quay lại danh sách
      </button>

      <div className="bg-white rounded-2xl shadow-sm border flex overflow-hidden h-[calc(100vh-120px)]">
        
        {/* LEFT */}
        <div className="w-[360px] p-8 border-r flex flex-col gap-6">
          
          {/* Avatar */}
          <div className="w-16 h-16 bg-black text-white rounded-xl flex items-center justify-center text-2xl font-bold">
            {(customer.fullName || "?")[0].toUpperCase()}
          </div>

          {/* Name */}
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              {customer.fullName}
            </h1>

            <span className={`px-3 py-1 text-sm rounded-full ${
              customer.status === 1
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}>
              {customer.status === 1 ? "Hoạt động" : "Ngưng"}
            </span>
          </div>

          {/* Info */}
          <div className="space-y-4 text-sm">
            
            <div className="flex justify-between">
              <span className="text-gray-400">ID</span>
              <span className="font-medium">#{customer.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">ĐIỆN THOẠI</span>
              <span className="font-mono">{customer.phone || "—"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">EMAIL</span>
              <span>{customer.email || "—"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">ĐỊA CHỈ</span>
              <span className="text-right max-w-[200px]">
                {customer.diaChi || "Chưa cập nhật"}
              </span>
            </div>
          </div>

          {/* Note */}
          {customer.ghiChu && (
            <div className="border-l-2 pl-3 text-gray-500 text-sm">
              <p className="text-xs uppercase text-gray-400 mb-1">Ghi chú</p>
              {customer.ghiChu}
            </div>
          )}

          {/* Edit button */}
          <button
            onClick={() => openEdit(customer)}
            className="mt-auto bg-black text-white py-3 rounded-xl font-medium hover:opacity-90"
          >
            Chỉnh sửa thông tin
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex-1 p-8 bg-[#fafaf8] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-semibold">Nhu cầu BĐS</h2>
            <span className="bg-gray-200 text-sm px-2 py-0.5 rounded-full">
              {requirements.length}
            </span>
          </div>

          {/* CONTENT SCROLL */}
          <div className="flex-1 overflow-hidden">
            {reqLoading ? (
              <p>Đang tải...</p>
            ) : requirements.length === 0 ? (
              <div className="text-center text-gray-400 border border-dashed rounded-xl p-10">
                Chưa có nhu cầu nào được ghi nhận
              </div>
            ) : (
              <div className="space-y-4 h-full overflow-y-auto pr-2">
                {requirements.map((req, idx) => (
                  <div key={idx} className="bg-white border rounded-xl p-5">
                    
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-gray-400">VỊ TRÍ</span>
                      <span className="text-right">{req.diaChi}</span>

                      <span className="text-gray-400">NGÂN SÁCH</span>
                      <span className="text-right">
                        {(req.minPrice / 1e9).toFixed(1)} tỷ – {(req.maxPrice / 1e9).toFixed(1)} tỷ
                      </span>

                      <span className="text-gray-400">DIỆN TÍCH</span>
                      <span className="text-right">{req.area} m²</span>
                    </div>

                    {req.note && (
                      <div className="mt-3 pt-3 border-t text-gray-500 text-sm italic">
                        {req.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );

  if (currentView === 'detail' && selectedCustomer) {
    return (
      <div className="min-h-screen bg-gray-100">
        <CustomerDetail customer={selectedCustomer} onBack={() => {
          setSelectedCustomer(null);
          setCurrentView('active');
        }} />

        {/* MODAL CHỈNH SỬA KHÁCH HÀNG */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-5">
                {modalMode === "add" ? "Thêm khách hàng" : "Cập nhật khách hàng"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase">Tên *</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase">Điện thoại *</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase">Địa chỉ</label>
                  <input
                    name="diaChi"
                    value={formData.diaChi}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs text-gray-400 uppercase">Ghi chú</label>
                <textarea
                  name="ghiChu"
                  value={formData.ghiChu}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 w-full p-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              {/* ACTION */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setShowReqModal(true)}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600"
                >
                  + Thêm nhu cầu
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 rounded-xl border text-gray-500 hover:bg-gray-100"
                  >
                    Hủy
                  </button>

                  <button
                    onClick={modalMode === "add" ? addCustomer : updateCustomer}
                    className="px-5 py-2 rounded-xl bg-black text-white font-medium hover:opacity-90"
                  >
                    Lưu lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL THÊM NHU CẦU */}
        {showReqModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-5">
                Thêm nhu cầu BĐS
              </h2>

              <div className="space-y-3">
                <input
                  placeholder="Địa chỉ"
                  value={reqFormData.diaChi}
                  onChange={(e) =>
                    setReqFormData({ ...reqFormData, diaChi: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input
                  placeholder="Giá tối thiểu"
                  value={reqFormData.minPrice}
                  onChange={(e) =>
                    setReqFormData({ ...reqFormData, minPrice: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input
                  placeholder="Giá tối đa"
                  value={reqFormData.maxPrice}
                  onChange={(e) =>
                    setReqFormData({ ...reqFormData, maxPrice: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input
                  placeholder="Diện tích"
                  value={reqFormData.area}
                  onChange={(e) =>
                    setReqFormData({ ...reqFormData, area: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />

                <textarea
                  placeholder="Ghi chú"
                  value={reqFormData.note}
                  onChange={(e) =>
                    setReqFormData({ ...reqFormData, note: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowReqModal(false)}
                  className="px-5 py-2 border rounded-xl text-gray-500 hover:bg-gray-100"
                >
                  Hủy
                </button>

                <button
                  onClick={() => {
                    console.log(reqFormData);
                    setShowReqModal(false);
                  }}
                  className="px-5 py-2 bg-black text-white rounded-xl font-medium hover:opacity-90"
                >
                  Lưu nhu cầu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Đang tải dữ liệu khách hàng...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <h2 className="text-2xl mb-4">Có lỗi xảy ra: {error}</h2>
        <button onClick={loadCustomers} className="bg-blue-500 text-white px-6 py-2 rounded-lg">
          Thử tải lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex gap-8 max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg rounded-xl p-6 h-fit">
          <div className="space-y-2 mb-6">
            <button 
              onClick={() => setCurrentView('active')}
              className={`w-full p-3 rounded-lg text-left ${currentView === 'active' ? 'bg-emerald-500 text-white' : 'hover:bg-gray-100'}`}
            >
              🟢 Đang hoạt động ({customers.filter(c => c.status === 1).length})
            </button>
            <button 
              onClick={() => setCurrentView('inactive')}
              className={`w-full p-3 rounded-lg text-left ${currentView === 'inactive' ? 'bg-red-500 text-white' : 'hover:bg-gray-100'}`}
            >
              🔴 Ngưng hoạt động ({customers.filter(c => c.status === 0).length})
            </button>
          </div>
          <button onClick={openAdd} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold">
            + Thêm khách hàng
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white shadow-lg rounded-xl p-8">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Tìm tên hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="overflow-x-auto">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>Không tìm thấy khách hàng nào.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-4">ID</th>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Điện thoại</th>
                    <th className="p-4">Địa chỉ</th>
                    <th className="p-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-500">{customer.id}</td>
                      <td className="p-4 font-bold">{customer.fullName}</td>
                      <td className="p-4">{customer.phone}</td>
                      <td className="p-4 text-gray-600">{customer.diaChi || '-'}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => { 
                              setSelectedCustomer(customer); 
                              setCurrentView('detail'); 
                            }} 
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                            title="Xem chi tiết"
                          >
                            👁️
                          </button>
                          <button 
                            onClick={() => openEdit(customer)} 
                            className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"
                            title="Sửa thông tin"
                          >
                            ✏️
                          </button>
                          {currentView === 'active' ? (
                            <button 
                              onClick={() => deactivateCustomer(customer.id, customer.fullName, customer)} 
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                              title="Chuyển sang ngưng hoạt động"
                            >
                              🔴
                            </button>
                          ) : (
                            <button 
                              onClick={() => activateCustomer(customer.id, customer.fullName, customer)} 
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                              title="Kích hoạt lại"
                            >
                              ✅
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">{modalMode === 'add' ? 'Thêm mới' : 'Cập nhật'}</h2>
            <div className="space-y-4">
              <input 
                name="fullName" 
                placeholder="Tên khách hàng *" 
                value={formData.fullName} 
                onChange={handleInputChange} 
                className="w-full p-3 border rounded-xl" 
                required 
              />
              <input 
                name="phone" 
                placeholder="Số điện thoại *" 
                value={formData.phone} 
                onChange={handleInputChange} 
                className="w-full p-3 border rounded-xl" 
                required 
              />
              <input 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className="w-full p-3 border rounded-xl" 
              />
              <input 
                name="diaChi" 
                placeholder="Địa chỉ" 
                value={formData.diaChi} 
                onChange={handleInputChange} 
                className="w-full p-3 border rounded-xl" 
              />
              <textarea 
                name="ghiChu" 
                placeholder="Ghi chú" 
                value={formData.ghiChu} 
                onChange={handleInputChange} 
                className="w-full p-3 border rounded-xl" 
                rows="3" 
              />
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-6 py-2 text-gray-500 rounded-xl hover:bg-gray-100"
              >
                Hủy
              </button>
              <button 
                onClick={modalMode === 'add' ? addCustomer : updateCustomer} 
                className="bg-emerald-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-emerald-700"
              >
                Lưu lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagementApp;