export function toPublicUser(user) {
  return {
    id: String(user._id || user.id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function toProduct(product) {
  const productId = String(product._id || product.id);
  const sellerId =
    typeof product.seller === "string"
      ? product.seller
      : product.seller?._id
        ? String(product.seller._id)
        : product.seller?.id
          ? String(product.seller.id)
        : String(product.seller);

  return {
    id: productId,
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

export function toCart(cart) {
  return {
    id: String(cart._id),
    items: (cart.items || [])
      .filter((item) => item.product)
      .map((item) => ({
        id: String(item._id),
        productId: String(item.product._id),
        title: item.product.title,
        imageUrl: item.product.imageUrl,
        price: item.product.price,
        quantity: item.quantity,
      })),
    updatedAt: cart.updatedAt,
  };
}

export function toRescueReport(report) {
  return {
    id: String(report._id || report.id),
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
    id: String(post._id || post.id),
    stageName: post.stageName,
    style: post.style,
    caption: post.caption,
    favoriteTrack: post.favoriteTrack,
    createdAt: post.createdAt,
  };
}
