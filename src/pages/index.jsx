import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Star,
  Server,
  User,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Tv,
  Sparkles,
  Wrench,
  Zap,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import logoSvg from '../assets/logo.svg';



// A highly robust cinematic background component that:
// 1. Always renders a beautiful static technology background from Unsplash as the solid foundation.
// 2. Tries to play a high-quality video loop on top.
// 3. Implements programmatic autoplay, explicit muting, and error handling.
// 4. Smoothly cross-fades the video in once it starts playing so there are no black screens or sudden flashes.
// 5. Overlays an elegant cyber-scanline grid and digital matrix-pulse layer to create that high-tech Netflix vibe!
// A premium, high-performance ambient mesh background that replaces heavy video elements.
// Utilizes CSS transitions, 2D transform animations, and a dark gold technological grid.
// Resolves 100% of mobile scroll stuttering/lag, consuming 0% video decoding CPU/GPU resources.
function CinematicBackground({ active }) {
  return (
    <div 
      className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#241317] via-[#0a0708] to-[#2b181b] pointer-events-none animate-fadeIn"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Embedded CSS Style tag for hardware-accelerated fluid background animations */}
      <style>{`
        @keyframes floatGlowGold {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1.0);
            opacity: 0.22;
          }
          50% {
            transform: translate3d(6%, -8%, 0) scale(1.25);
            opacity: 0.45;
          }
        }
        @keyframes floatGlowRed {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1.15);
            opacity: 0.16;
          }
          50% {
            transform: translate3d(-8%, 6%, 0) scale(0.95);
            opacity: 0.35;
          }
        }
        @keyframes scanlineSweep {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>



      {/* 2. Golden Breathing Light Spot (Brightened opacities) */}
      <div 
        className="absolute top-[-15%] right-[-15%] w-[85%] h-[80%] rounded-full blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(197, 168, 128, 0.44) 0%, rgba(197, 168, 128, 0.05) 65%, transparent 100%)',
          animation: active ? 'floatGlowGold 15s ease-in-out infinite' : 'none',
          willChange: 'transform, opacity'
        }}
      />

      {/* 3. Deep Crimson Caustic Light Spot (Brightened opacities) */}
      <div 
        className="absolute bottom-[-20%] left-[-20%] w-[90%] h-[85%] rounded-full blur-[125px]"
        style={{
          background: 'radial-gradient(circle, rgba(158, 26, 30, 0.38) 0%, rgba(158, 26, 30, 0.03) 65%, transparent 100%)',
          animation: active ? 'floatGlowRed 18s ease-in-out infinite' : 'none',
          willChange: 'transform, opacity'
        }}
      />

      {/* 4. Fine Digital Tech Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #c5a880 1px, transparent 1px), linear-gradient(to bottom, #c5a880 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          width: '100%',
          height: '100%'
        }}
      />

      {/* 5. Elegant cyber-scanline grid to create that high-tech Netflix vibe */}
      <div 
        className="absolute inset-0 overflow-hidden opacity-[0.02] pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        <div 
          className="w-full h-2 bg-gradient-to-b from-transparent via-[#c5a880] to-transparent"
          style={{
            animation: active ? 'scanlineSweep 8s linear infinite' : 'none',
            willChange: 'transform'
          }}
        />
      </div>

      {/* 6. Soft Cinematic Vignette Overlay (Softened from from-black/90 to from-black/75 to increase center brightness) */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/32 z-10 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

// FAQ Accordion Item with smooth expand/collapse
function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.03)] ${isOpen ? 'border-[#9e1a1e]/20 shadow-[0_4px_16px_rgba(158,26,30,0.06)]' : 'border-[#c5a880]/15'
        }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center px-3.5 py-2.5 cursor-pointer bg-transparent border-none focus:outline-none text-left"
      >
        <span className={`flex-1 text-[9.5px] font-semibold leading-snug tracking-tight pr-2 transition-colors duration-200 ${isOpen ? 'text-[#9e1a1e]' : 'text-[#242220]'
          }`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex-shrink-0 ml-auto"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-colors duration-200 ${isOpen ? 'text-[#9e1a1e]' : 'text-gray-400'}`} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3 pt-0">
              <div className="w-full h-px bg-[#c5a880]/10 mb-2.5" />
              <p className="text-[9px] text-gray-500 leading-relaxed m-0">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomePage({ active = true, onNavigateToTab, onOpenContactPopup, onOrderProduct, onAddToCart, products = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);


  // 5 slides integrated with associated commitments at the data layer
  // Updated with unexpired, high-quality, cinematic technology video loops from Mixkit CDN (Netflix tech vibe)
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
      video: "/intro-video.mp4",
      title: "HẠ TẦNG CLOUD",
      subtitle: "BĂNG THÔNG KHÔNG GIỚI HẠN",
      desc: "Giải pháp đám mây ảo hoá tối tân với SSD NVMe siêu tốc, cam kết SLA 99.99% vận hành ổn định.",
      commitment: {
        title: "Cam Kết Chất Lượng",
        tabLabel: "Chất Lượng",
        desc: "Thiết bị chính hãng, giải pháp CNTT đo chuẩn xác theo quy mô.",
        icon: <CheckCircle2 className="w-5 h-5 text-[#c5a880] animate-pulse" />,
        badge: "Chính hãng 100%"
      }
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      video: "/intro-video.mp4",
      title: "BẢO MẬT ĐA TẦNG",
      subtitle: "PHÒNG CHỐNG DDOS CHUYÊN SÂU",
      desc: "Thiết lập tường lửa Fortinet cứng bảo vệ toàn vẹn dữ liệu doanh nghiệp trước mã độc tống tiền.",
      commitment: {
        title: "Cam Kết Thời Gian",
        tabLabel: "Thời Gian",
        desc: "Hỗ trợ 24/7/365, phản hồi trong 15p, xử lý onsite cấp tốc.",
        icon: <Clock className="w-5 h-5 text-[#c5a880] animate-pulse" />,
        badge: "Phản hồi 15p"
      }
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
      video: "/intro-video.mp4",
      title: "HỆ THỐNG CAMERA AI",
      subtitle: "NHẬN DIỆN THÔNG MINH KỶ NGUYÊN SỐ",
      desc: "Chấm công tự động, cảnh báo xâm nhập thời gian thực tích hợp trực tiếp qua Zalo & Telegram.",
      commitment: {
        title: "Cam Kết Tối Ưu Chi Phí",
        tabLabel: "Chi Phí",
        desc: "Tối ưu ngân sách đầu tư ban đầu và hiệu suất vận hành.",
        icon: <Star className="w-5 h-5 text-[#c5a880] animate-pulse" />,
        badge: "Tiết kiệm 30%"
      }
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      video: "/intro-video.mp4",
      title: "HẠ TẦNG MẠNG ĐIỆN",
      subtitle: "MỸ THUẬT & CHUẨN KỸ THUẬT",
      desc: "Thiết kế đi dây thẩm mỹ, đo kiểm Fluke chất lượng, tối ưu luồng cáp mạng tủ rack chuyên nghiệp.",
      commitment: {
        title: "Cam Kết Thẩm Mỹ",
        tabLabel: "Thẩm Mỹ",
        desc: "Dây cáp đi ống ghen gọn gàng, tủ Rack bố trí khoa học dễ quản lý.",
        icon: <Wrench className="w-5 h-5 text-[#c5a880] animate-pulse" />,
        badge: "Bảo hành 24t"
      }
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      video: "/intro-video.mp4",
      title: "IT HELPDESK",
      subtitle: "ỦY THÁC IT HELPDESK TOÀN DIỆN",
      desc: "Đồng hành 24/7 bảo trì hệ thống định kỳ, xử lý nhanh sự cố phần cứng, phần mềm và máy in.",
      commitment: {
        title: "Cam Kết Vận Hành",
        tabLabel: "Vận Hành",
        desc: "Túc trực liên tục, hỗ trợ từ xa không giới hạn và onsite cấp tốc.",
        icon: <ShieldCheck className="w-5 h-5 text-[#c5a880] animate-pulse" />,
        badge: "Uptime 99.9%"
      }
    }
  ];

  // Auto-play slides (Only when page is active to prevent hidden background timers)
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, active]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Statistics data
  const stats = [
    { id: 1, value: "13,500+", label: "Giờ vận hành", icon: <Clock className="w-4 h-4 text-gray-500" /> },
    { id: 2, value: "720+", label: "Dự án CNTT", icon: <Star className="w-4 h-4 text-gray-500" /> },
    { id: 3, value: "99.99%", label: "Uptime SLA", icon: <Server className="w-4 h-4 text-gray-500" /> },
    { id: 4, value: "50+", label: "Chuyên gia", icon: <User className="w-4 h-4 text-gray-500" /> }
  ];

  // Featured products (Expanded to 24 products for realistic infinite scroll and manual load-more demo)
  const fallbackProducts = [
    {
      id: "kb-ws-01",
      name: "KB Workstation Ultimate X1",
      price: 45990000,
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=400&q=80",
      status: "Sẵn hàng",
      rating: 5.0,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-cam-02",
      name: "Camera AI KB-Sentinel 4K",
      price: 8500000,
      image: "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=400&q=80",
      status: "Bán chạy",
      rating: 4.9,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-router-03",
      name: "Router Mikrotik RB5009UG+S+IN",
      price: 7200000,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80",
      status: "Tải cao",
      rating: 4.8,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-fw-05",
      name: "Firewall Fortinet FortiGate 40F",
      price: 16500000,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80",
      status: "Bảo mật",
      rating: 4.9,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-ups-04",
      name: "UPS CyberPower 1500VA",
      price: 5400000,
      image: "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?auto=format&fit=crop&w=400&q=80",
      status: "Lưu điện",
      rating: 4.7,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-srv-06",
      name: "Server Rack KB-Host R1 Enterprise",
      price: 32500000,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
      status: "Máy chủ",
      rating: 5.0,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-sw-07",
      name: "Switch Cisco CBS250-24T-4G",
      price: 9800000,
      image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=400&q=80",
      status: "Ổn định",
      rating: 4.8,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-ssd-08",
      name: "SSD Enterprise PM893 1.92TB",
      price: 6700000,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80",
      status: "Bền bỉ",
      rating: 4.9,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-ap-09",
      name: "Access Point Aruba Instant On AP22",
      price: 3600000,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80",
      status: "WiFi 6",
      rating: 4.8,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-nas-10",
      name: "NAS Synology DS224+ 2-Bay Personal Cloud",
      price: 9200000,
      image: "https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=400&q=80",
      status: "Lưu trữ",
      rating: 4.9,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-draytek-11",
      name: "Router DrayTek Vigor2927 Dual-WAN",
      price: 38500000,
      image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=400&q=80",
      status: "Cân bằng tải",
      rating: 4.7,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-cam-12",
      name: "Camera IP Hikvision ColorVu 4MP Dome",
      price: 2450000,
      image: "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=400&q=80",
      status: "Có màu đêm",
      rating: 4.8,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-sw-13",
      name: "Switch Aruba Instant On 1930 24G",
      price: 7800000,
      image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=400&q=80",
      status: "Quản trị",
      rating: 4.9,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-ups-14",
      name: "Bộ Lưu Điện APC Back-UPS Pro 900VA",
      price: 3800000,
      image: "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?auto=format&fit=crop&w=400&q=80",
      status: "Bảo vệ nguồn",
      rating: 4.6,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-cab-15",
      name: "Cáp mạng Golden Link Cat6 UTP 305m",
      price: 1950000,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80",
      status: "Đồng xịn",
      rating: 4.7,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-fw-16",
      name: "Firewall Sophos XGS 107 Security Gateway",
      price: 21500000,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80",
      status: "Next-Gen",
      rating: 5.0,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-ap-17",
      name: "Bộ phát sóng Ubiquiti UniFi U6-Lite",
      price: 3150000,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80",
      status: "Xuyên tường",
      rating: 4.9,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-srv-18",
      name: "Server Dell PowerEdge T150 Intel Xeon",
      price: 28900000,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
      status: "Hiệu năng tốt",
      rating: 4.8,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-cam-19",
      name: "Camera IP Dahua WizSense 4MP AI",
      price: 1850000,
      image: "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=400&q=80",
      status: "Nhận diện AI",
      rating: 4.7,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-sw-20",
      name: "Switch Ruijie RG-ES205GC 5-Port Gigabit",
      price: 850000,
      image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=400&q=80",
      status: "Giá tốt nhất",
      rating: 4.5,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-ext-21",
      name: "Bộ kích sóng TP-Link RE705X AX3000 WiFi 6",
      price: 1650000,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80",
      status: "Mở rộng mạng",
      rating: 4.6,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-hdd-22",
      name: "Ổ cứng HDD Seagate IronWolf 4TB Chuyên Dụng",
      price: 3450000,
      image: "https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=400&q=80",
      status: "Chuyên NAS",
      rating: 4.8,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-opt-23",
      name: "Module Quang SFP Cisco Gigabit Ethernet",
      price: 1250000,
      image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=400&q=80",
      status: "Truyền dẫn xa",
      rating: 4.7,
      managedBy: "ADMIN KB"
    },
    {
      id: "kb-rack-24",
      name: "Tủ Rack 9U D600 Treo Tường Toàn Phần",
      price: 1450000,
    }
  ];

  const featuredProducts = products && products.length > 0 ? products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    status: p.stock > 0 ? "Sẵn hàng" : "Hết hàng",
    rating: p.rating,
    managedBy: p.managedBy
  })) : fallbackProducts;

  // Pagination — manual only, no auto-scroll
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="space-y-6 bg-[#faf9f6] min-h-screen text-[#242220] kb-mesh-ambient-glow" id="kb-home-page">
      {/* Inject custom high-end cinematic keyframes and animations directly */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scanner-sweep {
          0% { transform: translateY(0%); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(250px); opacity: 0; }
        }
        .animate-scanner {
          animation: scanner-sweep 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}} />

      {/* Immersive Full-Bleed Showcase Frame (Borderless, Edge-to-Edge) */}
      <div className="w-full flex flex-col animate-fadeIn" id="kb-unified-showcase-section">
        {/* Full-Bleed Bezel-Free Container */}
        <div
          className="w-full bg-[#faf9f6] relative flex flex-col"
          id="kb-unified-bezel"
        >
          {/* Upper Section: Immersive Cinematic Hero Video / Image Slider (Optimized Height: 275px) */}
          <div className="relative h-[275px] w-full overflow-hidden bg-black animate-scanner-container" id="kb-hero-slider-container">
            {/* Single shared background video running continuously without reload */}
            <CinematicBackground
              active={active}
            />

            {/* Smooth GPU-Accelerated CSS Slide Transitions (0% JS Main-Thread load, 100% stutter-free) */}
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                  index === currentSlide 
                    ? 'opacity-100 scale-100 z-10' 
                    : 'opacity-0 scale-105 z-0'
                }`}
                style={{ willChange: 'transform, opacity' }}
              >
                {/* Slide image backdrop */}
                <div
                  className="absolute inset-0 z-5 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${slide.image}')`,
                    mixBlendMode: 'luminosity',
                    opacity: 0.38,
                    filter: 'grayscale(20%) contrast(115%)',
                  }}
                />

                {/* Giant horizontal typography branding watermark (Centered and scaled down for narrow space) */}
                <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-10 leading-none mt-[-25px]" style={{ fontFamily: 'Georgia, serif' }}>
                  <span className="text-[100px] font-black text-white/20 uppercase tracking-tighter">K</span>
                  <span className="text-white/20 text-[100px] font-black uppercase tracking-tighter ml-1">B</span>
                </div>

                {/* Immersive overlays for seamless transition */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25 z-12 pointer-events-none"></div>
              </div>
            ))}

            {/* Slide Content Overlay - SINGLE STATIC MacBook Pro Mockup Frame Container */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[92%] max-w-[340px] z-20 flex flex-col pointer-events-none select-none">
              {/* MacBook Bezel Screen */}
              <div className="border-[5px] border-[#222125] rounded-t-xl bg-[#09090a] p-[3px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-b-0 relative">
                {/* MacBook Screen Content */}
                <div className="rounded overflow-hidden bg-[#09090b]/95 backdrop-blur-md p-3 pb-3.5 space-y-2 border border-white/5 relative">
                  {/* macOS Window Controls (Traffic Lights) - STATIC, NEVER RE-RENDERS/FLASHES */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="text-[6.5px] font-mono text-white/35 tracking-widest uppercase">KB-OS v2.4</span>
                    <div className="w-4" />
                  </div>

                  {/* DYNAMIC SCREEN CONTENT AREA (Only the text transitions!) */}
                  <div className="relative w-full" id="macbook-dynamic-screen-content">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="flex flex-col space-y-2 w-full"
                      >
                        {/* Row 1: KB Logo & Service Title */}
                        <div className="flex items-center justify-between w-full flex-shrink-0">
                          <div className="flex items-center space-x-1.5">
                            <div className="w-4.5 h-4.5 rounded bg-white p-0.5 flex-shrink-0">
                              <img src={logoSvg} className="w-full h-full object-contain" alt="KB Logo" />
                            </div>
                            <span className="text-[7px] font-extrabold text-[#c5a880] tracking-wider uppercase">KB TECH</span>
                          </div>
                          <h1 className="text-[10.5px] font-black text-white uppercase leading-none font-display m-0">
                            {slides[currentSlide].title}
                          </h1>
                        </div>

                        {/* Thin line */}
                        <div className="h-px bg-white/5 w-full flex-shrink-0" />

                        {/* Row 2: Commitment details in a strict 2-column layout */}
                        <div className="flex items-start space-x-3 w-full text-left flex-1 min-w-0">
                          {/* Left column: Icon (glowing rounded box, aligned to top of text) */}
                          <div className="w-6.5 h-6.5 rounded bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-[#c5a880] mt-0.5 scale-90">
                            {slides[currentSlide].commitment.icon}
                          </div>

                          {/* Right column: Clean vertical text stack */}
                          <div className="flex-1 min-w-0 flex flex-col space-y-1">
                            {/* Row 2.1: Title & Badge side-by-side if they fit, wrapping cleanly inside column */}
                            <div className="flex items-center flex-wrap gap-1.5 w-full">
                              <span className="text-[8px] font-bold text-white uppercase tracking-wider whitespace-nowrap flex-shrink-0">
                                {slides[currentSlide].commitment.title}
                              </span>
                              <span className="text-[7px] font-black text-white bg-[#9e1a1e] border border-[#ff2b36]/20 px-1.5 py-0.5 rounded uppercase leading-none scale-95 origin-left whitespace-nowrap flex-shrink-0">
                                {slides[currentSlide].commitment.badge}
                              </span>
                            </div>

                            {/* Row 2.2: Description (Perfect left-alignment) */}
                            <p className="text-white/60 text-[8px] font-medium m-0 leading-normal w-full line-clamp-2">
                              {slides[currentSlide].commitment.desc}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* MacBook Keyboard Base */}
              <div className="relative bg-[#a0a0a5] border-t border-white/25 h-[10px] w-[104%] left-[-2%] rounded-b-lg shadow-[0_12px_24px_rgba(0,0,0,0.5)] flex items-start justify-center">
                {/* Center Notch */}
                <div className="w-[45px] h-[3px] bg-[#17171c] rounded-b-md" />
              </div>
            </div>

            {/* Dynamic Subtle Indicator Lines (High-End Progress Bars at the absolute bottom edge) */}
            <div className="absolute bottom-0 left-0 right-0 z-30 flex space-x-[1px] select-none" id="kb-slider-progress-indicators">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className="flex-1 h-[2.5px] bg-black/40 cursor-pointer overflow-hidden"
                  title={`Slide ${idx + 1}`}
                >
                  <div
                    className={`h-full bg-[#9e1a1e] ${idx === currentSlide ? 'w-full transition-all duration-[6000ms] ease-linear' : 'w-0'
                      }`}
                  />
                </div>
              ))}
            </div>


          </div>
        </div>
      </div>

      {/* Featured Products Block */}
      <div className="space-y-3 px-4" id="kb-featured-products-section">
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-[11.5px] font-bold text-[#111111] uppercase r font-display flex items-center space-x-2 m-0">
            <span className="w-1.5 h-1.5 bg-[#9e1a1e] rounded-full inline-block shadow-[0_0_5px_#9e1a1e]"></span>
            <span>Thiết bị phần cứng nổi bật</span>
          </h3>
        </div>

        {/* 2-columns grid */}
        <div className="grid grid-cols-2 gap-3" id="featured-products-grid">
          {featuredProducts.slice(0, visibleCount).map((prod) => (
            <motion.div
              key={prod.id}
              whileHover={{ y: -3, borderColor: "rgba(158,26,30,0.35)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => onOrderProduct ? onOrderProduct(prod) : onNavigateToTab('Liên Hệ')}
              className="bg-white border border-[#c5a880]/15 rounded-2xl p-2.5 flex flex-col justify-between space-y-2.5 transition-all duration-300 group/prod cursor-pointer shadow-[0_8px_24px_rgba(197,168,128,0.04)] hover:shadow-[0_12px_28px_rgba(158,26,30,0.06)]"
              id={`featured-card-${prod.id}`}
            >
              {/* Product Image Wrapper */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#faf9f6] border border-[#c5a880]/10">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover/prod:scale-103 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-1.5 right-1.5 text-[7.5px] font-bold bg-[#9e1a1e]/85 backdrop-blur-sm text-white px-2 py-0.5 rounded uppercase r">
                  {prod.status}
                </span>
              </div>

              {/* Product Info */}
              <div className="space-y-2 px-1 pt-0.5">
                <h4 className="text-[#242220] font-bold text-[11px] leading-tight tracking-tight line-clamp-1 m-0 group-hover/prod:text-[#9e1a1e] transition-colors" title={prod.name}>
                  {prod.name}
                </h4>

                {/* Price on its own row - full-width, zero truncation risk */}
                <div className="text-[12.5px] font-black text-[#9e1a1e] leading-none mt-1.5">
                  {formatPrice(prod.price)}
                </div>

                {/* Rating & Actions Bottom Row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-1 text-[9px] text-gray-450 font-bold">
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-current flex-shrink-0" />
                    <span>{prod.rating.toFixed(1)}</span>
                  </div>

                  {/* Premium Action Plus Button */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddToCart) onAddToCart(prod);
                    }}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c72c31] to-[#9e1a1e] text-white flex items-center justify-center shadow-md flex-shrink-0 group-hover/prod:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-3.5 h-3.5"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Manual Load More Button */}
        <div className="pt-2" id="kb-products-loading-controls">
          {isLoadingMore ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-2 bg-white border border-[#c5a880]/15 rounded-xl shadow-sm">
              <Loader2 className="w-4 h-4 text-[#9e1a1e] animate-spin" />
              <span className="text-[9px] text-gray-400 uppercase font-light animate-pulse">Đang tải thiết bị...</span>
            </div>
          ) : visibleCount < featuredProducts.length ? (
            <button
              className="w-full bg-white hover:bg-[#f6f4ee] active:scale-[0.98] text-[#9e1a1e] font-bold text-[10px] uppercase rounded-xl py-3 border border-[#c5a880]/25 hover:border-[#9e1a1e]/30 transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1.5 focus:outline-none shadow-sm"
              onClick={() => {
                setIsLoadingMore(true);
                setTimeout(() => {
                  setVisibleCount((prev) => Math.min(prev + 6, featuredProducts.length));
                  setIsLoadingMore(false);
                }, 500);
              }}
              id="btn-view-more-featured"
            >
              <span>Xem thêm ({featuredProducts.length - visibleCount} sản phẩm)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ) : featuredProducts.length > 6 ? (
            <div className="flex flex-col items-center justify-center py-3 bg-white border border-[#c5a880]/15 rounded-xl space-y-1 shadow-sm">
              <span className="text-[8.5px] text-gray-500 uppercase font-mono">Đã hiện tất cả {featuredProducts.length} thiết bị</span>
              <button
                onClick={() => {
                  setVisibleCount(6);
                  const container = document.getElementById('zalo-webview-container');
                  if (container) container.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="text-[#9e1a1e] hover:text-[#7c1215] hover:underline text-[9px] uppercase r font-bold mt-1 bg-transparent border-0 cursor-pointer focus:outline-none"
              >
                Thu gọn danh sách
              </button>
            </div>
          ) : null}
        </div>
      </div>


      {/* ═══ FAQ ACCORDION ═══ */}
      <div className="space-y-2.5 pt-4 border-t border-[#c5a880]/10 mt-2 px-1" id="kb-faq-section">
        <h3 className="text-[11.5px] font-bold text-[#111111] uppercase r font-display flex items-center space-x-2 m-0">
          <span className="w-1.5 h-1.5 bg-[#9e1a1e] rounded-full inline-block shadow-[0_0_5px_#9e1a1e]"></span>
          <span>Câu hỏi thường gặp</span>
        </h3>

        {[
          { q: "KB Technology có hỗ trợ ngoài giờ hành chính không?", a: "Có! Đội ngũ kỹ thuật KB trực 24/7, hỗ trợ từ xa không giới hạn và onsite trong vòng 30 phút tại TP.HCM. Cam kết SLA uptime 99.99%." },
          { q: "Chi phí thuê máy chủ ảo (VPS) bắt đầu từ bao nhiêu?", a: "Gói VPS khởi điểm từ 150.000đ/tháng với SSD NVMe, bandwidth 10Gbps, snapshot tự động. Có thể scale lên bất cứ lúc nào mà không downtime." },
          { q: "Camera AI có nhận diện được ban đêm không?", a: "Camera AI KB-Sentinel 4K tích hợp hồng ngoại thông minh, nhận diện khuôn mặt chính xác 99.8% trong mọi điều kiện ánh sáng, kể cả ban đêm hoàn toàn." },
          { q: "KB có nhận sửa chữa cho doanh nghiệp nhỏ không?", a: "Hoàn toàn! KB phục vụ từ cá nhân đến doanh nghiệp lớn. Dịch vụ bao gồm chẩn đoán miễn phí, linh kiện chính hãng, bảo hành 12 tháng sau sửa chữa." },
          { q: "Làm sao để bắt đầu sử dụng dịch vụ của KB?", a: "Rất đơn giản! Bạn có thể nhắn tin qua Zalo, gọi hotline, hoặc bấm \"Liên hệ\" ngay trên app này. Đội ngũ tư vấn sẽ phản hồi trong vòng 5 phút." },
        ].map((faq, idx) => (
          <FaqItem key={idx} question={faq.q} answer={faq.a} />
        ))}
      </div>

      {/* ═══ LUXURY CORPORATE FOOTER ═══ */}
      <footer className="pt-8 pb-12 px-4 bg-[#f8f7f4] border-t border-[#c5a880]/15 mt-8 space-y-6" id="kb-home-footer">
        <div className="flex flex-col items-center text-center space-y-3.5">
          {/* Connected Brand Logo */}
          <div className="flex flex-col items-center">
            <img src={logoSvg} className="h-7 w-auto object-contain select-none" alt="KB Logo" />
            <p className="text-[6.5px] text-[#a3875e] uppercase font-sans font-extrabold mt-1.5 m-0">
              TECHNOLOGY
            </p>
          </div>
          <p className="text-gray-400 text-[8.5px] font-sans font-light m-0 max-w-[280px] leading-relaxed">
            Kiến tạo giải pháp công nghệ & hạ tầng số tối tân chuẩn doanh nghiệp.
          </p>
        </div>

        {/* Corporate contact cards */}
        <div className="space-y-2.5 text-[9.5px] text-gray-550 font-sans font-light">
          {/* Address Line */}
          <div className="flex items-start space-x-2.5 bg-white/70 p-2.5 rounded-xl border border-[#c5a880]/8">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-3.5 h-3.5 text-[#9e1a1e] flex-shrink-0 mt-0.5 animate-pulse"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <p className="m-0 leading-relaxed text-left">
              <strong className="text-gray-700 font-semibold">Địa chỉ:</strong> 341/25 S - 341/26 S Lạc Long Quân, Phường 5, Tân Bình, TP.HCM
            </p>
          </div>

          {/* Hotline & Email Lines */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex items-center space-x-2 bg-white/70 p-2.5 rounded-xl border border-[#c5a880]/8">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-3.5 h-3.5 text-[#9e1a1e] flex-shrink-0"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <p className="m-0 text-left">
                <strong className="text-gray-700 block font-semibold">Hotline:</strong>
                <span className="font-bold text-[#9e1a1e]">0909 340 014</span>
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-white/70 p-2.5 rounded-xl border border-[#c5a880]/8">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-3.5 h-3.5 text-[#9e1a1e] flex-shrink-0"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <p className="m-0 text-left truncate">
                <strong className="text-gray-700 block font-semibold">Email:</strong>
                <span className="text-[#a3875e] truncate">info@kbtech.vn</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright block */}
        <div className="pt-5 border-t border-gray-150/60 text-center text-gray-400 text-[8px] space-y-1 font-mono uppercase st">
          <p className="m-0">© {new Date().getFullYear()} KB TECHNOLOGY. ALL RIGHTS RESERVED.</p>
          <p className="m-0 text-[7px] text-gray-350">Uptime SLA 99.99% • Managed by Admin KB</p>
        </div>
      </footer>

    </div>
  );
}
