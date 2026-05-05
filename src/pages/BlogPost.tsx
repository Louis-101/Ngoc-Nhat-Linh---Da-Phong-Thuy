import React, { useState, useEffect } from 'react';
import { Post } from '../types/product';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, Share2, Facebook, Twitter, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { supabase } from '../service/supabaseClient';
import Markdown from 'react-markdown';
import SEO from '../components/SEO';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        // Fallback mock data
        setPost({
          id: 'fallback', slug: slug || 'fallback', title: 'Cách chọn vòng tay phong thủy theo mệnh Kim, Mộc, Thủy, Hỏa, Thổ',
          content: `
# Tại sao cần chọn vòng tay theo mệnh?

Trong phong thủy, vạn vật đều vận hành theo quy luật Ngũ Hành: Kim, Mộc, Thủy, Hỏa, Thổ. Mỗi người khi sinh ra đều mang một bản mệnh riêng, và việc lựa chọn màu sắc, chất liệu trang sức phù hợp sẽ giúp kích hoạt năng lượng tích cực, mang lại bình an và may mắn.

## 1. Người mệnh Kim
Người mệnh Kim nên chọn các loại đá có màu vàng, nâu đất (tương sinh - Thổ sinh Kim) hoặc màu trắng, xám, ghi (tương hợp).
- **Gợi ý:** Thạch anh tóc vàng, Hổ phách, Thạch anh trắng.

## 2. Người mệnh Mộc
Màu sắc tốt nhất cho người mệnh Mộc là xanh lá cây (tương hợp) hoặc màu đen, xanh nước biển (tương sinh - Thủy sinh Mộc).
- **Gợi ý:** Thạch anh xanh, Aquamarine, Sapphire xanh.

## 3. Người mệnh Thủy
Mệnh Thủy hợp với màu đen, xanh nước biển (tương hợp) hoặc màu trắng, xám, ghi (tương sinh - Kim sinh Thủy).
- **Gợi ý:** Obsidian, Thạch anh đen, Aquamarine.

## Kết luận
Việc đeo vòng tay phong thủy không chỉ là làm đẹp mà còn là một cách để chúng ta kết nối với năng lượng của vũ trụ. Hãy chọn cho mình một "người bạn đồng hành" phù hợp nhất nhé!
          `,
          image_url: 'https://picsum.photos/seed/blog1/1200/600',
          created_at: '2024-03-15T00:00:00Z',
          author: 'NGỌC NHẤT LINH',
          category: 'Phong thủy'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) return <div className="pt-32 pb-20 text-center">Đang tải...</div>;
  if (!post) return <div className="pt-32 pb-20 text-center">Không tìm thấy bài viết.</div>;

  return (
    <div className="pt-24 pb-20 bg-white bg-pattern-subtle min-h-screen">
      <SEO 
        title={post.title}
        description={post.excerpt || `Kiến thức phong thủy: ${post.title}. Chia sẻ bởi chuyên gia Ngọc Nhất Linh.`}
        image={post.image_url}
        type="article"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center text-secondary/40 hover:text-primary mb-8 transition-colors text-sm">
          <ArrowLeft size={16} className="mr-2" /> Quay lại Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block border border-primary/20">
            {post.category || 'Kiến thức'}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight text-secondary">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-accent/20">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center border border-accent/20">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-secondary">{post.author}</p>
                  <p className="text-xs text-secondary/40">Chuyên gia tư vấn</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-secondary/40">
                <Calendar size={14} className="mr-2" />
                {new Date(post.created_at).toLocaleDateString('vi-VN')}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full bg-white/50 text-secondary/40 hover:text-primary transition-colors border border-accent/20"><Facebook size={18} /></button>
              <button className="p-2 rounded-full bg-white/50 text-secondary/40 hover:text-primary transition-colors border border-accent/20"><Twitter size={18} /></button>
              <button className="p-2 rounded-full bg-white/50 text-secondary/40 hover:text-primary transition-colors border border-accent/20"><LinkIcon size={18} /></button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-lg border border-accent/20">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content */}
        <article className="max-w-none">
          <Markdown
            components={{
              h1: ({...props}) => <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#7a5c2e] mb-8 mt-12" {...props} />,
              h2: ({...props}) => <h2 className="text-2xl md:text-4xl font-serif font-bold text-secondary mb-6 mt-10 border-l-4 border-primary pl-5 py-1" {...props} />,
              h3: ({...props}) => <h3 className="text-xl md:text-2xl font-serif font-bold text-secondary mb-4 mt-8" {...props} />,
              p: ({...props}) => <p className="mb-6 leading-[1.8] md:leading-loose text-[#333] text-justify font-light" {...props} />,
              ul: ({...props}) => <ul className="list-disc pl-8 mb-8 space-y-3 text-[#333]" {...props} />,
              ol: ({...props}) => <ol className="list-decimal pl-8 mb-8 space-y-3 text-[#333]" {...props} />,
              li: ({...props}) => <li className="pl-2 marker:text-primary font-medium" {...props} />,
              blockquote: ({...props}) => (
                <blockquote className="border-l-4 border-accent bg-accent/10 p-8 my-10 italic text-secondary rounded-r-3xl shadow-sm text-lg" {...props} />
              ),
              img: ({...props}) => (
                <div className="my-12">
                  <img className="w-full rounded-4xl shadow-2xl border border-accent/10 object-cover" {...props} />
                </div>
              ),
              strong: ({...props}) => <strong className="font-bold text-secondary" {...props} />,
              a: ({...props}) => <a className="text-primary font-bold hover:underline" {...props} />,
            }}
          >
            {post.content}
          </Markdown>
        </article>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-accent/20">
          <div className="bg-accent/30 p-8 rounded-3xl text-center relative overflow-hidden border border-accent/20">
            <div className="absolute inset-0 bg-pattern-subtle opacity-20"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-serif font-bold mb-4 text-secondary">Bạn cần tư vấn phong thủy?</h3>
              <p className="text-secondary/60 text-sm mb-8 max-w-md mx-auto">Đội ngũ chuyên gia của Ngọc Nhất Linh luôn sẵn sàng hỗ trợ bạn tìm ra pháp bảo phù hợp nhất.</p>
              <Link to="/contact" className="inline-block bg-secondary text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                LIÊN HỆ TƯ VẤN
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
