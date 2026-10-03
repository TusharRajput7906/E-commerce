export const getProductImageUrl = (product) => {
  if (!product) return 'https://via.placeholder.com/600x400?text=No+Image';

  // Handle image as array of objects [{ url: "..." }]
  if (Array.isArray(product.image) && product.image.length > 0) {
    const first = product.image[0];
    if (typeof first === 'string' && first.trim()) return first;
    if (first && typeof first.url === 'string' && first.url.trim()) return first.url;
  }

  // Handle images as array
  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];
    if (typeof first === 'string' && first.trim()) return first;
    if (first && typeof first.url === 'string' && first.url.trim()) return first.url;
  }

  // Handle image as string
  if (typeof product.image === 'string' && product.image.trim()) {
    return product.image;
  }

  // Handle thumbnail
  if (typeof product.thumbnail === 'string' && product.thumbnail.trim()) {
    return product.thumbnail;
  }

  return 'https://via.placeholder.com/600x400?text=No+Image';
};
