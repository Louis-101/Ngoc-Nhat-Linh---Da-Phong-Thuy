import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

export default function SEO({ 
  title, 
  description = "Ngọc Nhất Linh – Thương hiệu đá phong thủy uy tín tại Cần Thơ. Chuyên cung cấp vòng tay, vật phẩm đá quý tự nhiên 100%, tư vấn cung mệnh chuyên sâu.",
  image = "/logo-brand.png",
  type = "website"
}: SEOProps) {
  const location = useLocation();
  const url = window.location.origin + location.pathname;
  const fullTitle = title ? `${title} | Ngọc Nhất Linh` : "Đá Phong Thủy Ngọc Nhất Linh - Tinh Hoa Đá Quý Tự Nhiên";

  useEffect(() => {
    // Cập nhật tiêu đề trang
    document.title = fullTitle;

    // Cập nhật Meta Description
    const updateMetaTag = (name: string, content: string, property: boolean = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:image', window.location.origin + image, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);

  }, [fullTitle, description, url, image, type]);

  return null;
}