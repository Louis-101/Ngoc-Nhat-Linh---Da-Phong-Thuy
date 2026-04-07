import React, { useState, useEffect } from 'react';
import { supabase } from '../../service/supabaseClient';
import { Search, Plus, Edit3, Trash2, Eye, Image, Filter, Grid, List, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { uploadProductImage } from '../../service/imageService';
import { AdminProduct, ProductFormData } from '../types';
import { motion } from 'motion/react';

const ProductsAdmin: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    image_url: '',
    category: 'Vòng tay',
    description: '',
    menh: 'Kim',
    meaning: '',
    stock: 0
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      setNotification({ type: 'error', message: error.message });
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const publicUrl = await uploadProductImage(file, Date.now().toString(), 'product-images');
    
    if (!publicUrl || publicUrl.includes('picsum.photos')) {
      setNotification({ type: 'error', message: 'Upload ảnh thất bại. Vui lòng kiểm tra quyền Storage.' });
      return;
    }

    setFormData(prev => ({ ...prev, image_url: publicUrl }));
    setNotification({ type: 'success', message: 'Upload ảnh thành công!' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('products')
        .insert([payload]);
      error = insertError;
    }

    if (error) {
      setNotification({ type: 'error', message: error.message });
    } else {
      setNotification({ type: 'success', message: editingId ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!' });
      setIsAdding(false);
      setEditingId(null);
      resetForm();
      fetchProducts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xác nhận xóa sản phẩm này?')) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      setNotification({ type: 'error', message: error.message });
    } else {
      setNotification({ type: 'success', message: 'Xóa thành công!' });
      fetchProducts();
    }
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setIsAdding(true);
    setFormData({
      name: product.name,
      price: product.price || 0,
      image_url: product.image_url || '',
      category: product.category || '',
      description: product.description || '',
      menh: product.menh || '',
      meaning: product.meaning || '',
      stock: product.stock || 0
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      image_url: '',
      category: 'Vòng tay',
      description: '',
      menh: 'Kim',
      meaning: '',
      stock: 0
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Quản lý Sản phẩm</h1>
          <p className="text-slate-600 mt-1">{filteredProducts.length} sản phẩm</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-72 bg-white/50 dark:bg-slate-800/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-linear-to-r from-gold to-amber-500 text-slate-900 px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <Plus size={20} className="inline mr-2" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-end">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-xl ${viewMode === 'table' ? 'bg-gold text-slate-900 shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl ${viewMode === 'grid' ? 'bg-gold text-slate-900 shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Grid size={18} />
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
              ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30'
              : 'bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900/30'
          }`}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              {editingId ? 'Chỉnh sửa' : 'Thêm sản phẩm mới'}
            </h2>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                resetForm();
              }}
              className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              placeholder="Tên sản phẩm *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-transparent"
              required
            />
            <input
              type="number"
              placeholder="Giá (VNĐ) *"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-transparent"
              required
              min={0}
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold"
            >
              <option>Vòng tay</option>
              <option>Mặt dây chuyền</option>
              <option>Tượng Phật</option>
              <option>Vật phẩm phong thủy</option>
              <option>Linh vật</option>
              <option>Bi ngọc</option>
            </select>
            <input
              type="number"
              placeholder="Số lượng tồn kho"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              className="p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold"
              min={0}
            />
            <select
              value={formData.menh}
              onChange={(e) => setFormData({ ...formData, menh: e.target.value })}
              className="p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold"
            >
              <option>Kim</option>
              <option>Mộc</option>
              <option>Thủy</option>
              <option>Hỏa</option>
              <option>Thổ</option>
            </select>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-3">Hình ảnh chính *</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center hover:border-gold transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center space-y-3">
                  <Image size={48} className="text-slate-400 mx-auto" />
                  <div>
                    <p className="font-medium text-slate-700">Click để tải ảnh lên</p>
                    <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  </div>
                </label>
              </div>
              {formData.image_url && (
                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                  <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded-xl mx-auto shadow-lg" />
                </div>
              )}
            </div>
            <textarea
              placeholder="Mô tả sản phẩm *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="md:col-span-2 p-4 border border-slate-200 rounded-2xl h-32 focus:ring-2 focus:ring-gold focus:border-transparent"
              required
            />
            <textarea
              placeholder="Ý nghĩa phong thủy"
              value={formData.meaning}
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              className="md:col-span-2 p-4 border border-slate-200 rounded-2xl h-32 focus:ring-2 focus:ring-gold"
              rows={4}
            />
            <button
              type="submit"
              className="md:col-span-2 bg-linear-to-r from-gold to-amber-500 text-slate-900 py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Products List */}
      <motion.div
        className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-2xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <TableView products={paginatedProducts} onEdit={handleEdit} onDelete={handleDelete} />
            ) : (
              <GridView products={paginatedProducts} onEdit={handleEdit} onDelete={handleDelete} />
            )}
            <PaginationFooter
              currentPage={currentPage}
              totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </motion.div>
    </div>
  );
};

// Table View Component
const TableView: React.FC<{
  products: AdminProduct[];
  onEdit: (product: AdminProduct) => void;
  onDelete: (id: string) => void;
}> = ({ products, onEdit, onDelete }) => (
  <>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/50 dark:bg-slate-700/50 text-sm uppercase text-slate-500 tracking-wider">
            <th className="px-6 py-4 text-left">Hình ảnh</th>
            <th className="px-6 py-4 text-left">Tên sản phẩm</th>
            <th className="px-6 py-4 text-left">Giá</th>
            <th className="px-6 py-4 text-left">Danh mục</th>
            <th className="px-6 py-4 text-left">Tồn kho</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
              <td className="px-6 py-4">
                <img src={product.image_url} alt="" className="w-12 h-12 object-cover rounded-xl" />
              </td>
              <td className="px-6 py-4 font-medium text-slate-900 max-w-md truncate">{product.name}</td>
              <td className="px-6 py-4">
                {product.price?.toLocaleString('vi-VN')}₫
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
                  {product.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  product.stock! > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {product.stock || 0}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button onClick={() => onEdit(product)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-xl transition-colors">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => onDelete(product.id)} className="p-2 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

// Grid View Component
const GridView: React.FC<{
  products: AdminProduct[];
  onEdit: (product: AdminProduct) => void;
  onDelete: (id: string) => void;
}> = ({ products, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {products.map((product) => (
      <motion.div
        key={product.id}
        className="group bg-slate-50/50 dark:bg-slate-700/30 border border-slate-200/50 rounded-3xl p-6 hover:shadow-xl hover:shadow-gold/20 hover:-translate-y-2 transition-all overflow-hidden"
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-linear-to-br from-slate-100 to-slate-200">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
            <Eye size={20} className="bg-white/90 p-2 rounded-xl shadow-lg" />
          </div>
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-2 truncate">{product.name}</h3>
        <p className="text-2xl font-serif font-bold text-emerald-600 mb-3">
          {product.price?.toLocaleString('vi-VN')}₫
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-bold">
            {product.category}
          </span>
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
            product.stock! > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {product.stock || 0}
          </span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(product)}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            <Edit3 size={16} className="inline mr-1" />
            Sửa
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="flex-1 bg-rose-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-rose-600 transition-colors"
          >
            <Trash2 size={16} className="inline mr-1" />
            Xóa
          </button>
        </div>
      </motion.div>
    ))}
  </div>
);

// Pagination
const PaginationFooter: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-700/30 border-t border-slate-200/50 flex items-center justify-between">
      <div className="text-sm text-slate-500">
        Hiển thị {(currentPage - 1) * 10 + 1} đến {Math.min(currentPage * 10, pages.length)} của {pages.length} sản phẩm
      </div>
      <div className="flex items-center space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 disabled:opacity-50 hover:bg-slate-200 rounded-xl transition-colors disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-xl font-medium transition-colors ${
              currentPage === page
                ? 'bg-gold text-slate-900 shadow-md'
                : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 disabled:opacity-50 hover:bg-slate-200 rounded-xl transition-colors disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProductsAdmin;
