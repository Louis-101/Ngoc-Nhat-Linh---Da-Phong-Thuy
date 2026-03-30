import React, { useState, useEffect } from 'react';
import { Post } from '../types/product';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Share2, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { supabase } from '../service/supabaseClient';
import Markdown from 'react-markdown';
import SEO from '../components/SEO';

const FacebookIcon = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

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
        description={(post as any).excerpt || `Kiến thức phong thủy: ${post.title}. Chia sẻ bởi chuyên gia Ngọc Nhất Linh.`}
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
              <button className="p-2 rounded-full bg-white/50 text-secondary/40 hover:text-primary transition-colors border border-accent/20"><FacebookIcon size={18} /></button>
              <button className="p-2 rounded-full bg-white/50 text-secondary/40 hover:text-primary transition-colors border border-accent/20"><TwitterIcon size={18} /></button>
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
        <div className="prose prose-lg md:prose-xl max-w-none 
          prose-headings:font-bold 
          prose-headings:mt-12 prose-headings:mb-6
          prose-h1:font-sans prose-h1:text-primary prose-h1:text-4xl md:prose-h1:text-5xl
          prose-h2:font-serif prose-h2:text-[#4d241e] prose-h2:text-2xl md:prose-h2:text-3xl
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-8
          prose-strong:text-[#4d241e] prose-strong:font-bold 
          prose-img:rounded-3xl 
          prose-a:text-primary
          prose-li:mb-2"
        >
          <Markdown
            components={{
              h1: ({ ...props }) => <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 mt-12 font-sans" {...props} />,
              h2: ({ ...props }) => <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6 mt-10 font-serif" {...props} />,
              p: ({ ...props }) => <p className="mb-6 leading-relaxed text-gray-700" {...props} />,
            }}
          >
            {post.content}
          </Markdown>
        </div>

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
