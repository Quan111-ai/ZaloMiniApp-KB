import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Grid,
  ShoppingBag,
  PhoneCall,
  MoreHorizontal,
  X,
  Wifi,
  Battery,
  Info,
  Sparkles,
  MessageSquare,
  MessageCircle,
  Phone,
  Send,
  CheckCheck,
  Headphones,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

import HomePage from './pages/index.jsx';
import ServicesPage from './pages/services.jsx';
import InventoryPage from './pages/inventory.jsx';
import ContactPage from './pages/contact.jsx';
import { Header } from './components/Header';
import ThreeIntro from './components/ThreeIntro';
import { mockProducts, fetchProducts } from './api/inventory';
import logoSvg from './assets/logo.svg';
import { ZALO_RECEIVER_PHONE } from './config/zaloConfig';

export default function App() {
  const [activeTab, setActiveTab] = useState('Trang Chủ');
  const [prefilledService, setPrefilledService] = useState('');
  const [prefilledProduct, setPrefilledProduct] = useState<any>(null);
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [showDemoAlert, setShowDemoAlert] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // Dynamic Cart state & Detail modal state
  interface CartItem {
    product: any;
    quantity: number;
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<any | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showProductContact, setShowProductContact] = useState(false);
  const [showContactSuccess, setShowContactSuccess] = useState(false);
  const [productContactForm, setProductContactForm] = useState({ name: '', phone: '', notes: '' });

  // Zalo User Info
  interface ZaloUser {
    name: string;
    avatar: string;
    phone: string;
  }
  const [zaloUser, setZaloUser] = useState<ZaloUser | null>(null);

  // Dynamic products list fetched from the API at the root app level
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setProductsLoading(true);
    fetchProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setProductsLoading(false);
        }
      })
      .catch((err) => {
        console.error("App.tsx failed to fetch products:", err);
        if (isMounted) {
          setProducts(mockProducts);
          setProductsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchZaloUser = async () => {
      let name = 'Khách hàng Thử nghiệm (Zalo Dev)';
      let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
      let phone = '0966452004';

      // 1. Try to fetch user info
      try {
        const { authorize, getUserInfo } = await import('zmp-sdk/apis');
        await authorize({ scopes: ['scope.userInfo'] });
        const { userInfo } = await getUserInfo({});
        if (userInfo?.name) {
          name = userInfo.name;
          avatar = userInfo.avatar || '';
        }
      } catch (_) {
        try {
          const zmpSdk = await import('zmp-sdk');
          if (zmpSdk.getUser) {
            const user = await zmpSdk.getUser();
            if (user?.name) {
              name = user.name;
              avatar = user.avatar || '';
            }
          }
        } catch (__) {}
      }

      // 2. Try to fetch phone number
      try {
        const { getPhoneNumber } = await import('zmp-sdk/apis');
        await new Promise<void>((resolve) => {
          getPhoneNumber({
            success: (data) => {
              // In production, the backend decrypts this token.
              // For dev/test, we default/mock populate.
              phone = '0966452004';
              resolve();
            },
            fail: () => {
              phone = '0966452004';
              resolve();
            }
          });
        });
      } catch (_) {
        phone = '0966452004';
      }

      setZaloUser({ name, avatar, phone });
    };
    fetchZaloUser();
  }, []);

  // Floating fly animation particles
  interface FlyingItem {
    id: number;
    image: string;
  }
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  const triggerFlyAnimation = (product: any) => {
    const id = Date.now();
    setFlyingItems(prev => [...prev, { id, image: product.image }]);
    setTimeout(() => {
      setFlyingItems(prev => prev.filter(item => item.id !== id));
    }, 850);
  };

  // Cart operations
  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    triggerFlyAnimation(product);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Convert cart items to dynamic prefilled message and checkout
  const handleCartCheckout = () => {
    if (cart.length === 0) return;
    
    setIsCartOpen(false);

    let checkoutNotes = "Tôi muốn đặt mua các thiết bị sau từ giỏ hàng:\n";
    let totalPrice = 0;
    cart.forEach(item => {
      const itemSubtotal = item.product.price * item.quantity;
      totalPrice += itemSubtotal;
      checkoutNotes += `- ${item.product.name} (SL: ${item.quantity}) - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(itemSubtotal)}\n`;
    });
    checkoutNotes += `Tổng cộng: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}\n`;
    checkoutNotes += "Vui lòng liên hệ hỗ trợ kỹ thuật tư vấn và lắp đặt.";

    setPrefilledService('');
    setPrefilledProduct({
      id: "multiple-cart",
      name: "Giỏ hàng",
      category: "Mua bán sản phẩm",
      notes: checkoutNotes
    });

    // Clear cart after checkout trigger
    setCart([]);
    setActiveTab('Liên Hệ');
  };

  // Formats currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Cinematic Intro Screen States
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0);
  const [isIntroFadingOut, setIsIntroFadingOut] = useState(false);

  useEffect(() => {
    setShowHeader(true);
    if (!showIntro) {
      
    }
    const container = document.getElementById('zalo-webview-container');
    if (container) {
      container.scrollTop = 0;
    }
  }, [activeTab, showIntro]);

  // Detect if running inside the Zalo Mini App environment or mobile webview
  const [useMockupFrame, setUseMockupFrame] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isZalo = ua.includes('zalo') || ua.includes('microapp') || !!(window as any).zmpSdk || !!(window as any).ZMP;
    const isMobileSize = typeof window !== 'undefined' && window.innerWidth < 1024;
    setUseMockupFrame(!isZalo && !isMobileSize);
  }, []);

  // Global mechanical typing sound feedback for inputs/textareas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (!activeElement) return;

      const isInput =
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.getAttribute('contenteditable') === 'true';

      if (isInput) {
        // Exclude modifier keys, navigation keys, and function keys
        const systemKeys = [
          'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape',
          'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab',
          'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
        ];
        if (!systemKeys.includes(e.key)) {
          
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  // Cleaned up automatic fade-out timers. Intro is now static until user explicitly clicks Enter.

  // Dynamic quick support states
  // Dynamic quick support states
  const [showSupportSheet, setShowSupportSheet] = useState(false);
  const [isHotlineCopied, setIsHotlineCopied] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Navigates to a tab
  const handleNavigateToTab = (tabName) => {
    setActiveTab(tabName);
  };

  // Pre-fills a service and navigates to Contact tab
  const handleRegisterService = (serviceName) => {
    setPrefilledProduct(null);
    setPrefilledService(serviceName);
    setActiveTab('Liên Hệ');
  };

  // Pre-fills a product purchase and navigates to Contact tab
  const handleOrderProduct = (product) => {
    setPrefilledService('');
    setPrefilledProduct(product);
    setActiveTab('Liên Hệ');
  };

  // Opens the Product Detail Modal
  const openProductDetail = (product) => {
    // Find the full product details in dynamic products or mockProducts
    const fullProduct = products.find(p => p.id === product.id) || mockProducts.find(p => p.id === product.id) || product;
    setSelectedDetailProduct(fullProduct);
    setActiveImageIndex(0);
  };

  // Scroll to show/hide header - disabled to prevent jittery scrolling on mobile devices
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    // Header is kept permanently sticky for top-tier stability and branding visibility
  };

  const handleDirectZaloChat = async () => {
    
    try {
      const { openWebview } = await import('zmp-sdk/apis');
      await openWebview({ url: `https://zalo.me/${ZALO_RECEIVER_PHONE}` });
    } catch (_) {
      window.location.href = `https://zalo.me/${ZALO_RECEIVER_PHONE}`;
    }
  };

  const handleClearPrefills = () => {
    setPrefilledService('');
    setPrefilledProduct(null);
  };

  // Formats active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Trang Chủ':
        return (
          <HomePage
            onNavigateToTab={handleNavigateToTab}
            onOpenContactPopup={() => handleRegisterService("Tư vấn chung & Gặp kỹ thuật viên")}
            onOrderProduct={openProductDetail}
            onAddToCart={addToCart}
            products={products}
          />
        );
      case 'Dịch Vụ':
        return (
          <ServicesPage
            onRegisterService={handleRegisterService}
            onOpenServiceDetail={(srv) => {
              setSelectedService(srv);
            }}
          />
        );
      case 'Sản Phẩm':
        return (
          <InventoryPage
            onOrderProduct={openProductDetail}
            products={products}
            loading={productsLoading}
          />
        );
      case 'Liên Hệ':
        return (
          <ContactPage
            prefilledService={prefilledService}
            prefilledProduct={prefilledProduct}
            onClearPrefills={handleClearPrefills}
          />
        );
      default:
        return <HomePage onNavigateToTab={handleNavigateToTab} onOpenContactPopup={() => handleRegisterService("Tư vấn chung & Gặp kỹ thuật viên")} onOrderProduct={openProductDetail} onAddToCart={addToCart} products={products} />;
    }
  };

  return (
    <div
      className={useMockupFrame
        ? "min-h-screen bg-gradient-to-tr from-[#e8e5dc] via-[#f5f3ee] to-[#e8e5dc] text-[#242220] flex flex-col items-center justify-center p-0 md:p-8 select-none font-sans relative"
        : "h-screen w-screen bg-[#faf9f6] text-[#242220] flex flex-col p-0 select-none font-sans relative overflow-hidden"
      }
      id="zalo-simulator-root"
    >
      {/* Absolute luxury background gradients to make the phone mock stand out */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c5a880]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9e1a1e]/4 rounded-full blur-[120px] pointer-events-none"></div>

      {/* iPhone 13 Premium Device Frame - Silver/Chrome White Version */}
      <div
        className={useMockupFrame
          ? "w-full max-w-[410px] h-screen md:h-[840px] md:max-h-[92vh] bg-white md:rounded-[52px] md:border-[11px] md:border-[#e0dcd3] md:ring-8 md:ring-[#f2eee6] flex flex-col overflow-hidden relative shadow-[0_30px_70px_rgba(197,168,128,0.18),0_10px_30px_rgba(0,0,0,0.06)]"
          : "w-full h-full flex flex-col overflow-hidden relative"
        }
        id="zalo-phone-body"
      >
        {/* Self-contained CSS Animations for lag-free sheet/modal transitions */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes kbSheetSlideUp {
            0% {
              transform: translateY(100%);
            }
            100% {
              transform: translateY(0);
            }
          }
          @keyframes kbDrawerSlideIn {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(0);
            }
          }
          @keyframes kbFadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          .animate-kb-sheetSlideUp {
            animation: kbSheetSlideUp 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
          }
          .animate-kb-drawerSlideIn {
            animation: kbDrawerSlideIn 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
          }
          .animate-kb-fadeIn {
            animation: kbFadeIn 0.25s ease-out forwards !important;
          }
        ` }} />

        {/* Cinematic Intro Screen overlay */}
        {showIntro && (
          <div
            className={`absolute inset-0 z-[100] flex flex-col justify-between p-6 pb-9 text-center select-none overflow-hidden bg-gradient-to-b from-[#130709] via-[#090405] to-[#030102] ${isIntroFadingOut ? 'animate-epic-fadeout pointer-events-none' : 'animate-fadeIn'
              }`}
            id="kb-cinematic-intro"
          >
            {/* Dynamic Ambient Red/Gold Light Orbs for ultimate depth and color rich richness */}
            <div className="absolute top-[10%] right-[-30%] w-[380px] h-[380px] bg-gradient-to-br from-[#e50914]/22 via-[#9e1a1e]/12 to-transparent rounded-full blur-[90px] pointer-events-none z-0" />
            <div className="absolute bottom-[10%] left-[-30%] w-[350px] h-[350px] bg-gradient-to-tr from-[#c5a880]/16 via-[#4b3c2c]/8 to-transparent rounded-full blur-[80px] pointer-events-none z-0" />

            {/* Interactive 3D WebGL Canvas */}
            {showIntro && (
              <ThreeIntro active={showIntro} />
            )}



            {/* Centered Brand Identity (Cinema focal point - Official Logo Shape, no background box) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none px-6"
            >
              <div className="relative flex flex-col items-center justify-center">
                {/* Soft glowing white ambient light orb behind the logo to make the black K pop beautifully */}
                <div className="absolute w-44 h-44 bg-white/25 rounded-full blur-[48px] pointer-events-none z-0"></div>

                {/* Brand SVG Logo */}
                <img 
                  src={logoSvg} 
                  className="w-32 h-auto object-contain relative z-10 drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]" 
                  alt="KB Logo" 
                />
              </div>
              <p className="text-[10px] text-[#dfc6a3] uppercase font-sans font-bold mt-6 m-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] relative z-10">
                TECHNOLOGY
              </p>
            </motion.div>

            {/* Compact, elegant explore button centered at the bottom thumb zone */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.6 }}
              className="w-full flex justify-center pb-12 z-20 relative px-6 mt-auto"
            >
              <button
                onClick={() => {
                  
                  setIsIntroFadingOut(true);
                  setTimeout(() => setShowIntro(false), 800);
                }}
                className="px-7 py-3 bg-black/45 hover:bg-black/60 backdrop-blur-md border border-[#c5a880]/50 hover:border-[#c5a880] text-[#dfc6a3] font-medium text-[9px] uppercase rounded-full transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer active:scale-[0.97] whitespace-nowrap shadow-lg shadow-black/30"
                id="btn-enter-app-from-intro"
              >
                <span>Khám Phá Trải Nghiệm</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#dfc6a3]/85" />
              </button>
            </motion.div>
          </div>
        )}
        {/* PHYSICAL BUTTON SIMULATIONS (Left & Right side metal buttons - Only visible on desktop mockup) */}
        {useMockupFrame && (
          <>
            {/* Left side: Silent switcher & Volume Buttons */}
            <div className="hidden md:block absolute left-[-14px] top-[120px] w-[3px] h-[32px] bg-[#d3cebe] rounded-l"></div>
          </>
        )}

        {/* Unified App Interface Wrapper with Ultra-Smooth Entrance Transition */}
        <div
          className={`flex-1 flex flex-col overflow-hidden relative transition-all duration-[1400ms] cubic-bezier(0.16, 1, 0.3, 1) ${showIntro
            ? "opacity-0 scale-[0.97] blur-[12px] pointer-events-none"
            : "opacity-100 scale-100 blur-none"
            }`}
          id="kb-main-app-content-wrapper"
        >
          {/* Zalo Mini App Header Area (Sticky & Premium Glassmorphism) */}
          <Header
            showHeader={showHeader}
            showSystemInfo={showSystemInfo}
            setShowSystemInfo={setShowSystemInfo}
            setShowDemoAlert={setShowDemoAlert}
            useMockupFrame={useMockupFrame}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            onCartClick={() => {
              
              setIsCartOpen(true);
            }}
            activeTab={activeTab}
            zaloUser={zaloUser}
          />

          {/* System Info Banner (Toggled via the 3-dots button) */}
          <AnimatePresence>
            {showSystemInfo && useMockupFrame && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowSystemInfo(false)}
                  className="absolute inset-0 bg-black/50 z-50 cursor-pointer"
                />
                {/* Centered Dialog Container */}
                <div className="absolute inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[300px] bg-white border border-[#c5a880]/30 rounded-2xl p-5 shadow-2xl text-xs text-[#242220] space-y-3 pointer-events-auto"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#9e1a1e] uppercase flex items-center space-x-1.5 font-display text-[10px]">
                        <Sparkles className="w-3.5 h-3.5 text-[#9e1a1e]" />
                        <span>Zalo App Metadata</span>
                      </h4>
                      <button
                        onClick={() => setShowSystemInfo(false)}
                        className="text-gray-400 hover:text-black cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono text-gray-650">
                      <p><span className="text-gray-400">App ID:</span> {import.meta.env.VITE_ZALO_APP_ID || "4223881371373269905"}</p>
                      <p><span className="text-gray-400">Tech Lead:</span> <span className="text-[#9e1a1e] font-bold">ADMIN KB</span></p>
                      <p><span className="text-gray-400">SDK Version:</span> ZMP UI v2.31.0</p>
                      <p><span className="text-gray-400">Framework:</span> React 19 + Vite + Tailwind</p>
                      <p><span className="text-gray-400">Theme:</span> Editorial Luxury Light</p>
                    </div>
                    <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-400 leading-relaxed italic">
                      Bản quyền ứng dụng mini được bảo vệ và vận hành chính thức bởi ADMIN KB.
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>

          {/* Customized Elegant Custom Alert Toast instead of native browser Alert */}
          <AnimatePresence>
            {showDemoAlert && useMockupFrame && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowDemoAlert(false)}
                  className="absolute inset-0 bg-black/50 z-50 cursor-pointer"
                />
                {/* Centered Dialog Container */}
                <div className="absolute inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[300px] bg-white border border-[#c5a880]/30 rounded-2xl p-5 shadow-2xl text-xs text-[#242220] space-y-3 pointer-events-auto"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#242220] uppercase flex items-center space-x-1.5 font-display text-[10px]">
                        <Info className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>Trình mô phỏng Zalo</span>
                      </h4>
                      <button
                        onClick={() => setShowDemoAlert(false)}
                        className="text-gray-400 hover:text-black cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-500 text-[11px] leading-relaxed">
                      Bạn đang trải nghiệm phiên bản mô phỏng trực quan của <strong className="text-[#242220]">KB Zalo Mini App</strong>. Nhấp chọn các tab điều hướng bên dưới để tiếp tục khám phá các dịch vụ CNTT cao cấp!
                    </p>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setShowDemoAlert(false)}
                        className="px-4 py-1.5 bg-gradient-to-b from-[#cf2e2e] to-[#9e1a1e] text-white font-extrabold uppercase text-[9px] r rounded hover:shadow-md transition-all cursor-pointer border-0"
                      >
                        Đồng ý
                      </button>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>

          {/* Inner Webview Content Area (Scrollable pages) */}
          <main
            className="flex-1 bg-[#faf9f6] text-[#242220] relative scrollbar-none kb-mesh-ambient-glow overflow-y-auto pb-20"
            id="zalo-webview-container"
            onScroll={handleScroll}
          >
            {/* High-performance conditional page rendering (destroys hidden background timers and releases memory) */}
            <div className="w-full min-h-full flex flex-col relative">
              {/* Trang Chủ */}
              {activeTab === 'Trang Chủ' && (
                <div className="w-full min-h-full flex flex-col animate-fadeIn">
                  <HomePage
                    active={activeTab === 'Trang Chủ' && !showIntro}
                    onNavigateToTab={handleNavigateToTab}
                    onOpenContactPopup={() => handleRegisterService("Tư vấn chung & Gặp kỹ thuật viên")}
                    onOrderProduct={openProductDetail}
                    onAddToCart={addToCart}
                  />
                </div>
              )}

              {/* Dịch Vụ */}
              {activeTab === 'Dịch Vụ' && (
                <div className="w-full min-h-full flex flex-col animate-fadeIn">
                  <ServicesPage
                    onRegisterService={handleRegisterService}
                    onOpenServiceDetail={(srv) => {
                      
                      setSelectedService(srv);
                    }}
                  />
                </div>
              )}

              {/* Sản Phẩm */}
              {activeTab === 'Sản Phẩm' && (
                <div className="w-full min-h-full flex flex-col animate-fadeIn">
                  <InventoryPage
                    onOrderProduct={openProductDetail}
                  />
                </div>
              )}

              {/* Liên Hệ */}
              {activeTab === 'Liên Hệ' && (
                <div className="w-full min-h-full flex flex-col animate-fadeIn">
                  <ContactPage
                    prefilledService={prefilledService}
                    prefilledProduct={prefilledProduct}
                    onClearPrefills={handleClearPrefills}
                    zaloUser={zaloUser}
                  />
                </div>
              )}
            </div>
          </main>

          {/* Floating Cart Button (FAB) - Gold-Plated Luxury version */}
          <AnimatePresence>
            {!isCartOpen && !selectedService && !selectedDetailProduct && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  
                  setIsCartOpen(true);
                }}
                className="absolute right-4 bottom-[78px] w-12 h-12 rounded-full bg-gradient-to-tr from-[#dfc6a3] via-[#c5a880] to-[#a3875e] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(197,168,128,0.25)] border border-[#dfc6a3]/45 z-45 cursor-pointer focus:outline-none transition-transform"
                id="floating-cart-fab"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#9e1a1e] text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-md animate-pulse">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Floating fly animation particles */}
          <AnimatePresence>
            {flyingItems.map(item => (
              <motion.div
                key={item.id}
                initial={{
                  x: 160,
                  y: 350,
                  scale: 1.2,
                  opacity: 1,
                  rotate: 0
                }}
                animate={{
                  x: 300,
                  y: 710,
                  scale: 0.15,
                  opacity: 0.4,
                  rotate: 360
                }}
                exit={{
                  scale: 0,
                  opacity: 0
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 1, 0.5, 1]
                }}
                className="absolute w-12 h-12 rounded-full border border-[#9e1a1e] overflow-hidden bg-white z-50 pointer-events-none shadow-[0_0_15px_rgba(158,26,30,0.15)]"
              >
                <img src={item.image} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Premium Quick Support Bottom Sheet (GPU-Accelerated CSS Transitions) */}
          {showSupportSheet && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setShowSupportSheet(false)}
                className="absolute inset-0 bg-black/50 z-50 cursor-pointer animate-kb-fadeIn"
              />
              <div
                className="absolute inset-x-0 bottom-0 bg-white border-t border-[#c5a880]/20 rounded-t-[32px] p-5 pb-6 z-50 shadow-[0_-15px_40px_rgba(197,168,128,0.1)] animate-kb-sheetSlideUp"
                style={{ willChange: 'transform' }}
              >
                {/* Pull bar indicator */}
                <div className="w-10 h-1 bg-gray-250 rounded-full mx-auto mb-4" />

                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    <h4 className="text-[#242220] font-black text-xs uppercase r font-display">HỖ TRỢ TRỰC TUYẾN KB</h4>
                  </div>
                  <button
                    onClick={() => setShowSupportSheet(false)}
                    className="p-1.5 text-gray-400 hover:text-black rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="py-4 space-y-3.5">
                  {/* Option 1: Chat Zalo OA (Simulated Chatroom!) */}
                  <button
                    onClick={() => {
                      setShowSupportSheet(false);
                      handleDirectZaloChat();
                    }}
                    className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#cf2e2e] to-[#9e1a1e] border border-[#ff2b36]/15 flex items-center justify-between hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer group shadow-[0_8px_20px_rgba(158,26,30,0.15)] text-left focus:outline-none"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1 mr-2">
                      <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 text-white"
                        >
                          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <h5 className="text-white font-bold text-[9px] uppercase font-display m-0 whitespace-nowrap">Zalo OA</h5>
                      </div>
                    </div>
                    <span className="text-[8px] bg-white text-[#9e1a1e] font-black px-2.5 py-1.5 rounded uppercase shadow-sm whitespace-nowrap flex-shrink-0">Chat ngay</span>
                  </button>

                  {/* Option 2: Technical booking (with setTimeout to ensure transition works smoothly) */}
                  <button
                    onClick={() => {
                      setShowSupportSheet(false);
                      setTimeout(() => {
                        handleRegisterService("Yêu cầu lắp đặt & cấu hình thiết bị cấp tốc");
                      }, 250);
                    }}
                    className="w-full p-3.5 rounded-xl bg-[#f6f4ee] hover:bg-[#eae7df] border border-[#c5a880]/15 flex items-center justify-between hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer group text-left focus:outline-none"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1 mr-2">
                      <div className="p-2 bg-white rounded-lg border border-[#c5a880]/15 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 text-[#9e1a1e]"
                        >
                          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
                          <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <h5 className="text-[#242220] font-bold text-[8.5px] uppercase font-display m-0 whitespace-nowrap">Yêu cầu hỗ trợ</h5>
                      </div>
                    </div>
                    <span className="text-[8px] bg-white text-[#9e1a1e] font-black px-2.5 py-1.5 rounded uppercase border border-[#9e1a1e]/15 whitespace-nowrap flex-shrink-0">Đặt lịch</span>
                  </button>

                  {/* Option 3: Hotline static info with copy action */}
                  <button
                    onClick={() => {
                      const phone = "0933129155";
                      
                      const performCopy = () => {
                        
                        setIsHotlineCopied(true);
                        setTimeout(() => setIsHotlineCopied(false), 2000);
                      };

                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(phone)
                          .then(performCopy)
                          .catch(() => fallbackCopy(phone));
                      } else {
                        fallbackCopy(phone);
                      }

                      function fallbackCopy(text: string) {
                        try {
                          const textArea = document.createElement("textarea");
                          textArea.value = text;
                          textArea.style.position = "fixed";
                          textArea.style.top = "0";
                          textArea.style.left = "0";
                          textArea.style.opacity = "0";
                          document.body.appendChild(textArea);
                          textArea.focus();
                          textArea.select();
                          const copied = document.execCommand("copy");
                          document.body.removeChild(textArea);
                          if (copied) performCopy();
                        } catch (e) {
                          // If copy completely fails (e.g. no user gesture or browser blocks it entirely), fallback to alert info
                          alert("Hotline: " + text);
                        }
                      }
                    }}
                    className="w-full p-3.5 rounded-xl bg-[#f6f4ee] hover:bg-[#eae7df] border border-[#c5a880]/15 flex items-center justify-between hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer group text-left focus:outline-none"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1 mr-2">
                      <div className="p-2 bg-white rounded-lg border border-[#c5a880]/15 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 text-green-600"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1 text-left space-y-0.5">
                        <h5 className="text-[#242220] font-bold text-[8.5px] uppercase font-display m-0 whitespace-nowrap">Hotline hỗ trợ</h5>
                        <p className="text-green-700 font-bold text-[9.5px] font-mono m-0 whitespace-nowrap">0933 129 155</p>
                      </div>
                    </div>
                    <span className={`text-[8px] font-black px-2.5 py-1.5 rounded uppercase  border whitespace-nowrap flex-shrink-0 transition-all duration-350 ${
                      isHotlineCopied 
                        ? "bg-green-600 text-white border-green-600 shadow-[0_0_8px_rgba(22,163,74,0.3)] scale-105" 
                        : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    }`}>
                      {isHotlineCopied ? "✓ Đã chép" : "Sao chép"}
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}



        {/* Global Product Detail Modal */}
        {selectedDetailProduct && (
          <>
            {/* Backdrop overlay */}
            <div
              onClick={() => { setSelectedDetailProduct(null); setShowProductContact(false); setShowContactSuccess(false); }}
              className="absolute inset-0 bg-black/50 z-50 cursor-pointer animate-kb-fadeIn"
            />
            {/* Modal Container Wrapper for Bottom Sheet */}
            <div className="absolute inset-0 flex items-end justify-center z-50 pointer-events-none">
              <div
                className="w-full max-h-[85%] bg-gradient-to-b from-white to-[#faf9f6] border-t border-x border-[#c5a880]/25 rounded-t-[32px] rounded-b-none flex flex-col overflow-hidden shadow-[0_-10px_40px_rgba(197,168,128,0.12)] pointer-events-auto animate-kb-sheetSlideUp"
                style={{ willChange: 'transform' }}
              >
                  {/* Visual Pull Bar */}
                  <div className="w-10 h-1 bg-[#c5a880]/30 rounded-full mx-auto mt-3 mb-1.5 flex-shrink-0" />

                  {/* Modal Header */}
                  <div className="p-4.5 border-b border-[#c5a880]/15 flex justify-between items-center bg-[#faf9f6]">
                    <span className="text-[8.5px] bg-[#9e1a1e]/8 text-[#9e1a1e] border border-[#9e1a1e]/15 px-2.5 py-0.5 rounded-md uppercase r font-mono font-bold">
                      {selectedDetailProduct.category}
                    </span>
                    <button
                      onClick={() => { setSelectedDetailProduct(null); setShowProductContact(false); setShowContactSuccess(false); }}
                      className="p-1.5 text-gray-400 hover:text-black rounded-full bg-gray-150 hover:bg-gray-200 transition-all cursor-pointer focus:outline-none border border-transparent"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Modal Scrollable Body */}
                  <div id="product-detail-scroll-container" className="flex-1 overflow-y-auto p-5 space-y-4.5 scrollbar-none">
                    {/* Product Image Carousel */}
                    {(() => {
                      const imagesList = selectedDetailProduct.images && selectedDetailProduct.images.length > 0
                        ? selectedDetailProduct.images
                        : [selectedDetailProduct.image];

                      const nextImage = (e: React.MouseEvent) => {
                        e.stopPropagation();
                        
                        setActiveImageIndex(prev => (prev + 1) % imagesList.length);
                      };

                      const prevImage = (e: React.MouseEvent) => {
                        e.stopPropagation();
                        
                        setActiveImageIndex(prev => (prev - 1 + imagesList.length) % imagesList.length);
                      };

                      return (
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#faf9f6] border border-[#c5a880]/15 flex items-center justify-center group/carousel">
                          <img
                            src={imagesList[activeImageIndex]}
                            alt={`${selectedDetailProduct.name} ${activeImageIndex + 1}`}
                            className="w-full h-full object-cover transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />

                          {/* Carousel Arrows (only if multiple images) */}
                          {imagesList.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#242220] flex items-center justify-center transition-all cursor-pointer focus:outline-none z-20 backdrop-blur-sm border border-[#c5a880]/15"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#242220] flex items-center justify-center transition-all cursor-pointer focus:outline-none z-20 backdrop-blur-sm border border-[#c5a880]/15"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Carousel Indicators (only if multiple images) */}
                          {imagesList.length > 1 && (
                            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
                              {imagesList.map((_: any, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    
                                    setActiveImageIndex(idx);
                                  }}
                                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 focus:outline-none ${activeImageIndex === idx ? 'bg-[#9e1a1e] w-3.5' : 'bg-gray-300'
                                    }`}
                                />
                              ))}
                            </div>
                          )}

                          {/* Stock indicator badge */}
                          <span className={`absolute top-2.5 right-2.5 text-[8px] font-bold px-2 py-0.5 rounded border backdrop-blur-sm z-20 ${selectedDetailProduct.stock === undefined || selectedDetailProduct.stock > 0
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                            }`}>
                            {selectedDetailProduct.stock === undefined
                              ? 'Còn hàng'
                              : selectedDetailProduct.stock > 0
                                ? `Còn hàng (${selectedDetailProduct.stock})`
                                : 'Hết hàng'}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Title & Price & Rating */}
                    <div className="space-y-2">
                      <h3 className="text-[#242220] text-[12.5px] font-extrabold uppercase leading-relaxed font-display">
                        {selectedDetailProduct.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] font-black text-[#b0956d]">
                          {formatPrice(selectedDetailProduct.price)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-[10px] text-gray-400 font-bold">{selectedDetailProduct.rating.toFixed(1)}</span>
                          <div className="flex text-amber-500">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <svg
                                key={idx}
                                className={`w-3 h-3 ${idx < Math.floor(selectedDetailProduct.rating) ? 'fill-current' : 'text-gray-200'}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Structured Specifications Grid */}
                    <div className="grid grid-cols-2 gap-3" id="product-meta-grid">
                      <div className="bg-[#fcfbfa] border border-[#c5a880]/15 rounded-xl p-3 space-y-1 relative group transition-all duration-300">
                        <span className="text-[9px] text-[#666] uppercase r font-bold block">Mã sản phẩm (SKU)</span>
                        <span className="text-[11.5px] text-[#111] font-mono font-bold block truncate">{selectedDetailProduct.id.toUpperCase()}</span>
                      </div>
                      <div className="bg-[#fcfbfa] border border-[#c5a880]/15 rounded-xl p-3 space-y-1 relative group transition-all duration-300">
                        <span className="text-[9px] text-[#666] uppercase r font-bold block">Hãng sản xuất</span>
                        <span className="text-[11.5px] text-[#111] font-bold block truncate">{selectedDetailProduct.brand || "KB Technology"}</span>
                      </div>
                      <div className="bg-[#fcfbfa] border border-[#c5a880]/15 rounded-xl p-3 space-y-1 relative group transition-all duration-300">
                        <span className="text-[9px] text-[#666] uppercase r font-bold block">Thời hạn bảo hành</span>
                        <span className="text-[11.5px] text-[#9e1a1e] font-extrabold block truncate">{selectedDetailProduct.warranty || "12 tháng"}</span>
                      </div>
                      <div className="bg-[#fcfbfa] border border-[#c5a880]/15 rounded-xl p-3 space-y-1 relative group transition-all duration-300">
                        <span className="text-[9px] text-[#666] uppercase r font-bold block">Tình trạng / Xuất xứ</span>
                        <span className="text-[11.5px] text-[#111] font-bold block truncate">
                          {selectedDetailProduct.condition ? selectedDetailProduct.condition.split(' ')[0] : 'Mới'} / {selectedDetailProduct.origin ? selectedDetailProduct.origin.split(' ')[selectedDetailProduct.origin.split(' ').length - 1] : 'Chính hãng'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-[#111] uppercase r font-display font-bold">Mô tả sản phẩm:</span>
                      <p className="text-[11px] text-[#333] font-normal leading-relaxed m-0">
                        {selectedDetailProduct.description}
                      </p>
                    </div>

                    {/* Specs */}
                    {selectedDetailProduct.specs && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] text-[#111] uppercase r font-display font-bold">Thông số kỹ thuật:</span>
                        <ul className="text-[11px] text-[#333] font-medium space-y-1.5 list-disc pl-4 leading-relaxed m-0">
                          {selectedDetailProduct.specs.map((spec: string, idx: number) => (
                            <li key={idx}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Guarantee info */}
                    <div className="flex items-center space-x-2 bg-[#f6f5f0] border border-[#c5a880]/15 rounded-xl p-3 text-[9px] text-gray-500">
                      <CheckCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Cam kết bảo hành chính hãng từ 12-24 tháng bởi <strong>ADMIN KB</strong>. Hỗ trợ lắp đặt và cấu hình trực tiếp tận nơi.</span>
                    </div>

                    {/* ═══ INLINE PRODUCT CONTACT FORM ═══ */}
                    <AnimatePresence>
                      {showProductContact && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 pb-1 space-y-2.5">
                            <div className="bg-[#9e1a1e]/5 border border-[#9e1a1e]/10 rounded-xl px-3 py-2">
                              <p className="text-[8px] text-[#9e1a1e] uppercase st font-bold m-0">Tư vấn sản phẩm</p>
                              <p className="text-[9px] text-[#242220] m-0 mt-0.5 font-medium">{selectedDetailProduct?.name}</p>
                              <p className="text-[8px] text-gray-400 m-0 mt-0.5">{selectedDetailProduct?.sku} • <strong className="text-gray-500 font-extrabold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedDetailProduct?.price || 0)}</strong></p>
                            </div>
                            <input
                              type="text"
                              value={productContactForm.name}
                              onChange={(e) => setProductContactForm({ ...productContactForm, name: e.target.value })}
                              placeholder="Họ và tên *"
                              className="w-full bg-[#faf9f6] border border-[#c5a880]/20 focus:border-[#9e1a1e]/40 focus:outline-none rounded-xl py-2.5 px-3.5 text-[10px] text-[#242220] placeholder-gray-400 transition-colors"
                            />
                            <input
                              type="tel"
                              value={productContactForm.phone}
                              onChange={(e) => setProductContactForm({ ...productContactForm, phone: e.target.value })}
                              placeholder="Số điện thoại *"
                              className="w-full bg-[#faf9f6] border border-[#c5a880]/20 focus:border-[#9e1a1e]/40 focus:outline-none rounded-xl py-2.5 px-3.5 text-[10px] text-[#242220] placeholder-gray-400 transition-colors"
                            />
                            <textarea
                              value={productContactForm.notes}
                              onChange={(e) => setProductContactForm({ ...productContactForm, notes: e.target.value })}
                              placeholder="Ghi chú (số lượng, yêu cầu riêng...)"
                              rows={2}
                              className="w-full bg-[#faf9f6] border border-[#c5a880]/20 focus:border-[#9e1a1e]/40 focus:outline-none rounded-xl py-2.5 px-3.5 text-[10px] text-[#242220] placeholder-gray-400 transition-colors resize-none"
                            />
                            <button
                              onClick={() => {
                                if (!productContactForm.name || !productContactForm.phone) {
                                  alert("Vui lòng điền Họ tên và Số điện thoại!");
                                  return;
                                }
                                setShowContactSuccess(true);
                                setProductContactForm({ name: '', phone: '', notes: '' });
                              }}
                              className="w-full py-2.5 bg-gradient-to-r from-[#cf2e2e] to-[#9e1a1e] text-white rounded-xl text-[10px] uppercase st font-black flex items-center justify-center space-x-2 cursor-pointer focus:outline-none shadow-md shadow-[#9e1a1e]/15 border-0 active:scale-[0.98] transition-all"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Gửi yêu cầu tư vấn</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Success Dialog Overlay inside Modal */}
                  <AnimatePresence>
                    {showContactSuccess && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#faf9f6]/95 z-55 flex flex-col items-center justify-center p-6 text-center"
                      >
                        <motion.div
                          initial={{ scale: 0.9, y: 15 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.9, y: 15 }}
                          transition={{ type: "spring", damping: 25, stiffness: 200 }}
                          className="bg-white border border-[#c5a880]/20 rounded-3xl p-6 flex flex-col items-center space-y-4 shadow-xl"
                        >
                          <div className="w-11 h-11 rounded-full bg-[#1b7343]/10 flex items-center justify-center text-[#1b7343] shadow-[0_0_12px_rgba(27,115,67,0.15)] animate-pulse">
                            <CheckCircle2 className="w-5.5 h-5.5" />
                          </div>
                          <div className="space-y-1.5">
                            <h4 className="text-[11px] font-bold text-[#242220] uppercase st">GỬI THÀNH CÔNG!</h4>
                            <p className="text-[9px] text-gray-500 max-w-[210px] leading-relaxed m-0">
                              Yêu cầu tư vấn thiết bị của bạn đã được tiếp nhận. Đội ngũ chuyên gia của <strong>KB Technology</strong> sẽ liên hệ hỗ trợ trong <strong>5 phút</strong>.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setShowContactSuccess(false);
                              setShowProductContact(false);
                              setSelectedDetailProduct(null);
                            }}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#cf2e2e] to-[#9e1a1e] text-white rounded-xl text-[9px] uppercase st font-black active:scale-[0.96] transition-all cursor-pointer focus:outline-none border-0 shadow-md shadow-[#9e1a1e]/15"
                          >
                            Đồng ý
                          </button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Modal Footer Actions */}
                  <div className="p-4 bg-[#f5f3ee] border-t border-[#c5a880]/15 flex space-x-3.5">
                    {/* Add to Cart button */}
                    <button
                      onClick={() => {
                        addToCart(selectedDetailProduct);
                        setSelectedDetailProduct(null);
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-[#dfc6a3] via-[#c5a880] to-[#a3875e] text-white border border-[#dfc6a3] rounded-xl text-[10px] uppercase font-extrabold flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer focus:outline-none shadow-sm shadow-[#c5a880]/20"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-white" />
                      <span className="whitespace-nowrap">Thêm vào giỏ</span>
                    </button>

                    {/* Contact directly button */}
                    <button
                      onClick={() => {
                        const nextState = !showProductContact;
                        setShowProductContact(nextState);
                        if (nextState) {
                          // Keep container scrolled to the bottom continuously during animation (approx 500ms)
                          let ticks = 0;
                          const interval = setInterval(() => {
                            const container = document.getElementById('product-detail-scroll-container');
                            if (container) {
                              container.scrollTop = container.scrollHeight;
                            }
                            ticks++;
                            if (ticks >= 20) clearInterval(interval);
                          }, 25);
                        }
                      }}
                      className={`flex-1 py-3 rounded-xl text-[9px] uppercase r font-black flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer focus:outline-none border-0 ${showProductContact
                        ? 'bg-gray-100 text-[#9e1a1e]'
                        : 'bg-gradient-to-r from-[#cf2e2e] to-[#9e1a1e] text-white shadow-lg shadow-[#9e1a1e]/15'
                        }`}
                    >
                      {showProductContact ? <X className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                      <span className="whitespace-nowrap">{showProductContact ? 'Đóng' : 'Liên hệ ngay'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        {/* Global Service Detail Modal */}
        {selectedService && (
          <>
            {/* Backdrop overlay */}
            <div
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/50 z-50 cursor-pointer animate-kb-fadeIn"
            />
            {/* Modal Container Wrapper for Bottom Sheet */}
            <div className="absolute inset-0 flex items-end justify-center z-50 pointer-events-none">
              <div
                className="bg-white border-t border-x border-[#c5a880]/20 w-full rounded-t-[32px] rounded-b-none overflow-hidden shadow-2xl flex flex-col max-h-[80%] pointer-events-auto animate-kb-sheetSlideUp"
                style={{ willChange: 'transform' }}
              >
                  <div className="w-10 h-1 bg-[#c5a880]/30 rounded-full mx-auto mt-3 mb-1" />

                  {/* Modal Header */}
                  <div className="p-4 bg-[#faf9f6] border-b border-[#c5a880]/15 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <div className="p-1.5 bg-white border border-[#c5a880]/15 rounded-lg flex-shrink-0">
                        {selectedService.icon}
                      </div>
                      <h3 className="text-[#242220] font-extrabold font-display text-[11px] uppercase text-left m-0 leading-tight">
                        {selectedService.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedService(null)}
                      className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black transition-colors cursor-pointer focus:outline-none flex-shrink-0 ml-2"
                      id="btn-close-service-popup"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-4.5 overflow-y-auto space-y-4 flex-1 scrollbar-none">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#9e1a1e] r uppercase font-display block">Báo giá tham khảo</span>
                      <p className="font-black text-[14.5px] text-[#9e1a1e] m-0">
                        {selectedService.priceRange}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-gray-500 r uppercase font-display block">Mô tả giải pháp</span>
                      <p className="text-gray-700 text-[11px] leading-relaxed font-sans font-medium m-0">
                        {selectedService.longDesc}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-gray-500 r uppercase font-display block">Đặc điểm nổi bật</span>
                      <ul className="space-y-1.5 m-0 pl-0 list-none">
                        {selectedService.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2 text-gray-700 text-[11px] font-sans font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#9e1a1e] mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 bg-[#f6f5f0] rounded-lg border border-[#c5a880]/15 text-[10px] text-gray-600 font-medium italic leading-normal">
                      Giải pháp được kiểm nghiệm thực tế và hoàn thiện ở tiêu chuẩn cao nhất bởi đội ngũ KB.
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-3 bg-[#faf9f6] border-t border-[#c5a880]/15 flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedService(null);
                        handleRegisterService(selectedService.name);
                      }}
                      className="w-full py-2 bg-[#9e1a1e] hover:bg-[#7c1215] text-white font-light text-[9.5px] uppercase r rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer focus:outline-none border-0"
                      id="btn-register-service-inside-popup"
                    >
                      <span>Nhận tư vấn ngay</span>
                    </button>
                  </div>
              </div>
            </div>
          </>
        )}

        {/* Dynamic Cart Drawer */}
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/50 z-50 cursor-pointer animate-kb-fadeIn"
            />
            {/* Drawer panel */}
            <div
              className="absolute right-0 top-0 bottom-0 w-[82%] max-w-[340px] bg-white border-l border-[#c5a880]/15 z-50 flex flex-col shadow-2xl animate-kb-drawerSlideIn"
              style={{ willChange: 'transform' }}
            >
                {/* Drawer Header */}
                <div className="p-4.5 pt-[calc(env(safe-area-inset-top,0px)+22px)] border-b border-gray-100 flex items-center bg-[#faf9f6] space-x-3">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-black rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer focus:outline-none border-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-4 h-4 text-[#9e1a1e]" />
                    <h4 className="text-[#242220] font-extrabold text-[11px] uppercase r font-display">Giỏ hàng ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h4>
                  </div>
                </div>

                {/* Drawer Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none bg-[#faf9f6]">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-450 py-16">
                      <div className="p-4 bg-white rounded-full border border-[#c5a880]/15">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold text-gray-600">Giỏ hàng của bạn trống</p>
                        <p className="text-[9.5px] leading-relaxed max-w-[200px] mx-auto text-gray-400">Chọn các sản phẩm chất lượng cao trong thẻ 'Sản Phẩm' hoặc Trang Chủ để thêm vào giỏ.</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          setActiveTab('Sản Phẩm');
                        }}
                        className="px-5 py-2.5 bg-[#9e1a1e] text-white font-bold uppercase text-[9px] r rounded-lg hover:bg-[#7c1215] transition-all cursor-pointer focus:outline-none border-0"
                      >
                        Khám phá thiết bị
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between p-2.5 bg-white border border-[#c5a880]/12 rounded-xl space-x-3 group relative overflow-hidden shadow-sm"
                      >
                        {/* Item Image */}
                        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        {/* Item Details */}
                        <div className="flex-1 min-w-0 space-y-1 text-left">
                          <h5 className="text-[10px] text-gray-800 font-bold leading-snug break-words m-0">{item.product.name}</h5>
                          <span className="text-[9.5px] text-[#b0956d] font-black block">{formatPrice(item.product.price)}</span>

                          {/* Quantity Selector */}
                          <div className="flex items-center space-x-2 pt-1">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, -1)}
                              className="w-4.5 h-4.5 bg-[#f5f3ee] border border-[#c5a880]/15 rounded flex items-center justify-center text-gray-700 hover:text-black cursor-pointer focus:outline-none"
                            >
                              <Minus className="w-2.5 h-2.5 text-gray-600" />
                            </button>
                            <span className="text-[10px] font-bold text-gray-800 min-w-[12px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, 1)}
                              className="w-4.5 h-4.5 bg-[#f5f3ee] border border-[#c5a880]/15 rounded flex items-center justify-center text-gray-700 hover:text-black cursor-pointer focus:outline-none"
                            >
                              <Plus className="w-2.5 h-2.5 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Action */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-gray-400 hover:text-[#9e1a1e] rounded-lg hover:bg-red-50 border border-transparent transition-all cursor-pointer focus:outline-none self-start"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Drawer Footer Actions (When cart has items) */}
                {cart.length > 0 && (
                  <div className="p-4 bg-white border-t border-gray-100 space-y-4 shadow-md">
                    {/* Totals Summary */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Tổng cộng:</span>
                      <span className="font-black text-[#b0956d] text-xs">
                        {formatPrice(cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))}
                      </span>
                    </div>

                    {/* Order buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={handleCartCheckout}
                        className="w-full py-3.5 bg-gradient-to-r from-[#cf2e2e] to-[#9e1a1e] text-white rounded-xl text-[10px] uppercase st font-black flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer focus:outline-none shadow-lg shadow-[#9e1a1e]/15 border-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Liên hệ đặt hàng</span>
                      </button>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="w-full py-2.5 bg-transparent hover:bg-gray-50 border border-transparent hover:border-gray-200 text-gray-500 hover:text-black rounded-lg text-[9px] uppercase r font-bold transition-all cursor-pointer focus:outline-none"
                      >
                        Tiếp tục chọn đồ
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </>
        )}

        {/* Refined Elegant Zalo Bottom Navigation Bar (Glassmorphic & Ivory Theme) */}
        <footer
          className={`bg-white px-4 pt-2.5 pb-1 md:pb-1.5 flex flex-col relative z-40 shadow-[0_-10px_35px_rgba(197,168,128,0.05)] select-none border-t border-[#c5a880]/15 ${
            selectedDetailProduct || selectedService || isCartOpen || showSupportSheet ? 'pointer-events-none' : ''
          }`}
          id="zalo-bottom-navigation"
        >
          {/* Animated gold laser sweep line running across the footer border */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-transparent overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 h-full w-28 bg-gradient-to-r from-transparent via-[#c5a880]/40 to-transparent shadow-[0_0_8px_#c5a880] animate-sweep-red-line"></div>
          </div>

          {/* Main Navigation Tabs */}
          <div className="flex justify-between items-center w-full px-4">
            {/* Tab 1: Trang Chủ */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => handleNavigateToTab('Trang Chủ')}
              className="flex flex-col items-center flex-1 py-1 px-1 relative transition-all duration-300 cursor-pointer outline-none focus:outline-none focus-visible:outline-none border-none bg-transparent"
              id="tab-home"
            >
              <div className="relative flex flex-col items-center">
                <Home className={`w-5 h-5 transition-all duration-300 ${activeTab === 'Trang Chủ' ? 'text-[#9e1a1e] scale-110 drop-shadow-[0_0_8px_rgba(158,26,30,0.2)]' : 'text-gray-400 hover:text-black'
                  }`} />
                <span className={`text-[9px] font-bold mt-1 transition-all duration-300 ${activeTab === 'Trang Chủ' ? 'text-[#9e1a1e]' : 'text-gray-400'
                  }`}>Trang Chủ</span>
              </div>
              {/* Dynamic underline */}
              {activeTab === 'Trang Chủ' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  transition={{ type: "spring", stiffness: 385, damping: 28 }}
                  className="absolute bottom-[-6px] w-6 h-[2px] rounded-full bg-[#9e1a1e] shadow-[0_0_6px_#9e1a1e]"
                />
              )}
            </motion.button>

            {/* Center Tab: Hỗ Trợ (Dynamic circular gold support button) */}
            <motion.button
              whileTap={{ scale: 0.90 }}
              onClick={() => setShowSupportSheet(true)}
              className="flex flex-col items-center flex-1 relative transition-all duration-300 cursor-pointer outline-none focus:outline-none focus-visible:outline-none border-none bg-transparent"
              id="tab-support-action"
            >
              <div className="relative flex flex-col items-center -mt-4.5 mb-1">
                {/* Glowing Gold 3D Button */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-b from-[#dfc6a3] via-[#c5a880] to-[#a3875e] flex items-center justify-center shadow-[inset_0_1.5px_0_rgba(255,255,255,0.45),0_5px_15px_rgba(197,168,128,0.45)] border-[2.5px] border-white relative group hover:scale-105 transition-all duration-300">
                  <span className="absolute inset-0 rounded-full bg-[#c5a880] opacity-15 animate-ping"></span>
                  <MessageCircle className="w-5 h-5 text-[#5a462b]" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
                </div>
                <span className="text-[9px] font-black text-[#c5a880] mt-1 uppercase r scale-95 font-display">Hỗ Trợ</span>
              </div>
            </motion.button>

            {/* Tab 2: Dịch Vụ */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => handleNavigateToTab('Dịch Vụ')}
              className="flex flex-col items-center flex-1 py-1 px-1 relative transition-all duration-300 cursor-pointer outline-none focus:outline-none focus-visible:outline-none border-none bg-transparent"
              id="tab-services"
            >
              <div className="relative flex flex-col items-center">
                <Grid className={`w-5 h-5 transition-all duration-300 ${activeTab === 'Dịch Vụ' ? 'text-[#9e1a1e] scale-110 drop-shadow-[0_0_8px_rgba(158,26,30,0.2)]' : 'text-gray-400 hover:text-black'
                  }`} />
                <span className={`text-[9px] font-bold mt-1 transition-all duration-300 ${activeTab === 'Dịch Vụ' ? 'text-[#9e1a1e]' : 'text-gray-400'
                  }`}>Dịch Vụ</span>
              </div>
              {/* Dynamic underline */}
              {activeTab === 'Dịch Vụ' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  transition={{ type: "spring", stiffness: 385, damping: 28 }}
                  className="absolute bottom-[-6px] w-6 h-[2px] rounded-full bg-[#9e1a1e] shadow-[0_0_6px_#9e1a1e]"
                />
              )}
            </motion.button>
          </div>

          {/* Premium Integrated iOS Home Indicator Bar */}
          {useMockupFrame && (
            <div className="w-full flex justify-center pt-3 pb-1.5" id="ios-home-indicator-container">
              <div className="w-28 h-[4px] bg-black/10 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)]"></div>
            </div>
          )}
        </footer>
      </div>
    </div>
    </div >
  );
}
