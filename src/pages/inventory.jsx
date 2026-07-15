import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fetchProducts } from '../api/inventory';
import { ShoppingCart, Server, Cpu, Layers, Tag, ShieldCheck, Check, Star } from 'lucide-react';

export default function InventoryPage({ onOrderProduct, products: propProducts, loading: propLoading }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
      const uniqCats = ['All', ...new Set(propProducts.map(p => p.category))];
      setCategories(uniqCats);
      setLoading(!!propLoading);
      return;
    }

    let isMounted = true;
    setLoading(true);
    fetchProducts().then((data) => {
      if (isMounted) {
        setProducts(data);
        // Extract unique categories
        const uniqCats = ['All', ...new Set(data.map(p => p.category))];
        setCategories(uniqCats);
        setLoading(false);
      }
    }).catch(err => {
      console.error("Failed to load products", err);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [propProducts, propLoading]);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Format currency VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  return (
    <div className="space-y-4 pt-3.5 px-3.5 pb-6 animate-fadeIn" id="kb-inventory-page">
      {/* Page Header */}
      <div className="space-y-1.5 px-1 pb-1">
        <h1 className="text-[13px] font-light text-[#242220] uppercase font-display flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 bg-[#9e1a1e] rounded-full inline-block shadow-[0_0_6px_#9e1a1e]"></span>
          <span>Sản phẩm & Thiết bị</span>
        </h1>
        <p className="text-[9.5px] text-gray-550 font-sans font-light">
          Danh mục thiết bị chính hãng, được cấu hình tối ưu bởi đội ngũ KB.
        </p>
      </div>

      {/* Category Tabs (Horizontally scrollable if too long) */}
      {!loading && (
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none px-1" id="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setVisibleCount(6); }}
              className="relative flex-shrink-0 px-3.5 py-1 rounded-full text-[9px] font-light uppercase st transition-all cursor-pointer focus:outline-none border border-transparent"
            >
              {selectedCategory === cat && (
                <motion.div
                  layoutId="activeCategoryPill"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="absolute inset-0 bg-[#9e1a1e] rounded-full z-0"
                />
              )}
              <span className={`relative z-10 transition-colors duration-250 ${
                selectedCategory === cat
                  ? 'text-white font-bold'
                  : 'text-gray-500 hover:text-black'
              }`}>
                {cat === 'All' ? 'Tất cả' : cat}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Product Content / Grid Area */}
      {loading ? (
        // Loading skeleton
        <div className="grid grid-cols-2 gap-3" id="inventory-loading-skeleton">
          {[1, 2, 4, 5].map((i) => (
            <div key={i} className="bg-white border border-[#c5a880]/15 rounded-2xl p-3 space-y-3 animate-pulse shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-xl"></div>
              <div className="h-3.5 bg-gray-100 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              <div className="h-7 bg-gray-100 rounded-lg w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3" id="products-grid">
          {visibleProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -3, borderColor: "rgba(158,26,30,0.3)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => onOrderProduct(product)}
              className="bg-white border border-[#c5a880]/15 rounded-2xl p-2.5 flex flex-col justify-between cursor-pointer group shadow-[0_8px_24px_rgba(197,168,128,0.04)] hover:shadow-[0_12px_28px_rgba(158,26,30,0.05)] transition-all duration-300"
              id={`product-card-${product.id}`}
            >
              {/* Product Image and Badges */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#faf9f6] border border-[#c5a880]/10 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                {/* Category small badge */}
                <span className="absolute bottom-1.5 left-1.5 text-[7.5px] bg-[#faf9f6] text-[#5a462b] border border-[#c5a880]/20 font-bold uppercase r px-1.5 py-0.5 rounded shadow-sm">
                  {product.category}
                </span>
                {/* Stock badge */}
                <span className={`absolute top-1.5 right-1.5 text-[7.5px] font-bold px-1.5 py-0.5 rounded border backdrop-blur-sm shadow-sm ${
                  product.stock > 0 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {product.stock > 0 ? `Sẵn hàng (${product.stock})` : 'Chờ đặt'}
                </span>
              </div>

              {/* Product Info */}
              <div className="mt-2.5 space-y-2 flex-1 flex flex-col justify-between px-0.5">
                <div>
                  <h3 className="text-[#242220] font-bold text-[10.5px] leading-relaxed min-h-[30px] line-clamp-2 group-hover:text-[#9e1a1e] transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating Single Star - simple and elegant */}
                  <div className="flex items-center space-x-1 mt-1" id={`product-rating-${product.id}`}>
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-current" />
                    <span className="text-[9px] text-gray-400 font-bold">{product.rating.toFixed(1)}</span>
                  </div>
                  
                  {/* Key technical spec bullets */}
                  <ul className="text-[9px] text-[#444] mt-1.5 space-y-0.5 list-disc pl-3 font-sans font-medium leading-normal">
                    {product.specs.slice(0, 2).map((spec, idx) => (
                      <li key={idx} className="line-clamp-1">{spec}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-1.5 space-y-2">
                  {/* Price */}
                  <div className="text-[11px] font-black text-[#b0956d]">
                    {formatPrice(product.price)}
                  </div>

                  {/* Order Button - Champagne Gold Gradient luxury crown accent button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOrderProduct(product);
                    }}
                    className="w-full py-1.5 bg-gradient-to-r from-[#dfc6a3] via-[#c5a880] to-[#a3875e] text-white border border-[#dfc6a3] rounded-lg font-bold text-[9px] uppercase st transition-all flex items-center justify-center space-x-1 cursor-pointer focus:outline-none shadow-sm"
                    id={`btn-order-${product.id}`}
                  >
                    <ShoppingCart className="w-3 h-3 text-white" />
                    <span>Chi tiết</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="flex justify-center pt-2 pb-4">
          <button
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="px-6 py-2.5 bg-white border border-[#c5a880]/25 hover:border-[#9e1a1e]/30 rounded-xl text-[10px] font-bold uppercase st text-[#9e1a1e] transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-[0.97]"
          >
            Xem thêm ({filteredProducts.length - visibleCount} sản phẩm)
          </button>
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-[#c5a880]/20 text-gray-500 text-xs shadow-sm">
          Không tìm thấy thiết bị nào trong danh mục này.
        </div>
      )}
    </div>
  );
}
