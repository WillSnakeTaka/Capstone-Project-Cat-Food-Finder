export function toPublicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function toProduct(product) {
  const sellerId =
    typeof product.seller === "string"
      ? product.seller
      : product.seller?._id
        ? String(product.seller._id)
        : String(product.seller);

  return {
    id: String(product._id),
    title: product.title,
    category: product.category,
    brand: product.brand,
    size: product.size,
    description: product.description,
    imageUrl: product.imageUrl,
    price: product.price,
    rating: product.rating,
    stock: product.stock,
    seller: sellerId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function toRescueReport(report) {
  return {
    id: String(report._id),
    catName: report.catName,
    city: report.city,
    contactName: report.contactName,
    contactInfo: report.contactInfo,
    description: report.description,
    status: report.status,
    createdAt: report.createdAt,
  };
}

export function toMusicianPost(post) {
  return {
    id: String(post._id),
    stageName: post.stageName,
    style: post.style,
    caption: post.caption,
    favoriteTrack: post.favoriteTrack,
    createdAt: post.createdAt,
  };
}
