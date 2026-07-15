import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  Mail, 
  Clock, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  History, 
  Trash2,
  Heart
} from 'lucide-react';
import { ZALO_RECEIVER_PHONE, ZALO_OA_ID } from '../config/zaloConfig';
import { mockProducts } from '../api/inventory';

export default function ContactPage({ prefilledService, prefilledProduct, onClearPrefills, zaloUser }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    serviceType: '',
    productType: '',
    notes: ''
  });
  
  const [history, setHistory] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Service list for dropdown
  const servicesList = [
    "Mua bán sản phẩm",
    "Đăng ký máy chủ ảo hoá",
    "Bảo mật hệ thống",
    "Lưu trữ & backup",
    "Email doanh nghiệp",
    "Sửa chữa máy tính",
    "IT HelpDesk",
    "Camera AI",
    "Build Workstation",
    "Viết phần mềm ERP",
    "Đi hạ tầng mạng"
  ];

  const productsList = [
    "Không mua (Chỉ đăng ký dịch vụ)",
    "KB Workstation Ultimate X1 (45.990.000 đ)",
    "Camera AI KB-Sentinel 4K (8.500.000 đ)",
    "Router Mikrotik RB5009UG+S+IN (7.200.000 đ)",
    "Firewall Fortinet FortiGate 40F (16.500.000 đ)",
    "UPS CyberPower 1500VA (5.400.000 đ)",
    "Server Rack KB-Host R1 Enterprise (32.500.000 đ)",
    "Switch Cisco CBS250-24T-4G (9.800.000 đ)",
    "SSD Enterprise PM893 1.92TB (6.700.000 đ)",
    "Access Point Aruba Instant On AP22 (3.600.000 đ)",
    "NAS Synology DS224+ 2-Bay (9.200.000 đ)"
  ];

  // Prefill handler
  useEffect(() => {
    if (prefilledService) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || (zaloUser?.name !== 'Khách' ? zaloUser?.name || '' : ''),
        phoneNumber: prev.phoneNumber || zaloUser?.phone || '',
        serviceType: prefilledService,
        productType: 'Không mua (Chỉ đăng ký dịch vụ)',
        notes: `Tôi cần tư vấn chuyên sâu về dịch vụ: ${prefilledService}`
      }));
    } else if (prefilledProduct) {
      const match = productsList.find(p => p.toLowerCase().includes(prefilledProduct.name.toLowerCase())) || productsList[1];
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || (zaloUser?.name !== 'Khách' ? zaloUser?.name || '' : ''),
        phoneNumber: prev.phoneNumber || zaloUser?.phone || '',
        serviceType: prefilledProduct.category || "Đi hạ tầng mạng",
        productType: match,
        notes: prefilledProduct.notes || `Tôi muốn đặt mua sản phẩm: ${prefilledProduct.name} (Mã: ${prefilledProduct.id})`
      }));
    } else if (zaloUser?.name && zaloUser.name !== 'Khách') {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || zaloUser.name,
        phoneNumber: prev.phoneNumber || zaloUser.phone || ''
      }));
    }
  }, [prefilledService, prefilledProduct, zaloUser]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('kb_contact_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Quick basic validation
    if (!formData.fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên.');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setErrorMsg('Vui lòng nhập Số điện thoại.');
      return;
    }
    if (!formData.serviceType) {
      setErrorMsg('Vui lòng lựa chọn Dịch vụ cần tư vấn.');
      return;
    }

    // Submit payload
    const newRequest = {
      id: "req-" + Date.now(),
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      serviceType: formData.serviceType,
      productType: formData.productType || "Không mua (Chỉ đăng ký dịch vụ)",
      notes: formData.notes.trim() || "Không có yêu cầu đặc biệt khác",
      createdAt: new Date().toLocaleString('vi-VN'),
      status: "Chờ ADMIN KB duyệt"
    };

    const updatedHistory = [newRequest, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('kb_contact_history', JSON.stringify(updatedHistory));
    
    setIsSubmitted(true);
    onClearPrefills(); // Clear prefilled state after successful submit

    // Distinguish between service and product order formats
    const isProductPurchase = newRequest.serviceType === "Mua bán sản phẩm";
    let clipboardText = "";

    if (isProductPurchase) {
      // Try to find the matching mockProduct details for image and price
      const selectedProd = mockProducts.find(p => 
        newRequest.productType.toLowerCase().includes(p.name.toLowerCase())
      );
      
      const prodName = selectedProd ? selectedProd.name : newRequest.productType;
      const prodPrice = selectedProd 
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProd.price)
        : "Liên hệ báo giá";
      const prodImage = selectedProd ? selectedProd.image : "";

      clipboardText = `[ĐƠN HÀNG MUA BÁN - KB TECHNOLOGY]\n` +
        `-----------------------------------------\n` +
        `- Khách hàng: ${newRequest.fullName}\n` +
        `- Số điện thoại: ${newRequest.phoneNumber}\n` +
        `- Thiết bị chọn mua: ${prodName}\n` +
        `- Đơn giá niêm yết: ${prodPrice}\n` +
        (prodImage ? `- Hình ảnh tham chiếu: ${prodImage}\n` : "") +
        `- Ghi chú đặt hàng: ${newRequest.notes}\n` +
        `-----------------------------------------\n` +
        `Gửi từ Zalo Mini App KB Technology.`;
    } else {
      // Service request format
      clipboardText = `[YÊU CẦU DỊCH VỤ - KB TECHNOLOGY]\n` +
        `-----------------------------------------\n` +
        `- Khách hàng: ${newRequest.fullName}\n` +
        `- Số điện thoại: ${newRequest.phoneNumber}\n` +
        `- Dịch vụ yêu cầu: ${newRequest.serviceType}\n` +
        `- Ghi chú chi tiết: ${newRequest.notes}\n` +
        `-----------------------------------------\n` +
        `Gửi từ Zalo Mini App KB Technology.`;
    }

    // Function to launch Zalo redirect
    const redirectToZalo = async () => {
      try {
        const { openWebview } = await import('zmp-sdk/apis');
        await openWebview({ url: `https://zalo.me/${ZALO_RECEIVER_PHONE}` });
      } catch (_) {
        window.location.href = `https://zalo.me/${ZALO_RECEIVER_PHONE}`;
      }
    };

    // Copy to clipboard & trigger redirection
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(clipboardText)
        .then(() => redirectToZalo())
        .catch(() => redirectToZalo());
    } else {
      redirectToZalo();
    }

    // Reset form fields
    setFormData({
      fullName: '',
      phoneNumber: '',
      serviceType: '',
      productType: '',
      notes: ''
    });
  };

  const clearHistory = () => {
    localStorage.removeItem('kb_contact_history');
    setHistory([]);
  };

  const handleFollowOA = async () => {
    try {
      const { followOA } = await import('zmp-sdk/apis');
      followOA({
        id: ZALO_OA_ID,
        success: (res) => {
          console.log("Follow OA Success:", res);
        },
        fail: (err) => {
          console.error("Follow OA Failed:", err);
        }
      });
    } catch (e) {
      console.warn("followOA not supported in browser environment.");
      alert(`Đang mô phỏng yêu cầu Quan tâm Zalo OA với ID: ${ZALO_OA_ID}`);
    }
  };

  return (
    <div className="space-y-4 pt-3.5 px-3.5 pb-6 animate-fadeIn" id="kb-contact-page">
      {/* Header */}
      <div className="space-y-1.5 px-1 pb-1">
        <h1 className="text-[13px] font-light text-[#242220] uppercase font-display flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 bg-[#9e1a1e] rounded-full inline-block shadow-[0_0_6px_#9e1a1e]"></span>
          <span>Liên hệ Kỹ thuật viên</span>
        </h1>
        <p className="text-[9.5px] text-gray-555 font-sans font-light">
          Gửi yêu cầu trực tiếp đến quản trị viên KB để nhận tư vấn thiết kế tối ưu nhất.
        </p>
      </div>

      {/* Follow Zalo OA Call-to-Action Card */}
      <div className="bg-gradient-to-br from-[#1c1a21] to-[#121115] border border-[#c5a880]/20 rounded-xl p-3 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
        <div className="space-y-0.5 text-left flex-1 min-w-0 pr-3">
          <h4 className="text-[10px] font-extrabold text-[#c5a880] uppercase tracking-wider m-0 flex items-center space-x-1">
            <Heart className="w-3 h-3 text-[#c5a880] fill-current" />
            <span>Quan tâm Zalo OA</span>
          </h4>
          <p className="text-[8px] text-white/60 leading-normal m-0">Nhận thông báo phản hồi, hóa đơn điện tử & hỗ trợ kỹ thuật nhanh nhất.</p>
        </div>
        <button
          type="button"
          onClick={handleFollowOA}
          className="px-3 py-1.5 bg-gradient-to-r from-[#c5a880] to-[#b4956d] hover:from-[#b4956d] hover:to-[#a3835c] text-black text-[7.5px] font-black uppercase rounded-lg shadow-[0_0_8px_rgba(197,168,128,0.3)] active:scale-95 transition-all cursor-pointer border-none"
        >
          Quan tâm
        </button>
      </div>

      {/* Main Form Area */}
      {isSubmitted ? (
        <div 
          className="bg-white border border-[#9e1a1e]/30 rounded-2xl p-5 text-center space-y-3 shadow-[0_12px_35px_rgba(197,168,128,0.06)] animate-scaleUp"
          id="contact-success-banner"
        >
          <div className="mx-auto w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 animate-bounce" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-[#242220] font-light text-[12px] uppercase r font-display">Gửi Yêu Cầu Thành Công</h3>
            <p className="text-gray-500 text-[10px] leading-relaxed font-sans font-light">
              Yêu cầu của bạn đã được chuyển đến <span className="font-bold text-[#9e1a1e]">ADMIN KB</span>. Chúng tôi sẽ thiết kế giải pháp và phản hồi trong vòng <span className="text-[#242220] font-bold">15 phút</span>.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsSubmitted(false)}
            className="px-4 py-2 bg-[#f6f5f0] hover:bg-[#9e1a1e] hover:text-white border border-[#c5a880]/20 text-[9px] text-gray-700 font-bold uppercase r rounded-lg transition-all cursor-pointer focus:outline-none"
          >
            Gửi yêu cầu mới
          </motion.button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#c5a880]/15 rounded-2xl p-4.5 space-y-3.5 shadow-[0_8px_24px_rgba(197,168,128,0.04)]" id="contact-form">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[10px] py-2 px-3 rounded-lg font-bold">
              {errorMsg}
            </div>
          )}

          {/* Full Name Input */}
          <div className="space-y-1">
            <label className="text-[8.5px] font-bold text-[#5a462b] uppercase st block font-display">Họ và Tên *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full bg-[#faf9f6] border border-[#c5a880]/20 focus:border-[#9e1a1e] focus:ring-1 focus:ring-[#9e1a1e]/20 focus:outline-none rounded-xl py-2.5 px-3.5 text-[11px] text-[#242220] placeholder-gray-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all"
            />
          </div>

          {/* Phone Number Input */}
          <div className="space-y-1">
            <label className="text-[8.5px] font-bold text-[#5a462b] uppercase st block font-display">Số điện thoại di động *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Ví dụ: 0912345678"
              className="w-full bg-[#faf9f6] border border-[#c5a880]/20 focus:border-[#9e1a1e] focus:ring-1 focus:ring-[#9e1a1e]/20 focus:outline-none rounded-xl py-2.5 px-3.5 text-[11px] text-[#242220] placeholder-gray-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all"
            />
          </div>

          {/* Service Dropdown Selector */}
          <div className="space-y-1">
            <label className="text-[8.5px] font-bold text-[#5a462b] uppercase st block font-display">Dịch vụ cần hỗ trợ *</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full bg-[#faf9f6] border border-[#c5a880]/20 focus:border-[#9e1a1e] focus:ring-1 focus:ring-[#9e1a1e]/20 focus:outline-none rounded-xl py-2.5 px-3.5 text-[11px] text-[#242220] placeholder-gray-400 transition-all cursor-pointer"
            >
              <option value="" className="text-gray-400">-- Chọn nhóm giải pháp --</option>
              {servicesList.map((srv, idx) => (
                <option key={idx} value={srv} className="text-[#242220]">{srv}</option>
              ))}
            </select>
          </div>

          {/* Product Dropdown Selector */}
          <div className="space-y-1">
            <label className="text-[8.5px] font-bold text-[#5a462b] uppercase st block font-display">Sản phẩm cần mua *</label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="w-full bg-[#faf9f6] border border-[#c5a880]/20 focus:border-[#9e1a1e] focus:ring-1 focus:ring-[#9e1a1e]/20 focus:outline-none rounded-xl py-2.5 px-3.5 text-[11px] text-[#242220] placeholder-gray-400 transition-all cursor-pointer"
            >
              <option value="" className="text-gray-400">-- Chọn sản phẩm (nếu có) --</option>
              {productsList.map((prod, idx) => (
                <option key={idx} value={prod} className="text-[#242220]">{prod}</option>
              ))}
            </select>
          </div>

          {/* Notes Textarea */}
          <div className="space-y-1">
            <label className="text-[8.5px] font-bold text-[#5a462b] uppercase st block font-display">Mô tả nhu cầu / Ghi chú chi tiết</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2.5}
              placeholder="Vui lòng mô tả quy mô hoặc nhu cầu cụ thể của bạn..."
              className="w-full bg-[#faf9f6] border border-[#c5a880]/20 focus:border-[#9e1a1e] focus:ring-1 focus:ring-[#9e1a1e]/20 focus:outline-none rounded-xl py-2.5 px-3.5 text-[11px] text-[#242220] placeholder-gray-400 transition-all resize-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-[#cf2e2e] to-[#9e1a1e] text-white font-bold text-[9.5px] uppercase r rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-[#9e1a1e]/15 border-0 focus:outline-none"
            id="btn-submit-contact"
          >
            <Send className="w-3 h-3 text-white/90" />
            <span className="whitespace-nowrap">Gửi thông tin yêu cầu</span>
          </motion.button>
        </form>
      )}

      {/* Official Contact Details block */}
      <section className="bg-white border border-[#c5a880]/15 rounded-2xl p-3.5 space-y-4 shadow-[0_8px_24px_rgba(197,168,128,0.04)]" id="kb-channels-info">
        <h3 className="text-[#242220] font-light font-display text-[9.5px] uppercase st flex items-center space-x-1.5 pb-1 border-b border-gray-100">
          <span className="w-1 h-3 bg-[#9e1a1e] rounded-sm"></span>
          <span>Thông tin liên hệ chính thức KB</span>
        </h3>

        <div className="space-y-4">
          {/* Main Office */}
          <div className="space-y-2 bg-[#fcfbfa] border border-[#c5a880]/12 rounded-xl p-3">
            <h4 className="text-[10px] text-[#9e1a1e] font-bold uppercase r flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Văn phòng giao dịch (Trụ sở chính)</span>
            </h4>
            <div className="space-y-1 text-[10px] text-gray-500 pl-5">
              <p className="leading-relaxed"><strong className="text-gray-650">Địa chỉ:</strong> 341/25 S - 341/26 S Lạc Long Quân, Phường Hoà Bình, Quận 11, TP.HCM</p>
              <p><strong className="text-gray-650">Hotline:</strong> 0933 129 155 (Zalo)</p>
              <p><strong className="text-gray-650">Email:</strong> info@kbtech.vn</p>
            </div>
          </div>

          {/* Technical Department */}
          <div className="space-y-2 bg-[#fcfbfa] border border-[#c5a880]/12 rounded-xl p-3">
            <h4 className="text-[10px] text-[#9e1a1e] font-bold uppercase r flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Phòng kỹ thuật</span>
            </h4>
            <div className="space-y-1 text-[10px] text-gray-500 pl-5">
              <p className="leading-relaxed"><strong className="text-gray-650">Địa chỉ:</strong> 21 đường số 7, Phường Bình Thới, Cư xá Bình Thới, Quận 11, TP.HCM</p>
              <p><strong className="text-gray-650">Tổng đài KT:</strong> 0909 340 014</p>
              <p><strong className="text-gray-650">Email KT:</strong> technical@kbtech.vn</p>
            </div>
          </div>

          {/* Admin Responsible */}
          <div className="flex items-start space-x-3 text-[10.5px] text-gray-600 px-1 pt-1">
            <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <span className="font-semibold text-[#242220] block text-[11px]">Đại diện quản trị hệ thống</span>
              <span className="text-gray-550 text-[10px]">Chuyên viên cấp cao: <span className="font-bold text-[#9e1a1e]">ADMIN KB</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Request History Section (From localStorage) */}
      {history.length > 0 && (
        <section className="bg-white border border-[#c5a880]/15 rounded-2xl p-3.5 space-y-3 shadow-[0_8px_24px_rgba(197,168,128,0.04)]" id="kb-request-history">
          <div className="flex items-center justify-between">
            <h3 className="text-[#242220] font-light font-display text-[9.5px] uppercase st flex items-center space-x-1.5">
              <History className="w-3.5 h-3.5 text-gray-500" />
              <span>Lịch sử yêu cầu ({history.length})</span>
            </h3>
            <button
              onClick={clearHistory}
              className="text-[9px] text-gray-500 hover:text-[#9e1a1e] flex items-center space-x-1 cursor-pointer bg-transparent border-0 focus:outline-none"
            >
              <Trash2 className="w-3 h-3" />
              <span>Xóa lịch sử</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1" id="history-list">
            {history.map((req) => (
              <motion.div 
                key={req.id} 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="p-3 bg-[#faf9f6] border border-[#c5a880]/15 rounded-xl space-y-1.5 hover:border-[#9e1a1e]/25 transition-colors"
                id={`history-item-${req.id}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[#242220] font-semibold text-[10.5px] line-clamp-1">{req.serviceType}</span>
                  <span className="text-[7.5px] font-bold text-[#9e1a1e] bg-[#9e1a1e]/8 px-1.5 py-0.5 rounded border border-[#9e1a1e]/15 uppercase">
                    {req.status}
                  </span>
                </div>
                <p className="text-gray-500 text-[9.5px] line-clamp-2 leading-relaxed italic font-light">
                  "{req.notes}"
                </p>
                <div className="flex items-center justify-between text-[7.5px] text-gray-500">
                  <span>Khách: {req.fullName}</span>
                  <span>{req.createdAt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
