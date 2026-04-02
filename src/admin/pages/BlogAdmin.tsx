import React, { useState, useEffect } from 'react';
import { supabase } from '../../service/supabaseClient';
import { Search, Plus, Edit3, Trash2, Eye, Image, Filter, FileText, EyeOff, CheckCircle, X } from 'lucide-react';
import { AdminPost, PostFormData } from '../types';
import { motion } from 'motion/react';

const BlogAdmin: React.FC = () => {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    content: '',
    image_url: '',
    category: 'Phong thủy',
    author: 'Admin',
    published: true
  });

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      setNotification({ type: 'error', message: error.message });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setNotification({ type: 'error', message: 'Upload ảnh thất bại' });
      return;
    }

    const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
    setFormData({ ...formData, image_url: data.publicUrl });
    setNotification({ type: 'success', message: 'Upload ảnh thành công!' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = generateSlug(formData.title);
    const payload = { ...formData, slug };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase
        .from('posts')
        .update(payload)
        .eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('posts')
        .insert([payload]);
      error = insertError;
    }

    if (error) {
      setNotification({ type: 'error', message: error.message });
    } else {
      setNotification({ type: 'success', message: editingId ? 'Cập nhật thành công!' : 'Đăng bài mới thành công!' });
      setIsAdding(false);
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        image_url: '',
        category: 'Phong thủy',
        author: 'Admin',
        published: true
      });
      fetchPosts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xác nhận xóa bài viết này?')) return;
    
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      setNotification({ type: 'error', message: error.message });
    } else {
      setNotification({ type: 'success', message: 'Xóa thành công!' });
      fetchPosts();
    }
  };

  const handleEdit = (post: AdminPost) => {
    setEditingId(post.id);
    setIsAdding(true);
    setFormData({
      title: post.title,
      slug: post.slug || '',
      content: post.content,
      image_url: post.image_url || '',
      category: post.category || 'Phong thủy',
      author: post.author || 'Admin',
      published: post.published !== false // default true
    });
  };

  const renderContent = () => {
    if (previewMode) {
      return (
        <div 
          className="prose prose-slate dark:prose-invert max-w-none p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/50 min-h-50"
          dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br>') }}
        />
      );
    }
    return (
      <textarea
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        className="w-full p-6 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-transparent resize-vertical min-h-50 font-mono text-sm"
        placeholder="Viết nội dung bài viết ở đây... Hỗ trợ markdown đơn giản"
        rows={10}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Quản lý Bài viết</h1>
          <p className="text-slate-600 mt-1">{filteredPosts.length} bài viết</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-72 bg-white/50 dark:bg-slate-800/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold"
            />
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-linear-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <Plus size={20} className="inline mr-2" />
            Bài viết mới
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl shadow-xl border fixed top-24 right-6 z-50 max-w-sm ${
            notification.type === 'success'
              ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
              : 'bg-rose-100 border-rose-300 text-rose-800'
          }`}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              {editingId ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  previewMode
                    ? 'bg-slate-100 hover:bg-slate-200'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                {previewMode ? 'Chỉnh sửa' : 'Xem trước'}
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({
                    title: '', slug: '', content: '', image_url: '', category: 'Phong thủy', author: 'Admin', published: true
                  });
                }}
                className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Tiêu đề bài viết *"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({ ...formData, title, slug: generateSlug(title) });
              }}
              className="w-full p-4 border border-slate-200 rounded-2xl text-2xl font-serif font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            
            <input
              type="text"
              placeholder="Slug (tự động)"
              value={formData.slug}
              className="w-full p-4 border border-slate-200 bg-slate-50/50 rounded-2xl text-sm font-mono tracking-wider"
              readOnly
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="md:col-span-1 p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500"
              >
                <option>Phong thủy</option>
                <option>Đá quý</option>
                <option>Cung mệnh</option>
                <option>Đời sống</option>
                <option>Tâm linh</option>
              </select>
              
              <input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Tác giả"
                className="md:col-span-1 p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500"
              />

              <label className="md:col-span-1 flex items-center space-x-2 p-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                  {formData.published ? <CheckCircle size={20} className="text-emerald-500 inline mr-2" /> : <EyeOff size={20} className="text-slate-400 inline mr-2" />}
                  {formData.published ? 'Công khai' : 'Nháp'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-3">Hình ảnh đại diện</label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="blog-image"
                  />
                  <label htmlFor="blog-image" className="cursor-pointer flex flex-col items-center space-y-3">
                    <Image size={48} className="text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-700">Thêm ảnh bìa</p>
                      <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
                    </div>
                  </label>
                </div>
                {formData.image_url && (
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="mt-6 w-full h-48 object-cover rounded-2xl shadow-lg" 
                  />
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="text-sm font-bold text-slate-700 mb-3 flex items-center">
                  Nội dung bài viết <FileText className="ml-2 text-indigo-500" size={18} />
                </label>
                {renderContent()}
              </div>
            </div>

            <button
              type="submit"
              className="w-full lg:w-auto bg-linear-to-r from-indigo-500 to-purple-500 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              {editingId ? 'Cập nhật bài viết' : 'Đăng bài'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Posts List */}
      <motion.div
        className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-2xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p>Đang tải bài viết...</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-slate-200/50">
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <span>{filteredPosts.length} bài viết</span>
                <span>•</span>
                <span>{posts.filter(p => p.published).length} công khai</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    className={`group p-6 rounded-2xl border transition-all cursor-pointer ${
                      post.published 
                        ? 'border-emerald-200/50 bg-emerald-50/50 hover:border-emerald-300 hover:bg-emerald-100/70' 
                        : 'border-slate-200/30 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-100/50'
                    } hover:shadow-lg hover:shadow-emerald-200/50`}
                    whileHover={{ scale: 1.02 }}
                  >
                    {post.image_url && (
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-32 object-cover rounded-xl mb-4 shadow-md"
                      />
                    )}
                    <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{post.content?.substring(0, 100)}...</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full font-medium">
                        {post.category}
                      </span>
                      <span className="text-slate-500">
                        {post.author} • {new Date(post.created_at || '').toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center mt-4 space-x-2 pt-4 border-t border-slate-200/50">
                      <button 
                        onClick={() => handleEdit(post)}
                        className="flex-1 p-2 text-indigo-500 hover:bg-indigo-100 rounded-xl transition-colors text-sm"
                      >
                        <Edit3 size={16} className="inline mr-1" />
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="flex-1 p-2 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors text-sm"
                      >
                        <Trash2 size={16} className="inline mr-1" />
                        Xóa
                      </button>
                    </div>
                    {!post.published && (
                      <div className="mt-3 p-2 bg-rose-100/50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center justify-center">
                        <EyeOff size={14} className="mr-1" />
                        Bản nháp
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {filteredPosts.length > itemsPerPage && (
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/50 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Hiển thị {(currentPage - 1) * 10 + 1} đến {Math.min(currentPage * 10, filteredPosts.length)} của {filteredPosts.length} bài viết
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="p-2 disabled:opacity-50 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Trước
                  </button>
                  <span className="px-3 py-2 font-medium text-slate-700">{currentPage} / {Math.ceil(filteredPosts.length / itemsPerPage)}</span>
                  <button
                    disabled={currentPage === Math.ceil(filteredPosts.length / itemsPerPage)}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="p-2 disabled:opacity-50 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Sau
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

export default BlogAdmin;
