import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { supabase } from '../service/supabaseClient';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [newPost, setNewPost] = useState<any>({
    title: '',
    slug: '',
    content: '',
    author: '',
    category: '',
    image_url: '',
    imageFile: null
  });
  const [isAdding, setIsAdding] = useState(false);
  const [addMessage, setAddMessage] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setErrorMsg('');
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('Supabase posts query:', { data, error });

        if (error) {
          throw error;
        }

        setPosts(data || []);
      } catch (err: any) {
        console.error('Error fetching posts:', err);
        setPosts([]);
        setErrorMsg('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleAddPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdding(true);
    setAddMessage('');

    if (!newPost.title || !newPost.slug || !newPost.content || !newPost.author) {
      setAddMessage('Vui lòng điền đầy đủ thông tin bài viết.');
      setIsAdding(false);
      return;
    }

    try {
      // Upload image to Supabase Storage nếu có (bucket phải tạo sẵn tên blog-images)
      let imageUrl = newPost.image_url;
      if (newPost.imageFile) {
        const file = newPost.imageFile;
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const insertResult = await supabase.from('posts').insert([{
        title: newPost.title,
        slug: newPost.slug,
        content: newPost.content,
        author: newPost.author,
        category: newPost.category,
        image_url: typeof imageUrl === 'string' ? imageUrl : ''
      }]);

      if (insertResult.error) throw insertResult.error;

      setAddMessage('Thêm bài viết mới thành công!');
      setNewPost({ title: '', slug: '', content: '', author: '', category: '', image_url: '', imageFile: null });
      const inserted = (insertResult.data as any[] | null)?.[0];
      if (inserted) {
        setPosts((prev) => [inserted, ...prev]);
      }
    } catch (err: any) {
      console.error('Add post error', err);
      setAddMessage('Lỗi khi thêm bài viết: ' + (err.message || err));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-white bg-pattern-subtle min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-secondary">Kiến Thức Đá Quý</h1>
          <p className="text-secondary/60 font-light text-lg">
            Nơi chia sẻ những kiến thức chuyên sâu về đá quý tự nhiên và nghệ thuật ứng dụng phong thủy trong đời sống.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {['Tất cả', 'Phong thủy', 'Đá quý', 'Cung mệnh', 'Đời sống'].map((cat) => (
              <button key={cat} className="px-6 py-2 rounded-full border border-accent/20 text-sm text-secondary/60 hover:border-primary hover:text-primary transition-all whitespace-nowrap bg-white/50">
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" />
            <input 
              type="text" 
              placeholder="Tìm bài viết..." 
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-accent/20 rounded-full text-sm focus:ring-1 focus:ring-primary outline-none text-secondary"
            />
          </div>
        </div>

        {/* Add Blog Post (Admin/Owner) */}
        <div className="mb-12 p-6 bg-white rounded-3xl shadow-sm border border-accent/20">
          <h2 className="text-xl font-bold text-secondary mb-4">Thêm bài viết mới</h2>
          <form onSubmit={handleAddPost} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} placeholder="Tiêu đề" className="p-3 border rounded" required />
            <input value={newPost.slug} onChange={(e) => setNewPost({...newPost, slug: e.target.value})} placeholder="Slug (url)" className="p-3 border rounded" required />
            <input value={newPost.author} onChange={(e) => setNewPost({...newPost, author: e.target.value})} placeholder="Tác giả" className="p-3 border rounded" required />
            <input value={newPost.category} onChange={(e) => setNewPost({...newPost, category: e.target.value})} placeholder="Chuyên mục" className="p-3 border rounded" required />
            <input value={newPost.image_url as string} onChange={(e) => setNewPost({...newPost, image_url: e.target.value})} placeholder="URL ảnh (hoặc chọn file)" className="p-3 border rounded md:col-span-2" />
            <input type="file" accept="image/*" onChange={(e) => setNewPost({...newPost, imageFile: e.target.files?.[0] || null})} className="p-3 border rounded md:col-span-2" />
            <textarea value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} placeholder="Nội dung Markdown" className="p-3 border rounded md:col-span-2" rows={4} required />
            <button type="submit" disabled={isAdding} className="md:col-span-2 bg-primary text-white px-4 py-3 rounded font-bold hover:opacity-90 transition">
              {isAdding ? 'Đang thêm...' : 'Thêm bài viết'}
            </button>
          </form>
          {addMessage && <p className="mt-3 text-sm text-secondary">{addMessage}</p>}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-accent/20 aspect-[16/10] rounded-2xl"></div>
                <div className="h-4 bg-accent/20 rounded w-3/4"></div>
                <div className="h-4 bg-accent/20 rounded w-1/2"></div>
              </div>
            ))
          ) : errorMsg ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-red-600 font-bold text-lg mb-2">{errorMsg}</p>
              <p className="text-secondary/70">Kiểm tra kết nối hoặc cấu hình Supabase.</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <h3 className="text-xl font-serif font-bold mb-2 text-secondary">Chưa có bài viết</h3>
              <p className="text-gray-500">Hiện chưa có bài viết nào. Vui lòng quay lại sau.</p>
            </div>
          ) : (
            posts.map((post) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 shadow-md border border-accent/10">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm border border-accent/20">
                        Kiến thức
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-xs text-secondary/40">
                      <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                      <span className="flex items-center"><User size={14} className="mr-1" /> {post.author}</span>
                    </div>
                    <h2 className="text-xl font-serif font-bold text-secondary group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-secondary/60 text-sm line-clamp-3 font-light leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="pt-2">
                      <span className="text-primary font-bold text-sm flex items-center group-hover:translate-x-2 transition-transform">
                        Đọc tiếp <ArrowRight size={16} className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))
          )}
        </div>

        {/* Load More */}
        <div className="mt-20 text-center">
          <button className="px-10 py-4 border-2 border-secondary text-secondary font-bold rounded-full hover:bg-secondary hover:text-white transition-all shadow-md">
            XEM THÊM BÀI VIẾT
          </button>
        </div>
      </div>
    </div>
  );
}
