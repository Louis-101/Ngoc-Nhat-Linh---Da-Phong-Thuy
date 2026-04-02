import React, { useEffect, useState } from 'react';
import { supabase } from '../../service/supabaseClient';
import { BarChart3, Package, FileText, Users, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { AdminProduct, AdminPost, AdminContact } from '../types';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    posts: 0,
    contacts: 0,
    revenue: 0,
    visitors: 0,
    loading: true
  });
  const [recentProducts, setRecentProducts] = useState<AdminProduct[]>([]);
  const [recentContacts, setRecentContacts] = useState<AdminContact[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecent();
  }, []);

  const fetchStats = async () => {
    const [productsRes, postsRes, contactsRes] = await Promise.all([
      supabase.from('products').select('count', { count: 'exact', head: true }),
      supabase.from('posts').select('count', { count: 'exact', head: true }),
      supabase.from('contacts').select('count', { count: 'exact', head: true })
    ]);

    setStats({
      products: productsRes.count || 0,
      posts: postsRes.count || 0,
      contacts: contactsRes.count || 0,
      revenue: 0, // Calculate from products
      visitors: 1234, // Analytics placeholder
      loading: false
    });
  };

  const fetchRecent = async () => {
    const [{ data: products }, { data: contacts }] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
    ]);
    
    setRecentProducts(products || []);
    setRecentContacts(contacts || []);
  };

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-linear-to-r from-slate-900 via-slate-800 to-emerald-900 bg-clip-text text-transparent">
            Tổng quan
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Chào mừng trở lại, Admin ✨
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm font-medium text-slate-500">
          <span><Clock size={18} className="inline mr-1" /> {new Date().toLocaleDateString('vi-VN')}</span>
          <span>•</span>
          <span>Online: 47</span>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <StatsCard 
          icon={Package} 
          title="Sản phẩm" 
          value={stats.products.toLocaleString()} 
          change="+12%" 
          color="from-emerald-500 to-teal-500"
        />
        <StatsCard 
          icon={FileText} 
          title="Bài viết" 
          value={stats.posts.toLocaleString()} 
          change="+3%" 
          color="from-indigo-500 to-purple-500"
        />
        <StatsCard 
          icon={Users} 
          title="Liên hệ" 
          value={stats.contacts.toLocaleString()} 
          change="+28%" 
          color="from-rose-500 to-pink-500"
        />
        <StatsCard 
          icon={DollarSign} 
          title="Doanh thu" 
          value="45.2M₫" 
          change="+15.3%" 
          color="from-gold to-amber-500"
        />
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <motion.div 
          className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700 shadow-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center">
            <Package className="mr-3 text-emerald-500 w-8 h-8" />
            Sản phẩm gần đây
          </h3>
          
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-xl border-2 border-slate-200 dark:border-slate-600"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{product.name}</h4>
                  <p className="text-sm text-slate-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600 text-lg">
                    {product.price?.toLocaleString('vi-VN')}₫
                  </p>
                  <p className="text-xs text-slate-500">Hôm nay</p>
                </div>
              </div>
            ))}
            {recentProducts.length === 0 && (
              <p className="text-center py-12 text-slate-500">Chưa có sản phẩm mới</p>
            )}
          </div>
        </motion.div>

        {/* Recent Contacts */}
        <motion.div 
          className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700 shadow-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center">
            <Users className="mr-3 text-rose-500 w-8 h-8" />
            Khách hàng mới
          </h3>
          
          <div className="space-y-4">
            {recentContacts.map((contact) => (
              <div key={contact.id} className="flex items-start space-x-4 p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 rounded-2xl flex items-center justify-center mt-1">
                  <Users size={20} className="text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900">{contact.name}</h4>
                  <p className="text-sm text-slate-500">{contact.phone}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{contact.message}</p>
                </div>
                <div className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(contact.created_at).toLocaleDateString('vi-VN')}
                </div>
              </div>
            ))}
            {recentContacts.length === 0 && (
              <p className="text-center py-12 text-slate-500">Chưa có liên hệ mới</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Reusable Stats Card
const StatsCard: React.FC<{
  icon: React.ElementType;
  title: string;
  value: string;
  change: string;
  color: string;
}> = ({ icon: Icon, title, value, change, color }) => (
  <motion.div 
    className="group bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700 shadow-xl hover:shadow-2xl hover:shadow-gold/25 hover:-translate-y-2 transition-all duration-500 cursor-default relative overflow-hidden"
    whileHover={{ scale: 1.02 }}
  >
    {/* Background gradient */}
    <div className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
    
    <div className="relative z-10 flex items-center justify-between">
      <div className="p-3 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl group-hover:shadow-lg transition-shadow">
        <Icon size={28} className={`text-slate-500 group-hover:text-gold transition-colors`} />
      </div>
      <div className="text-right">
        <p className="text-3xl font-serif font-bold bg-linear-to-r from-slate-900 via-slate-800 to-emerald-900 bg-clip-text text-transparent">
          {value}
        </p>
        <p className="text-sm font-medium text-slate-600 mt-1">{title}</p>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${change.startsWith('+') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'}`}>
        {change}
      </span>
    </div>
  </motion.div>
);

export default Dashboard;
