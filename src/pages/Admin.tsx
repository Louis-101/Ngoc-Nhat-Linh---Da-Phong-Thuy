import React, { useState, useEffect } from 'react';
import { supabase } from '../service/supabaseClient';
import { Plus, Trash2, Edit, Package, FileText, LogOut, Upload, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Navigate } from 'react-router-dom';

export default function Admin() {
  return <Navigate to="/admin" replace />;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'posts'>('products');
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const navigate = useNavigate();

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: 'Vòng tay',
    menh: 'Kim',
    description: '',
    meaning: '',
    image_url: ''
  });

  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    category: 'Phong thủy',
    content: '',
    author: 'Admin',
    image_url: ''
  });

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    checkUser();
    fetchData();
  }, [activeTab]);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate('/login');
  }

  async function fetchData() {
    setLoading(true);
    const { data } = await supabase
      .from(activeTab)
      .select('*')
      .order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s+]+/g, '-')
      .trim();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'products' | 'posts') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      setNotification({ type: 'error', message: 'Lỗi tải ảnh lên. Vui lòng thử lại.' });
      return;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    if (type === 'products') {
      setNewProduct({ ...newProduct, image_url: data.publicUrl });
    } else {
      setNewPost({ ...newPost, image_url: data.publicUrl });
    }
    setNotification({ type: 'success', message: 'Tải ảnh lên thành công!' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const table = activeTab;
    const payload = table === 'products' ? newProduct : newPost;

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from(table).update(payload).eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from(table).insert([payload]);
      error = insertError;
    }

    if (error) {
      setNotification({ type: 'error', message: `Lỗi: ${error.message}` });
    } else {
      setNotification({ type: 'success', message: editingId ? 'Cập nhật thành công!' : 'Đã thêm mới thành công!' });
      setIsAdding(false);
      setEditingId(null);
      setNewProduct({
        name: '', price: 0, category: 'Vòng tay', menh: 'Kim',
        description: '', meaning: '', image_url: ''
      });
      setNewPost({
        title: '',
        slug: '',
        category: 'Phong thủy',
        content: '',
        author: 'Admin',
        image_url: ''
      });
      fetchData();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      const { error } = await supabase.from(activeTab).delete().eq('id', id);
      if (error) setNotification({ type: 'error', message: 'Không thể xóa mục này.' });
      else {
        setNotification({ type: 'success', message: 'Đã xóa thành công!' });
        fetchData();
      }
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setIsAdding(true);
    if (activeTab === 'products') {
      setNewProduct({
        name: item.name, price: item.price, category: item.category,
        menh: item.menh, description: item.description, meaning: item.meaning, image_url: item.image_url
      });
    } else {
      setNewPost({ title: item.title, slug: item.slug, category: item.category, content: item.content, author: item.author, image_url: item.image_url });
    }
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-secondary">Bảng Quản Trị</h1>
          <button onClick={handleSignOut} className="flex items-center text-red-500 font-bold hover:underline">
            <LogOut size={18} className="mr-2" /> Đăng xuất
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-24 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-3 border animate-in fade-in slide-in-from-top-4 duration-300 ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {notification.type === 'success' ? <Check size={20} /> : <X size={20} />}
            <span className="font-bold text-sm">{notification.message}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center ${activeTab === 'products' ? 'bg-primary text-secondary' : 'bg-white text-secondary/40'}`}
          >
            <Package size={18} className="mr-2" /> Sản phẩm
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center ${activeTab === 'posts' ? 'bg-primary text-secondary' : 'bg-white text-secondary/40'}`}
          >
            <FileText size={18} className="mr-2" /> Bài viết
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-accent/20 overflow-hidden">
          <div className="p-6 border-b border-accent/10 flex justify-between items-center">
            <h2 className="text-xl font-bold text-secondary capitalize">{activeTab === 'products' ? 'Danh sách sản phẩm' : 'Danh sách bài viết'}</h2>
            {!isAdding && (
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center text-sm font-bold"
              >
                <Plus size={18} className="mr-1" /> Thêm mới
              </button>
            )}
          </div>

          {isAdding && (
            <div className="p-6 bg-accent/5 border-b border-accent/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-secondary">{editingId ? 'Cập nhật' : 'Thêm mới'} {activeTab === 'products' ? 'sản phẩm' : 'bài viết'}</h3>
                <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-secondary/40 hover:text-secondary"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab === 'products' ? (
                  <>
                <input 
                  placeholder="Tên sản phẩm" 
                  className="p-3 border rounded-lg outline-none focus:ring-1 focus:ring-primary"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
                <input 
                  type="number" 
                  placeholder="Giá (VNĐ)" 
                  className="p-3 border rounded-lg outline-none focus:ring-1 focus:ring-primary"
                  onChange={e => setNewProduct({...newProduct, price: parseInt(e.target.value)})}
                  required
                />
                    <select 
                      className="p-3 border rounded-lg outline-none"
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      {['Vòng tay', 'Mặt dây', 'Tượng phật', 'Vật phẩm', 'Linh vật', 'Bi ngọc'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select 
                      className="p-3 border rounded-lg outline-none"
                      value={newProduct.menh}
                      onChange={e => setNewProduct({...newProduct, menh: e.target.value})}
                    >
                      {['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <textarea 
                      placeholder="Mô tả ngắn" 
                      className="p-3 border rounded-lg outline-none md:col-span-2 h-24"
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    />
                    <textarea 
                      placeholder="Ý nghĩa phong thủy (Markdown)" 
                      className="p-3 border rounded-lg outline-none md:col-span-2 h-32"
                      value={newProduct.meaning}
                      onChange={e => setNewProduct({...newProduct, meaning: e.target.value})}
                    />
                  </>
                ) : (
                  <>
                    <input 
                      placeholder="Tiêu đề bài viết" 
                      className="p-3 border rounded-lg outline-none md:col-span-2"
                      value={newPost.title}
                      onChange={e => {
                        const title = e.target.value;
                        setNewPost({...newPost, title, slug: generateSlug(title)});
                      }}
                      required
                    />
                    <input 
                      placeholder="Slug (tự động)" 
                      className="p-3 border rounded-lg outline-none bg-gray-100"
                      value={newPost.slug}
                      readOnly
                    />
                    <select 
                      className="p-3 border rounded-lg outline-none"
                      value={newPost.category}
                      onChange={e => setNewPost({...newPost, category: e.target.value})}
                    >
                      {['Phong thủy', 'Đá quý', 'Cung mệnh', 'Đời sống'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <textarea 
                      placeholder="Nội dung bài viết (Markdown)" 
                      className="p-3 border rounded-lg outline-none md:col-span-2 h-64"
                      value={newPost.content}
                      onChange={e => setNewPost({...newPost, content: e.target.value})}
                      required
                    />
                  </>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2">Hình ảnh</label>
                  <input 
                    type="file" 
                    onChange={(e) => handleImageUpload(e, activeTab)} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-secondary hover:file:bg-primary/80" 
                  />
                  {(newProduct.image_url || newPost.image_url) && (
                    <img 
                      src={activeTab === 'products' ? newProduct.image_url : newPost.image_url} 
                      alt="Preview" 
                      className="mt-4 h-32 rounded-lg border" 
                    />
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="md:col-span-2 bg-secondary text-white py-4 rounded-xl font-bold hover:bg-secondary/90 shadow-lg disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'ĐANG XỬ LÝ...' : (editingId ? 'CẬP NHẬT' : 'ĐĂNG BÀI')}
                </button>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-accent/5 text-xs uppercase tracking-widest text-secondary/60">
                  <th className="px-6 py-4">Hình ảnh</th>
                  <th className="px-6 py-4">Tên / Tiêu đề</th>
                  <th className="px-6 py-4">Giá / Tác giả</th>
                  <th className="px-6 py-4">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-secondary/40">Đang tải dữ liệu...</td></tr>
                ) : products.map((item) => (
                  <tr key={item.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4">
                      <img src={item.image_url} alt="" className="w-12 h-12 object-cover rounded-lg border border-accent/20" />
                    </td>
                    <td className="px-6 py-4 font-bold text-secondary">{item.name || item.title}</td>
                    <td className="px-6 py-4 text-sm text-secondary/60">
                      {item.price ? new Intl.NumberFormat('vi-VN').format(item.price) + 'đ' : item.author}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button onClick={() => handleEdit(item)} className="text-blue-400 hover:text-blue-600"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 ml-4"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}