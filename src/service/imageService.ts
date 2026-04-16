import { supabase } from './supabaseClient';

export async function uploadProductImage(file: File, id: string, bucketName: string = 'product-images'): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}.${fileExt}`;
    const filePath = fileName; // Không lặp lại tên bucket ở đây

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return `https://picsum.photos/seed/${bucketName}-${id}/600/600`; // Fallback URL
  }
}

export async function uploadProductGallery(file: File, productId: string, index: number): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-gallery-${index}.${fileExt}`;
    const filePath = fileName; // Corrected: no need to repeat bucket name in path

    const { data, error } = await supabase.storage
      .from('product-gallery')
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-gallery')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Gallery upload error:', error);
    return `https://picsum.photos/seed/gallery-${productId}-${index}/600/400`;
  }
}
