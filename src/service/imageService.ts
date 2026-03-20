import { supabase } from './supabaseClient';

export async function uploadProductImage(file: File, productId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

export async function uploadProductGallery(file: File, productId: string, index: number): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-gallery-${index}.${fileExt}`;
    const filePath = `product-gallery/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-gallery')
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-gallery')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

