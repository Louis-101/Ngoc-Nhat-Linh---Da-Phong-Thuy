import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  FileText,
  MessageSquare,
  LogOut,
  Bell,
  User,
  Search,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  ChevronRight,
  X,
  Image as ImageIcon,
  Menu
} from 'lucide-react';
import { supabase } from '../service/supabaseClient';
import { uploadProductImage } from '../service/imageService';
import { useNavigate } from 'react-router-dom';

interface ProductSpecs {
  material?: string;
  bead_count?: string;
  bead_size?: string;
  height?: string;
  width?: string;
  depth?: string;
  certification?: string;
  [key: string]: string | undefined;
}

// Define types for better type safety
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number; // Changed to number
  category: string;
  menh: string;
  description: string;
  meaning: string;
  image_url: string;
  specs: ProductSpecs;
  created_at: string;
}


interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  category: string; // Changed to string
  author: string;
  created_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

interface MenuItem {
  id: string;
  icon: React.ElementType;
  label: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ products: 0, contacts: 0, posts: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Logic lọc dữ liệu dựa trên searchTerm
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.menh?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false); // Renamed to avoid confusion
  const [productFormData, setProductFormData] = useState<{
    name: string;
    slug: string;
    price: number;
    category: string;
    menh: string;
    description: string;
    meaning: string;
    image_url: string;
    specs: ProductSpecs;
  }>({ // Renamed to avoid confusion
    name: '',
    slug: '',
    price: 0,
    category: 'Vòng tay',
    menh: 'Kim',
    description: '',
    meaning: '',
    image_url: '',
    specs: {} as any // Changed to object for smart fields
  });
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false); // Renamed
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null); // Renamed

  // Blog Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postFormData, setPostFormData] = useState({
    title: '',
    category: 'Phong thủy',
    content: '', // This will be markdown
    image_url: '',
    author: 'Admin'
  });
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false); // Added for post submission
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    const { count: pCount, data: pData } = await supabase.from('products').select('*', { count: 'exact' }).order('created_at', { ascending: false });
    const { count: cCount, data: cData } = await supabase.from('contacts').select('*', { count: 'exact' }).order('created_at', { ascending: false });
    const { count: poCount, data: poData } = await supabase.from('posts').select('*', { count: 'exact' }).order('created_at', { ascending: false });
    
    // Get current user session
    const { data: authData } = await supabase.auth.getUser();
    setUser(authData?.user || null);
    
    setStats({ products: pCount || 0, contacts: cCount || 0, posts: poCount || 0 });
    setProducts(pData || []);
    setContacts(cData || []);
    setPosts(poData || []);
    setLoading(false);
  };

  useEffect(() => { // Moved fetchData inside useEffect
    fetchData();
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'products', icon: Package, label: 'Sản phẩm' },
    { id: 'posts', icon: FileText, label: 'Bài viết' },
    { id: 'contacts', icon: MessageSquare, label: 'Liên hệ' },
    { id: 'notifications', icon: Bell, label: 'Thông báo' },
    { id: 'account', icon: User, label: 'Tài khoản' }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-login');
  };

  // --- Product Management Functions ---
  const handleOpenProductModal = (product?: Product) => { // Renamed and typed
    setEditingProductId(product ? product.id : null);
    setProductFormData({
      name: product?.name || '',
      slug: product?.slug || '',
      price: product?.price || 0,
      category: product?.category || 'Vòng tay',
      menh: product?.menh || 'Kim',
      description: product?.description || '',
      meaning: product?.meaning || '',
      image_url: product?.image_url || '',
      specs: product?.specs || {} 
    });
    setImageFile(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => { // Typed product
    setEditingProductId(product.id); // Use editingProductId
    setProductFormData({ // Use productFormData
      name: product.name,
      slug: product.slug || '',
      price: product.price,
      category: product.category,
      menh: product.menh,
      description: product.description,
      meaning: product.meaning,
      image_url: product.image_url, // Ensure 'specs' exists on Product
      specs: product.specs || {} // Use existing specs object
    });
    setImageFile(null); // Reset image file input
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => { // Renamed
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('Lỗi khi xóa: ' + error.message);
    else fetchData();
  };

  const handleSaveProduct = async (e?: React.BaseSyntheticEvent) => { // Renamed
    if (e) e.preventDefault();
    setIsSubmittingProduct(true); // Use product specific submitting state

    try {
      let finalImageUrl = productFormData.image_url; // Use productFormData

      if (imageFile) {
        const uploadedUrl = await uploadProductImage(imageFile, `prod-${Date.now()}`, 'product-images'); // Đảm bảo bucket này tồn tại và Public
        if (uploadedUrl) finalImageUrl = uploadedUrl; // Update finalImageUrl if new image uploaded
      }

      const slug = productFormData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-').replace(/[^\w-]+/g, '');

      const dataToSave = { // Renamed to dataToSave
        ...productFormData, // Use productFormData
        image_url: finalImageUrl,
        slug: slug,
        specs: productFormData.specs // Already an object
      };

      if (editingProductId) { // Use editingProductId
        const { error } = await supabase
          .from('products')
          .update(dataToSave) // Use dataToSave
          .eq('id', editingProductId); // Use editingProductId
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([dataToSave]); // Use dataToSave
        if (error) throw error;
      }

      setIsProductModalOpen(false); // Use setIsProductModalOpen
      fetchData();
    } catch (error: any) {
      console.error('Lỗi khi lưu sản phẩm:', error); // Log full error object
      alert('Lỗi khi lưu sản phẩm: ' + (error.message || 'Không xác định'));
    } finally { // Corrected finally block
      setIsSubmittingProduct(false); // Use isSubmittingProduct
    }
  };

  // Helper to update specific spec fields
  const updateSpec = (key: string, value: string) => {
    setProductFormData({ ...productFormData, specs: { ...productFormData.specs, [key]: value } });
  };

  // --- Post Management Functions ---
  const handleOpenPostModal = (post?: Post) => { // Corrected declaration and placement
    setEditingPostId(post ? post.id : null);
    setPostFormData({
      title: post?.title || '',
      category: post?.category || 'Phong thủy',
      content: post?.content || '',
      image_url: post?.image_url || '',
        author: post?.author || 'Admin',
    });
    setPostImageFile(null); // Reset image file for posts
    setIsPostModalOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Xóa bài viết này?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    // Optionally delete image from storage
    // if (post.image_url) {
    //   const path = post.image_url.split('/').pop(); // Extract filename
    //   await supabase.storage.from('blog-images').remove([path]);
    // }

    if (error) alert(error.message);
    else fetchData();
  };

  const handleSavePost = async () => {
    setIsSubmittingPost(true);
    try {
      let finalImageUrl = postFormData.image_url;
      if (postImageFile) {
        const uploadedUrl = await uploadProductImage(postImageFile, Date.now().toString(), 'blog-images'); // Specify bucket
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const slug = postFormData.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const dataToSave = { ...postFormData, slug, image_url: finalImageUrl };

      if (editingPostId) {
        await supabase.from('posts').update(dataToSave).eq('id', editingPostId);
      } else {
        await supabase.from('posts').insert([dataToSave]);
      }
      setIsPostModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error('Lỗi khi lưu bài viết:', err); // Log full error object
      alert('Lỗi khi lưu bài viết: ' + (err.message || 'Không xác định'));
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements[0] as HTMLInputElement).value;
    const content = (form.elements[1] as HTMLTextAreaElement).value;
    
    if (!title) return;
    const { error } = await supabase.from('notifications').insert([{ title, content, created_at: new Date().toISOString() }]);
    if (error) alert(error.message);
    else {
      alert('Đã gửi thông báo!');
      form.reset();
    }
  };

  // --- Render Components ---

  const renderProductModal = () => ( // Moved inside Admin component and corrected to return JSX directly
    <AnimatePresence>
      {isProductModalOpen && ( // Use isProductModalOpen
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProductModalOpen(false)}
            className="absolute inset-0 bg-secondary/20 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-primary/10"
          >
            <div className="flex justify-between items-center px-6 py-4 md:px-10 md:py-8 border-b border-gray-50">
              <div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-secondary">
                  {editingProductId ? 'Chỉnh sửa sản phẩm' : 'Thêm Tuyệt Tác Mới'} {/* Dynamic title */}
                </h3>
                <p className="text-xs text-secondary/40 uppercase tracking-widest mt-1">Khởi tạo dữ liệu vật phẩm phong thủy</p>
              </div>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors text-secondary/20 hover:text-secondary"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-5 md:p-10 max-h-[75vh] overflow-y-auto no-scrollbar">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {/* Left Column: Image & Basic Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-2">Hình ảnh vật phẩm (Hỗ trợ file lớn)</label>
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)} // Use setImageFile
                    />
                    <label htmlFor="file-upload" className="aspect-video md:aspect-square rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center group hover:border-primary/30 transition-all cursor-pointer overflow-hidden relative">
                      {imageFile || productFormData.image_url ? ( // Use imageFile and productFormData
                        <img 
                          src={imageFile ? URL.createObjectURL(imageFile) : productFormData.image_url} // Use imageFile and productFormData
                          className="w-full h-full object-cover" 
                          alt="Preview" 
                        />
                      ) : (
                        <>
                          <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-secondary/20 group-hover:text-primary transition-colors">
                            <ImageIcon size={24} />
                          </div>
                          <p className="text-xs font-medium text-secondary/40 mt-4 group-hover:text-secondary transition-colors">Tải lên hoặc kéo thả ảnh</p>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-2">Tên vật phẩm *</label>
                      <input 
                        type="text" 
                        value={productFormData.name} // Use productFormData
                        onChange={(e) => setProductFormData({...productFormData, name: e.target.value})} // Use setProductFormData
                        className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm font-medium"
                        placeholder="Ví dụ: Vòng Tay Thạch Anh Tóc Vàng..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-2">Giá niêm yết (VNĐ) *</label>
                      <input 
                        type="number" 
                        value={productFormData.price} // Use productFormData
                        onChange={(e) => setProductFormData({...productFormData, price: parseInt(e.target.value) || 0})} // Use setProductFormData
                        className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm font-bold text-primary"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Categories & Description */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-2">Phân loại</label>
                      <select 
                        value={productFormData.category} // Use productFormData
                        onChange={(e) => setProductFormData({...productFormData, category: e.target.value})} // Use setProductFormData
                        className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-xs md:text-sm appearance-none cursor-pointer"
                      >
                        <option>Vòng tay</option>
                        <option>Mặt dây</option>
                        <option>Tượng phật</option>
                        <option>Vật phẩm</option>
                        <option>Linh vật</option>
                        <option>Bi ngọc</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-2">Hợp mệnh</label>
                      <select 
                        value={productFormData.menh} // Use productFormData
                        onChange={(e) => setProductFormData({...productFormData, menh: e.target.value})} // Use setProductFormData
                        className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-xs md:text-sm appearance-none cursor-pointer"
                      >
                        <option>Kim</option>
                        <option>Mộc</option>
                        <option>Thủy</option>
                        <option>Hỏa</option>
                        <option>Thổ</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-2">Mô tả ngắn gọn</label>
                    <textarea 
                      rows={2} 
                      value={productFormData.description} // Use productFormData
                      onChange={(e) => setProductFormData({...productFormData, description: e.target.value})} // Use setProductFormData
                      className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm resize-none" 
                      placeholder="Nhập tóm tắt về sản phẩm..."
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-2">Ý nghĩa phong thủy chuyên sâu</label>
                    <textarea 
                      rows={4} 
                      value={productFormData.meaning} // Use productFormData
                      onChange={(e) => setProductFormData({...productFormData, meaning: e.target.value})} // Use setProductFormData
                      className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm resize-none" 
                      placeholder="Phân tích năng lượng và tác dụng tâm linh..."
                    ></textarea>
                  </div>

                  <div className="space-y-4 bg-gray-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
                    <label className="text-xs font-bold text-primary uppercase tracking-widest ml-2">Thông số kỹ thuật chi tiết</label>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-secondary/40 uppercase ml-2">Chất liệu đá</span>
                        <input 
                          type="text" 
                          placeholder="VD: Thạch anh, Ngọc cẩm thạch..."
                          value={productFormData.specs.material || ''}
                          onChange={(e) => updateSpec('material', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-100 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                        />
                      </div>

                      {productFormData.category === 'Vòng tay' ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-secondary/40 uppercase ml-2">Số hạt</span>
                            <input type="text" placeholder="17 hạt" value={productFormData.specs.bead_count || ''} onChange={(e) => updateSpec('bead_count', e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-100 text-sm" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-secondary/40 uppercase ml-2">Kích thước (Ly)</span>
                            <input type="text" placeholder="12 ly" value={productFormData.specs.bead_size || ''} onChange={(e) => updateSpec('bead_size', e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-100 text-sm" />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <span className="text-[9px] font-bold text-secondary/40 uppercase ml-2 block">Kích thước (cm)</span>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <input type="text" placeholder="Cao" value={productFormData.specs.height || ''} onChange={(e) => updateSpec('height', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-100 text-sm" />
                            </div>
                            <div className="space-y-1">
                              <input type="text" placeholder="Ngang" value={productFormData.specs.width || ''} onChange={(e) => updateSpec('width', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-100 text-sm" />
                            </div>
                            <div className="space-y-1">
                              <input type="text" placeholder="Sâu" value={productFormData.specs.depth || ''} onChange={(e) => updateSpec('depth', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-100 text-sm" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-secondary/40 uppercase ml-2">Kiểm định</span>
                        <input 
                          type="text" 
                          placeholder="SJC, PNJ hoặc Chưa kiểm định"
                          value={productFormData.specs.certification || ''}
                          onChange={(e) => updateSpec('certification', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-100 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 md:px-10 md:py-8 bg-gray-50/50 border-t border-gray-50 flex justify-end space-x-3 md:space-x-4">
              <button onClick={() => setIsProductModalOpen(false)} className="px-6 py-3 rounded-xl text-xs font-bold text-secondary/40 hover:text-secondary transition-colors">HỦY BỎ</button>
              <button 
                onClick={handleSaveProduct} // Use handleSaveProduct
                disabled={isSubmittingProduct} // Use isSubmittingProduct
                className="bg-gradient-gold text-secondary px-6 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm shadow-xl hover:scale-105 transition-all disabled:opacity-50"
              >
                {isSubmittingProduct ? '...' : 'LƯU VẬT PHẨM'} {/* Use isSubmittingProduct */}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  ); // End of renderProductModal

  const renderSidebar = () => ( // Moved inside Admin component and corrected to return JSX directly
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col shadow-xl transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:shadow-sm`}>
        <div className="p-6 md:p-8 flex justify-between items-center">
          <div>
            <h1 className="text-base md:text-lg font-serif font-bold italic tracking-widest text-gradient-gold">
              NGỌC NHẤT LINH
            </h1>
            <p className="text-[8px] text-secondary/30 uppercase tracking-[0.2em] mt-1 font-bold">Quản trị viên</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-secondary/40">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 md:px-6 space-y-1 md:space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item: MenuItem) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 md:space-x-4 px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-primary/5 text-primary font-bold border border-primary/10' 
                  : 'text-secondary/50 hover:bg-gray-50'
              }`}
            >
              <item.icon size={16} className={activeTab === item.id ? 'text-primary' : 'text-secondary/30 group-hover:text-primary transition-colors'} />
              <span className="text-xs md:text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-secondary/30 hover:text-red-500 transition-all w-full px-4 text-xs font-medium"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  ); // End of renderSidebar

  const renderHeader = () => ( // Moved inside Admin component and corrected to return JSX directly
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-50 px-4 md:px-10 py-3 md:py-4 flex items-center justify-between sticky top-0 z-20 h-14 md:h-20">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-gray-50 rounded-lg text-secondary md:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="relative flex-1 max-w-45 sm:max-w-xs group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/20 group-focus-within:text-primary transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Tìm nhanh..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/5 focus:bg-white transition-all text-xs"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/20 hover:text-secondary transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-8">
        <div className="flex items-center space-x-2 md:space-x-4 border-l pl-4 md:pl-8 border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Admin</p>
            <p className="text-[8px] text-secondary/30 font-medium">Sẵn sàng</p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shadow-sm border border-primary/5">
            A
          </div>
        </div>
      </div>
    </header>
  ); // End of renderHeader

  const renderDashboard = () => ( // Moved inside Admin component and corrected to return JSX directly
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 md:space-y-10">
      <div className="flex flex-row items-center justify-between gap-2">
        <div>
          <h2 className="text-xl md:text-3xl font-serif font-bold text-secondary">Tổng quan</h2>
          <p className="text-secondary/40 text-[10px] md:text-sm mt-0.5">Hệ thống Ngọc Nhất Linh.</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => handleOpenProductModal()} // Use handleOpenProductModal
            className="bg-gradient-gold text-secondary px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-sm flex items-center space-x-2 shadow-lg hover:scale-105 transition-all"
          >
            <Plus size={14} />
            <span>THÊM MỚI</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
        {[
          { label: 'Vật phẩm', value: stats.products, icon: Package, desc: 'Đang trưng bày' },
          { label: 'Bài viết', value: stats.posts, icon: FileText, desc: 'Đã chia sẻ' },
          { label: 'Liên hệ', value: stats.contacts, icon: MessageSquare, desc: 'Chờ tư vấn' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group ${i === 2 ? 'col-span-2 lg:col-span-1' : ''}`}>
            <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-primary/5 rounded-bl-4xl md:rounded-bl-[4rem] -mr-4 -mt-4 group-hover:scale-110 transition-transform"></div>
            <div className="w-10 h-10 md:w-14 md:h-14 bg-primary/10 text-primary rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-6">
              <stat.icon size={20} />
            </div>
            <p className="text-[8px] md:text-xs font-bold text-secondary/30 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl md:text-4xl font-serif font-bold text-secondary">{stat.value}</p>
            <p className="text-[8px] md:text-xs text-secondary/40 mt-2 italic hidden sm:block">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 md:p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-serif font-bold text-sm md:text-lg text-secondary">Yêu cầu mới</h3>
          <button onClick={() => setActiveTab('contacts')} className="text-xs font-bold text-primary flex items-center hover:underline">XEM TẤT CẢ <ChevronRight size={14} /></button> {/* Use setActiveTab */}
        </div>
        <div className="p-2 md:p-4">
          {filteredContacts.slice(0, 5).map((c: Contact, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-xl md:rounded-2xl transition-colors">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-secondary/5 flex items-center justify-center font-bold text-secondary/40 text-xs">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-lg truncate max-w-25 sm:max-w-none">{c.name}</p>
                  <p className="text-[8px] text-secondary/30">{new Date(c.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="text-[10px] text-secondary/60 line-clamp-1 max-w-xs hidden lg:block">{c.message}</span>
              <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full">CHỜ XỬ LÝ</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  ); // End of renderDashboard

  return (
    <div className="flex h-screen bg-[#fdfbf7] text-secondary font-sans overflow-hidden">
      {renderSidebar()}

      <main className="flex-1 flex flex-col overflow-hidden">
        {renderHeader()}

        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 md:space-y-10">
          {activeTab === 'dashboard' && renderDashboard()}

          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8">
              <div className="flex flex-row justify-between items-center md:items-end gap-2">
                <div>
                  <h2 className="text-xl md:text-3xl font-serif font-bold text-secondary">Vật phẩm</h2>
                  <p className="text-[10px] md:text-sm text-secondary/40 mt-0.5">Quản lý kho đá quý tuyển chọn.</p>
                </div>
                <button
                  onClick={() => handleOpenProductModal()}
                  className="bg-gradient-gold text-secondary px-5 py-3 md:px-8 md:py-3.5 rounded-2xl font-bold text-xs md:text-sm shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                >
                  <Plus size={18} />
                  <span>THÊM MỚI</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                {/* Mobile View: Card List */}
                <div className="md:hidden p-4 space-y-4 bg-gray-50/30">
                  {filteredProducts.map((p: Product) => (
                    <div key={p.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-md space-y-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 border border-gray-50 shrink-0 shadow-inner">
                          <img src={p.image_url || '/images/fallback.jpg'} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base text-secondary leading-tight line-clamp-2">{p.name}</h4>
                          <p className="text-sm text-primary font-bold mt-2">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className="inline-block bg-gray-100 text-secondary/60 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
                              {p.category}
                            </span>
                            <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
                              {p.menh}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                        <button 
                          onClick={() => handleEditProduct(p)}
                          className="flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                        >
                          <Edit3 size={18} />
                          <span className="text-xs font-bold uppercase tracking-wider">Sửa</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="flex items-center justify-center space-x-2 py-3 bg-rose-500 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-rose-500/20"
                        >
                          <Trash2 size={18} />
                          <span className="text-xs font-bold uppercase tracking-wider">Xóa</span>
                        </button>
                        <div className="col-span-2">
                          <button 
                            onClick={() => window.open(`/product/${p.id}`, '_blank')}
                            className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-50 text-secondary/40 rounded-2xl transition-active active:scale-95 border border-gray-100"
                          >
                            <ExternalLink size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Xem ngoài shop</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="whitespace-nowrap">
                      <tr className="bg-gray-50/50 text-secondary/30 text-[10px] font-bold uppercase tracking-widest border-b border-gray-50">
                        <th className="px-8 py-5">Sản phẩm</th>
                        <th className="px-8 py-5">Phân loại</th>
                        <th className="px-8 py-5">Giá bán</th>
                        <th className="px-8 py-5 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredProducts.map((p: Product) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-50">
                                <img src={p.image_url || '/images/fallback.jpg'} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                              </div>
                              <span className="font-bold text-sm max-w-xs truncate">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{p.category}</span>
                          </td>
                          <td className="px-8 py-5 font-serif font-bold text-primary whitespace-nowrap">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center justify-center space-x-3">
                              <button onClick={() => handleEditProduct(p)} className="p-2 rounded-xl hover:bg-blue-50 text-blue-400 transition-colors"><Edit3 size={16} /></button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition-colors"><Trash2 size={16} /></button>
                              <a href={`/product/${p.id}`} target="_blank" className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-colors"><ExternalLink size={16} /></a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'posts' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-between items-end text-secondary">
                <div>
                  <h2 className="text-3xl font-serif font-bold">Kiến thức đá quý</h2>
                  <p className="text-sm text-secondary/40 mt-1">Quản lý các bài viết và tư vấn phong thủy chuyên sâu.</p>
                </div>
                <button onClick={() => handleOpenPostModal()} className="bg-secondary text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center space-x-2">
                  <Plus size={18} />
                  <span>VIẾT BÀI MỚI</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {filteredPosts.map((post: Post) => ( // Added type for post
                  <div key={post.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      <img src={post.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {post.category || 'Phong thủy'}
                      </div>
                    </div>
                    <div className="p-6 md:p-8 space-y-4">
                      <h4 className="font-serif font-bold text-base md:text-lg line-clamp-2 min-h-12 md:min-h-14 group-hover:text-primary transition-colors">{post.title}</h4>
                      <div className="flex justify-between items-center text-[11px] text-secondary/30 font-bold uppercase tracking-widest">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <span className="truncate ml-2">Bởi {post.author}</span>
                      </div>
                      <div className="pt-4 border-t border-gray-50 flex space-x-3">
                        <button 
                          onClick={() => handleOpenPostModal(post)}
                          className="flex-1 py-3 bg-gray-50 hover:bg-primary/5 hover:text-primary rounded-xl text-xs font-bold transition-all"
                        >CHỈNH SỬA</button>
                        <button onClick={() => handleDeletePost(post.id)} className="px-4 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl text-red-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'contacts' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif font-bold">Yêu cầu tư vấn</h2>
                <p className="text-sm text-secondary/40 mt-1">Theo dõi và phản hồi khách hàng cần trợ giúp phong thủy.</p>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4">
                  {filteredContacts.map((c: Contact, i: number) => ( // Added types for c and i
                    <div key={i} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 md:p-8 hover:bg-gray-50 border-b border-gray-50 last:border-0 rounded-3xl md:rounded-4xl transition-all gap-4 md:gap-6">
                      <div className="flex items-center space-x-4 md:space-x-6 w-full lg:w-auto">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-base md:text-lg">{c.name}</p>
                          <p className="text-[10px] md:text-xs text-secondary/40 font-medium truncate max-w-50">{c.phone} • {c.email}</p>
                        </div>
                      </div>
                      <div className="w-full lg:flex-1 bg-white p-4 md:p-6 rounded-2xl border border-gray-50 italic text-secondary/60 text-sm shadow-sm">
                        "{c.message}"
                      </div>
                      <div className="flex items-center space-x-4 min-w-40 justify-end">
                        <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-widest">{new Date(c.created_at).toLocaleDateString()}</span>
                        <button className="p-3 bg-primary text-secondary rounded-xl font-bold text-[10px] uppercase shadow-md hover:scale-105 transition-all">PHẢN HỒI</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif font-bold">Thông báo hệ thống</h2>
                <p className="text-sm text-secondary/40 mt-1">Gửi thông báo mới đến toàn bộ khách hàng trên website.</p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm max-w-2xl">                
                <form onSubmit={handleSendNotification} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-2">Tiêu đề thông báo</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm font-medium" placeholder="Khuyến mãi mới..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-2">Nội dung chi tiết</label>
                    <textarea rows={4} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm resize-none" placeholder="Nhập nội dung..."></textarea>
                  </div>
                  <button type="submit" className="bg-secondary text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-all">GỬI THÔNG BÁO NGAY</button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif font-bold">Thiết lập tài khoản</h2>
                <p className="text-sm text-secondary/40 mt-1">Cập nhật thông tin định danh và bảo mật Admin.</p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm max-w-2xl">
                <div className="flex items-center space-x-6 mb-10">
                  <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20">A</div>
                  <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">Thay đổi ảnh đại diện</button>
                  <div>
                    <h4 className="text-xl font-bold">{user?.email || 'Admin'}</h4>
                    <p className="text-sm text-secondary/40">ID: {user?.id}</p>
                  </div>
                </div>
                <p className="text-sm text-secondary/60 mb-8 italic">Tính năng cập nhật mật khẩu và thông tin cá nhân đang được bảo trì.</p>
                <p className="text-sm text-secondary/60 mb-8 italic">Bạn đang đăng nhập với quyền Quản trị viên cao cấp.</p>
                <button onClick={handleLogout} className="bg-red-50 text-red-500 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all">ĐĂNG XUẤT AN TOÀN</button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Blog Post Modal */}
        <AnimatePresence>
          {isPostModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-secondary/20 backdrop-blur-md" onClick={() => setIsPostModalOpen(false)} />
              <motion.div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                <h3 className="text-2xl font-serif font-bold mb-6">{editingPostId ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Tiêu đề bài viết</label>
                    <input 
                      type="text" 
                      value={postFormData.title}
                      onChange={(e) => setPostFormData({...postFormData, title: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Chuyên mục</label>
                      <select 
                        value={postFormData.category}
                        onChange={(e) => setPostFormData({...postFormData, category: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm"
                      >
                        <option>Phong thủy</option>
                        <option>Đá quý</option>
                        <option>Cung mệnh</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Hình ảnh bài viết</label>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPostImageFile(e.target.files?.[0] || null)}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm"
                      />
                      {(postImageFile || postFormData.image_url) && (
                        <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-50">
                          <img 
                            src={postImageFile ? URL.createObjectURL(postImageFile) : postFormData.image_url} 
                            className="w-full h-full object-cover" 
                            alt="Preview" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Nội dung</label>
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-2">
                      <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-2">QUY TẮC VIẾT ĐỂ HIỂN THỊ ĐẸP (MARKDOWN)</p>
                      <div className="grid grid-cols-2 gap-4 text-[10px] text-secondary/60 font-medium">
                        <div>
                          <p># Tiêu đề chính</p>
                          <p>## Tiêu đề phụ</p>
                          <p>### Tiêu đề nhỏ</p>
                        </div>
                        <div>
                          <p>- Gạch đầu dòng</p>
                          <p>1. Danh sách số</p>
                          <p>**Chữ in đậm**</p>
                        </div>
                      </div>
                    </div>
                    <textarea 
                      rows={10}
                      value={postFormData.content}
                      onChange={(e) => setPostFormData({...postFormData, content: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm resize-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button onClick={() => setIsPostModalOpen(false)} className="px-8 py-4 font-bold text-secondary/40">HỦY</button>
                    <button onClick={handleSavePost} disabled={isSubmittingPost} className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg">
                      {isSubmittingPost ? 'ĐANG LƯU...' : 'LƯU BÀI VIẾT'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {renderProductModal()}
    </div>
  );
}