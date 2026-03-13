import React, { useState, useEffect } from 'react';
import './App.css';

const CustomerManagementApp = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('list');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    id: '',
    ten: '',
    sdt: '',
    email: '',
    diaChi: '',
    loaiBDS: 'Căn hộ',
    nganSach: '',
    trangThai: 'Lead',
    ghiChu: ''
  });
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const propertyTypes = ['Căn hộ', 'Chung cư', 'Đất nền', 'Nhà phố', 'Biệt thự'];
  const statuses = ['Lead', 'Liên hệ', 'Dự kiến', 'Ký hợp đồng', 'Bán'];

  const getStatusColor = (status) => {
    const colors = {
      'Lead': 'bg-yellow-100 text-yellow-800',
      'Liên hệ': 'bg-blue-100 text-blue-800',
      'Dự kiến': 'bg-orange-100 text-orange-800',
      'Ký hợp đồng': 'bg-green-100 text-green-800',
      'Bán': 'bg-emerald-100 text-emerald-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    const saved = localStorage.getItem('customers');
    if (saved) {
      setCustomers(JSON.parse(saved));
    } else {
      // Fake data
      const fakeData = [
        { id: 1, ten: 'Nguyễn Văn A', sdt: '0123456789', email: 'a@example.com', diaChi: 'Q1, TP.HCM', loaiBDS: 'Căn hộ', nganSach: '2 tỷ', trangThai: 'Lead', ghiChu: 'Quan tâm căn hộ trung tâm' },
        { id: 2, ten: 'Trần Thị B', sdt: '0987654321', email: 'b@example.com', diaChi: 'Q7, TP.HCM', loaiBDS: 'Biệt thự', nganSach: '10 tỷ', trangThai: 'Ký hợp đồng', ghiChu: 'Đã đặt cọc biệt thự ven sông' },
        { id: 3, ten: 'Lê Văn C', sdt: '0111222333', email: 'c@example.com', diaChi: 'Bình Dương', loaiBDS: 'Đất nền', nganSach: '500 triệu', trangThai: 'Liên hệ', ghiChu: '' }
      ];
      setCustomers(fakeData);
      localStorage.setItem('customers', JSON.stringify(fakeData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.sdt.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const addCustomer = () => {
    const newCustomer = { ...formData, id: Date.now() };
    setCustomers([...customers, newCustomer]);
    setShowModal(false);
    setFormData({ id: '', ten: '', sdt: '', email: '', diaChi: '', loaiBDS: 'Căn hộ', nganSach: '', trangThai: 'Lead', ghiChu: '' });
  };

  const updateCustomer = () => {
    setCustomers(customers.map(c => c.id === selectedCustomer.id ? { ...formData, id: selectedCustomer.id } : c));
    setShowModal(false);
    setSelectedCustomer(null);
    setFormData({ id: '', ten: '', sdt: '', email: '', diaChi: '', loaiBDS: 'Căn hộ', nganSach: '', trangThai: 'Lead', ghiChu: '' });
  };

  const deleteCustomer = (id) => {
    if (window.confirm('Xác nhận xóa khách hàng?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openEdit = (customer) => {
    setModalMode('edit');
    setSelectedCustomer(customer);
    setFormData(customer);
    setShowModal(true);
  };

  const openAdd = () => {
    setModalMode('add');
    setFormData({ id: '', ten: '', sdt: '', email: '', diaChi: '', loaiBDS: 'Căn hộ', nganSach: '', trangThai: 'Lead', ghiChu: '' });
    setShowModal(true);
  };

  const stats = {
    total: customers.length,
    lead: customers.filter(c => c.trangThai === 'Lead').length,
    sold: customers.filter(c => c.trangThai === 'Bán').length
  };

  const CustomerDetail = ({ customer, onBack }) => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-12 text-white text-center">
          <i className="fas fa-user-circle text-8xl opacity-75 mb-6"></i>
          <h1 className="text-4xl font-bold mb-2">{customer.ten}</h1>
          <span className={`px-4 py-2 rounded-full text-lg font-semibold ${getStatusColor(customer.trangThai)} bg-white/20 backdrop-blur-sm`}>
            {customer.trangThai}
          </span>
        </div>
        <div className="p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <i className="fas fa-info-circle text-emerald-500 mr-3"></i>
                Thông tin liên hệ
              </h3>
              <div className="space-y-4 text-lg">
                <div><i className="fas fa-phone text-emerald-500 mr-4"></i><strong>SĐT:</strong> {customer.sdt}</div>
                <div><i className="fas fa-envelope text-emerald-500 mr-4"></i><strong>Email:</strong> {customer.email}</div>
                <div><i className="fas fa-map-marker-alt text-emerald-500 mr-4"></i><strong>Địa chỉ:</strong> {customer.diaChi}</div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <i className="fas fa-building text-emerald-500 mr-3"></i>
                Thông tin đầu tư
              </h3>
              <div className="space-y-4 text-lg">
                <div><i className="fas fa-home text-emerald-500 mr-4"></i><strong>Loại BĐS:</strong> {customer.loaiBDS}</div>
                <div><i className="fas fa-wallet text-emerald-500 mr-4"></i><strong>Ngân sách:</strong> <span className="text-emerald-600 font-bold text-2xl">{customer.nganSach}</span></div>
              </div>
            </div>
          </div>
          {customer.ghiChu && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <i className="fas fa-sticky-note text-emerald-500 mr-3"></i>
                Ghi chú
              </h3>
              <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-emerald-500">
                <p className="text-lg leading-relaxed">{customer.ghiChu}</p>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
            <button
              onClick={onBack}
              className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-4 px-8 rounded-xl transition-all transform hover:-translate-y-1 flex items-center justify-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Quay lại danh sách
            </button>
            <button
              className="flex-1 sm:flex-none bg-white border-2 border-emerald-500 hover:bg-emerald-50 text-emerald-600 font-medium py-4 px-8 rounded-xl transition-all hover:shadow-lg"
            >
              <i className="fas fa-print mr-2"></i>
              In thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentView === 'detail' && selectedCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        <CustomerDetail customer={selectedCustomer} onBack={() => setCurrentView('list')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-emerald-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <i className="fas fa-building text-3xl text-emerald-600 mr-3"></i>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khách Hàng BĐS</h1>
                <p className="text-emerald-600 font-medium">Công ty Bất Động Sản</p>
              </div>
            </div>
            <div className="stats-overview flex space-x-4 text-sm font-medium">
              <div className="text-center p-2 bg-emerald-100 rounded-lg">
                <div className="text-2xl font-bold text-emerald-800">{stats.total}</div>
                <div>Tổng KH</div>
              </div>
              <div className="text-center p-2 bg-yellow-100 rounded-lg">
                <div className="text-2xl font-bold text-yellow-800">{stats.lead}</div>
                <div>Lead mới</div>
              </div>
              <div className="text-center p-2 bg-emerald-100 rounded-lg">
                <div className="text-2xl font-bold text-emerald-800">{stats.sold}</div>
                <div>Đã bán</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto px-4 py-8 gap-8">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-card rounded-xl p-6 sticky top-8 h-fit">
          <nav className="space-y-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center p-3 rounded-lg transition-all ${
                currentView === 'dashboard' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-chart-bar mr-3"></i>
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className={`w-full flex items-center p-3 rounded-lg transition-all ${
                currentView === 'list' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-users mr-3"></i>
              Danh sách KH ({customers.length})
            </button>
            <button
              onClick={openAdd}
              className="w-full flex items-center p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              <i className="fas fa-plus mr-3"></i>
              Thêm khách hàng
            </button>
          </nav>
        </aside>

        <main className="flex-1">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <i className="fas fa-chart-pie text-emerald-500 mr-3"></i>
                Thống kê
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white shadow-card rounded-xl p-8 text-center shadow-hover">
                  <i className="fas fa-users text-4xl text-emerald-500 mb-4"></i>
                  <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-gray-600 font-medium">Tổng khách hàng</div>
                </div>
                <div className="bg-white shadow-card rounded-xl p-8 text-center shadow-hover">
                  <i className="fas fa-user-plus text-4xl text-yellow-500 mb-4"></i>
                  <div className="text-3xl font-bold text-gray-900">{stats.lead}</div>
                  <div className="text-gray-600 font-medium">Lead mới</div>
                </div>
                <div className="bg-white shadow-card rounded-xl p-8 text-center shadow-hover">
                  <i className="fas fa-handshake text-4xl text-green-500 mb-4"></i>
                  <div className="text-3xl font-bold text-gray-900">{stats.sold}</div>
                  <div className="text-gray-600 font-medium">Đã bán</div>
                </div>
                <div className="bg-white shadow-card rounded-xl p-8 text-center shadow-hover">
                  <i className="fas fa-dollar-sign text-4xl text-blue-500 mb-4"></i>
                  <div className="text-3xl font-bold text-gray-900">
                    {customers.reduce((sum, c) => sum + parseFloat(c.nganSach.replace(/[^0-9]/g, '') || 0), 0).toLocaleString()} tỷ
                  </div>
                  <div className="text-gray-600 font-medium">Tổng ngân sách</div>
                </div>
              </div>
              <div className="mt-12 bg-white shadow-card rounded-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Khách hàng gần đây</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại BDS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N.g sách</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.slice(-5).reverse().map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => {setSelectedCustomer(customer); setCurrentView('detail');}}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{customer.ten}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.loaiBDS}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.trangThai)}`}>
                              {customer.trangThai}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">{customer.nganSach}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Customer List */}
          {currentView === 'list' && (
            <div>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex-1 flex items-center">
                  <i className="fas fa-list text-emerald-500 mr-3"></i>
                  Danh sách khách hàng ({filteredCustomers.length})
                </h2>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, SĐT, email..."
                  className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="bg-white shadow-card rounded-xl overflow-hidden">
                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-users text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy khách hàng</h3>
                    <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-emerald-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tên khách</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">SĐT</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Loại BDS</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Trạng thái</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">N.g sách</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{customer.ten}</div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.sdt}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.loaiBDS}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.trangThai)}`}>
                                {customer.trangThai}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">{customer.nganSach}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button
                                onClick={() => {setSelectedCustomer(customer); setCurrentView('detail');}}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Chi tiết"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                onClick={() => openEdit(customer)}
                                className="text-emerald-600 hover:text-emerald-900"
                                title="Sửa"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => deleteCustomer(customer.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Xóa"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <i className={`fas fa-${modalMode === 'add' ? 'plus' : 'edit'} mr-3 text-emerald-500`}></i>
                {modalMode === 'add' ? 'Thêm khách hàng mới' : 'Chỉnh sửa khách hàng'}
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên khách hàng *</label>
                  <input
                    type="text"
                    name="ten"
                    value={formData.ten}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="sdt"
                    value={formData.sdt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                  <input
                    type="text"
                    name="diaChi"
                    value={formData.diaChi}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại BĐS *</label>
                  <select
                    name="loaiBDS"
                    value={formData.loaiBDS}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngân sách</label>
                  <input
                    type="text"
                    name="nganSach"
                    value={formData.nganSach}
                    onChange={handleInputChange}
                    placeholder="VD: 2 tỷ"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái *</label>
                <select
                  name="trangThai"
                  value={formData.trangThai}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  name="ghiChu"
                  value={formData.ghiChu}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-vertical"
                  placeholder="Thông tin thêm về khách hàng..."
                />
              </div>
            </div>
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={modalMode === 'add' ? addCustomer : updateCustomer}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium flex items-center"
              >
                <i className="fas fa-save mr-2"></i>
                {modalMode === 'add' ? 'Thêm mới' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return <CustomerManagementApp />;
}

export default App;

function App() {
  return <p>Trang đang được phát triển. Vui lòng truy cập sau.</p>;
}

export default App;
