import React, { useState, useEffect } from 'react';
import { supabase } from '../../service/supabaseClient';
import { Search, Trash2, Phone, Mail, Users, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminContact } from '../types';
import { motion } from 'motion/react';

const ContactsAdmin: React.FC = () => {
  const [contacts, setContacts] = useState<AdminContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'week'>('all');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'today' && isToday(contact.created_at)) ||
      (filterStatus === 'week' && isThisWeek(contact.created_at));

    return matchesSearch && matchesFilter;
  });

  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      setNotification({ type: 'error', message: error.message });
    } else {
      setContacts(data || []);
    }
    setLoading(false);
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isThisWeek = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const firstDayWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return date >= firstDayWeek;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xác nhận xóa liên hệ này?')) return;
    
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) {
      setNotification({ type: 'error', message: error.message });
    } else {
      setNotification({ type: 'success', message: 'Xóa thành công!' });
      fetchContacts();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Xác nhận xóa ${selectedIds.length} liên hệ đã chọn?`)) return;
    
    const { error } = await supabase
      .from('contacts')
      .delete()
      .in('id', selectedIds);
    
    if (error) {
      setNotification({ type: 'error', message: error.message });
    } else {
      setNotification({ type: 'success', message: `Đã xóa ${selectedIds.length} liên hệ!` });
      setSelectedIds([]);
      fetchContacts();
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedContacts.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Quản lý Liên hệ</h1>
          <p className="text-slate-600 mt-1">
            {filteredContacts.length} / {contacts.length} liên hệ {filterStatus !== 'all' && `(đã lọc)`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, sđt, tin nhắn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-full bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center"
            >
              <Trash2 size={18} className="mr-2" />
              Xóa {selectedIds.length}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/50 shadow-lg">
        <div className="flex items-center space-x-1 text-sm font-medium">
          <span>Lọc:</span>
          {(['all', 'today', 'week'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl transition-colors ${
                filterStatus === status
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900'
              }`}
            >
              {status === 'all' ? 'Tất cả' : status === 'today' ? 'Hôm nay' : 'Tuần này'}
            </button>
          ))}
        </div>
        <div className="ml-auto text-sm text-slate-500">
          Đã chọn: {selectedIds.length} / {filteredContacts.length}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 rounded-2xl shadow-xl border max-w-md mx-auto fixed top-24 left-6 z-50 bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900/30"
        >
          {notification.message}
        </motion.div>
      )}

      {/* Contacts Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-2xl overflow-hidden"
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Đang tải danh sách liên hệ...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-rose-50/50 dark:bg-rose-900/20 text-sm uppercase text-rose-600 tracking-wider">
                    <th className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === paginatedContacts.length && paginatedContacts.length > 0}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="rounded border-rose-300 text-rose-500 focus:ring-rose-500 w-5 h-5"
                      />
                    </th>
                    <th className="px-6 py-4">Khách hàng</th>
                    <th className="px-6 py-4">Liên hệ</th>
                    <th className="px-6 py-4">Tin nhắn</th>
                    <th className="px-6 py-4 text-right">Thời gian</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700">
                  {paginatedContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-rose-50/30 dark:hover:bg-rose-900/20 transition-colors group">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(contact.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, contact.id]);
                            } else {
                              setSelectedIds(selectedIds.filter(id => id !== contact.id));
                            }
                          }}
                          className="rounded border-slate-300 text-rose-500 focus:ring-rose-500 w-5 h-5"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{contact.name}</div>
                        {contact.email && <div className="text-sm text-slate-500">{contact.email}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center text-sm font-medium">
                            <Phone size={16} className="mr-2 text-emerald-500" />
                            {contact.phone}
                          </div>
                          {contact.ip_address && (
                            <div className="text-xs text-slate-500">
                              IP: {contact.ip_address}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-lg">
                        <p className="line-clamp-2 text-sm text-slate-700">{contact.message}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-xs text-slate-500">
                          {new Date(contact.created_at).toLocaleString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="p-2 text-rose-500 hover:bg-rose-100 rounded-xl transition-all group-hover:scale-110"
                          title="Xóa liên hệ"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedContacts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        <Users size={64} className="mx-auto text-slate-300 mb-4" />
                        <p>Chưa có liên hệ nào {filterStatus !== 'all' ? `trong ${filterStatus}` : ''}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredContacts.length > itemsPerPage && (
              <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-700/30 border-t border-slate-200/50 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{' '}
                  {Math.min(currentPage * itemsPerPage, filteredContacts.length)} của{' '}
                  {filteredContacts.length} liên hệ
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    className="p-2 text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl hover:text-slate-900 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="px-4 py-2 font-medium text-slate-700 min-w-12 text-center">
                    {currentPage} / {Math.ceil(filteredContacts.length / itemsPerPage)}
                  </span>
                  <button
                    disabled={currentPage === Math.ceil(filteredContacts.length / itemsPerPage)}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredContacts.length / itemsPerPage)))}
                    className="p-2 text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl hover:text-slate-900 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ContactsAdmin;
