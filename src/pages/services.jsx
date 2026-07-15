import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, 
  ShieldCheck, 
  Database, 
  Mail, 
  Wrench, 
  Headphones, 
  Eye, 
  Cpu, 
  FileCode, 
  CheckCircle2, 
  ChevronRight, 
  X 
} from 'lucide-react';

export default function ServicesPage({ onRegisterService, onOpenServiceDetail }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Exactly 10 required services with rich content
  const services = [
    {
      id: "srv-01",
      name: "Đăng ký máy chủ ảo hoá",
      icon: <Server className="w-5 h-5 text-[#e50914]" />,
      shortDesc: "Thuê Cloud Server/VPS hiệu năng cao, băng thông không giới hạn.",
      longDesc: "Giải pháp máy chủ ảo hóa (VPS/Cloud Server) tối tân, sử dụng 100% ổ cứng NVMe Enterprise siêu tốc. Hệ thống tài nguyên độc lập, uptime cam kết 99.9%, hỗ trợ cài đặt các hệ điều hành Linux/Windows tự động.",
      features: ["Sử dụng vi xử lý AMD EPYC thế hệ mới", "Băng thông trong nước lên tới 10Gbps", "Sao lưu snapshot tự động định kỳ", "Hỗ trợ kỹ thuật 24/7 từ ADMIN KB"],
      priceRange: "Từ 150.000đ / tháng"
    },
    {
      id: "srv-02",
      name: "Bảo mật hệ thống",
      icon: <ShieldCheck className="w-5 h-5 text-[#e50914]" />,
      shortDesc: "Đánh giá lỗ hổng, thiết lập tường lửa cứng bảo vệ dữ liệu.",
      longDesc: "Bảo mật toàn diện hệ thống thông tin doanh nghiệp. Thiết lập tường lửa (Fortinet, Sophos), giám sát mã độc thời gian thực, quét và vá lỗ hổng bảo mật hệ thống web/chủ và đào tạo nhận thức an toàn thông tin.",
      features: ["Thiết lập tường lửa đa tầng cứng", "Chống tấn công DDoS chuyên sâu", "Audit an toàn thông tin toàn diện", "Kiểm soát truy cập bởi ADMIN KB"],
      priceRange: "Từ 5.000.000đ / hệ thống"
    },
    {
      id: "srv-03",
      name: "Lưu trữ & backup",
      icon: <Database className="w-5 h-5 text-[#e50914]" />,
      shortDesc: "Lưu trữ đám mây bảo mật cao, backup tự động chống ransomware.",
      longDesc: "Giải pháp lưu trữ tập trung dữ liệu doanh nghiệp lớn (NAS/SAN/Cloud Storage) và thiết lập cơ chế sao lưu dự phòng tự động theo mô hình 3-2-1 giúp bảo vệ tuyệt đối trước virus mã hóa dữ liệu.",
      features: ["Lưu trữ đám mây bảo mật đầu-cuối", "Backup tự động hàng giờ/ngày", "Phục hồi dữ liệu siêu tốc khi có sự cố", "Lưu trữ mã hóa chuẩn AES-256"],
      priceRange: "Từ 450.000đ / tháng"
    },
    {
      id: "srv-04",
      name: "Email doanh nghiệp",
      icon: <Mail className="w-5 h-5 text-[#e50914]" />,
      shortDesc: "Hệ thống email theo tên miền riêng, chống spam 99.9%.",
      longDesc: "Hệ thống Email chuyên nghiệp theo đuôi tên miền công ty (ví dụ: admin@kb.vn). Tích hợp bộ lọc thư rác thông minh AI, đồng bộ danh bạ lịch làm việc trên mọi thiết bị di động và Outlook.",
      features: ["Dung lượng hộp thư lớn, không giới hạn alias", "Bộ lọc spam và mã độc thông minh", "Tỷ lệ gửi email vào Inbox 99.9%", "Hỗ trợ kỹ thuật trực tiếp"],
      priceRange: "Từ 25.000đ / user / tháng"
    },
    {
      id: "srv-05",
      name: "Sửa chữa máy tính",
      icon: <Wrench className="w-5 h-5 text-[#e50914]" />,
      shortDesc: "Khắc phục sự cố phần cứng, nâng cấp máy tính văn phòng.",
      longDesc: "Dịch vụ chẩn đoán, sửa chữa linh kiện phần cứng, thay thế màn hình, bàn phím, nâng cấp ổ cứng SSD tăng tốc máy tính văn phòng, Laptop, iMac/Macbook tận nơi nhanh chóng.",
      features: ["Linh kiện thay thế chính hãng 100%", "Bảo hành dài hạn lên tới 12 tháng", "Kỹ thuật viên tay nghề cao", "Kiểm định chất lượng bởi ADMIN KB"],
      priceRange: "Báo giá theo lỗi thực tế"
    },
    {
      id: "srv-06",
      name: "IT HelpDesk",
      icon: <Headphones className="w-5 h-5 text-[#e50914]" />,
      shortDesc: "Hỗ trợ xử lý sự cố CNTT từ xa và onsite định kỳ.",
      longDesc: "Ủy thác quản trị IT cho toàn bộ doanh nghiệp. Đội ngũ kỹ thuật hỗ trợ khắc phục nhanh mọi lỗi phần mềm, máy in, mạng wifi, virus máy tính qua UltraViewer/TeamViewer hoặc có mặt xử lý trực tiếp.",
      features: ["Có mặt onsite trong vòng 30 - 60 phút", "Hỗ trợ từ xa không giới hạn cuộc gọi", "Báo cáo chi tiết sự cố hàng tháng", "Quản lý hệ thống bởi đội ngũ chuyên nghiệp"],
      priceRange: "Từ 1.200.000đ / tháng"
    },
    {
      id: "srv-07",
      name: "Camera AI",
      icon: <Eye className="w-5 h-5 text-[#e50914]" />,
      shortDesc: "Hệ thống camera nhận diện thông minh, cảnh báo tự động.",
      longDesc: "Lắp đặt và tích hợp trí tuệ nhân tạo (AI) vào camera giám sát văn phòng, nhà xưởng. Hỗ trợ điểm danh chấm công tự động, phân tích hành vi khách hàng và cảnh báo trộm đột nhập ngay lập tức.",
      features: ["Nhận diện khuôn mặt chính xác 99.8%", "Tự động gửi thông báo qua Zalo/Telegram", "Vẽ vùng ảo cảnh báo xâm nhập", "Hệ thống vận hành an toàn bảo mật"],
      priceRange: "Từ 3.500.000đ / mắt camera"
    },
    {
      id: "srv-08",
      name: "Build Workstation",
      icon: <Cpu className="w-5 h-5 text-[#e50914]" />,
      shortDesc: "Tư vấn thiết kế máy trạm render, nghiên cứu AI chuyên sâu.",
      longDesc: "Tư vấn cấu hình và lắp ráp thủ công các dòng máy tính đồ họa chuyên sâu Workstation, máy chủ AI đa card đồ họa. Đảm bảo hiệu năng ổn định tối đa dưới cường độ làm việc 100% liên tục.",
      features: ["Tối ưu hóa linh kiện chuẩn ECC chống crash", "Tản nhiệt nước chuyên dụng siêu mát", "Đi dây nghệ thuật, luồng khí tối ưu", "ADMIN KB trực tiếp test stress 24 giờ"],
      priceRange: "Từ 25.000.000đ / bộ"
    },
    {
      id: "srv-09",
      name: "Viết phần mềm ERP",
      icon: <FileCode className="w-5 h-5 text-[#e50914]" />,
      shortDesc: "Thiết kế phần mềm quản lý doanh nghiệp chuyên biệt theo yêu cầu.",
      longDesc: "Thiết kế và phát triển các phân hệ quản lý doanh nghiệp ERP (Mua hàng, Bán hàng, Kho vận, Kế toán, Nhân sự CRM) may đo chuẩn xác theo quy trình vận hành thực tế của từng đơn vị.",
      features: ["Giao diện trực quan, tối ưu trên điện thoại", "Khả năng mở rộng không giới hạn", "Bảo mật phân quyền dữ liệu chi tiết", "Độc quyền sở hữu mã nguồn hoàn toàn"],
      priceRange: "Báo giá thiết kế riêng"
    },
    {
      id: "srv-10",
      name: "Đi hạ tầng mạng điện",
      icon: <Wrench className="w-5 h-5 text-[#e50914]" />,
      shortDesc: "Thi công lắp đặt kéo cáp mạng, điện nhẹ văn phòng và nhà xưởng.",
      longDesc: "Dịch vụ khảo sát, tư vấn thiết kế và thi công kéo cáp mạng LAN, lắp đặt tủ Rack, patch panel, hệ thống nguồn điện dự phòng UPS và mạng điện nhẹ văn phòng, căn hộ cao cấp và nhà xưởng sản xuất.",
      features: ["Thi công thẩm mỹ cao, đi ống ghen bảo vệ gọn gàng", "Đo kiểm kiểm định tín hiệu cáp mạng Fluke Test chuyên dụng", "Bảo hành hạ tầng kỹ thuật kéo cáp lên tới 24 tháng", "Quản lý chất lượng thi công giám sát trực tiếp bởi ADMIN KB"],
      priceRange: "Dự toán theo thực tế"
    }
  ];

  const filteredServices = useMemo(() => {
    return services.filter(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="space-y-4 pt-3.5 px-3.5 pb-6 animate-fadeIn" id="kb-services-page">
      {/* Search and Header */}
      <div className="space-y-1.5 px-1 pb-1">
        <h1 className="text-[13.5px] font-bold text-[#242220] uppercase st font-display flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 bg-[#e50914] rounded-full inline-block shadow-[0_0_6px_#e50914]"></span>
          <span>Giải pháp dịch vụ</span>
        </h1>
        <p className="text-[11px] text-gray-600 font-sans font-medium leading-relaxed">
          KB thiết kế và triển khai 10 nhóm giải pháp hạ tầng CNTT tối ưu, cam kết SLA vận hành vượt trội.
        </p>
        
        {/* Simple Input Search */}
        <div className="relative pt-1.5" id="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm dịch vụ..."
            className="w-full bg-white border border-[#c5a880]/20 focus:border-[#e50914]/40 focus:outline-none rounded-xl py-2 px-3.5 text-xs text-[#242220] placeholder-gray-450 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 translate-y-[-10%] text-gray-400 hover:text-black cursor-pointer border-none bg-transparent"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Services Grid 2-cols */}
      <div className="grid grid-cols-2 gap-3 px-1" id="services-grid">
        {filteredServices.map((srv) => (
          <motion.div
            key={srv.id}
            whileHover={{ y: -2, borderColor: "rgba(229,9,20,0.25)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => onOpenServiceDetail ? onOpenServiceDetail(srv) : onRegisterService(srv.name)}
            className="bg-white border border-[#c5a880]/15 rounded-xl p-2.5 flex flex-col justify-between space-y-3 cursor-pointer transition-all duration-200 group shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            id={`service-card-${srv.id}`}
          >
            <div className="flex justify-between items-start">
              <div className="p-1.5 bg-gray-50 rounded-lg border border-[#c5a880]/15 group-hover:border-[#e50914]/30 transition-colors">
                {srv.icon}
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#e50914] transition-colors" />
            </div>
            
            <div className="space-y-1 text-left">
              <h3 className="text-[#242220] font-bold text-[11px] leading-snug min-h-[30px] line-clamp-2">
                {srv.name}
              </h3>
              <p className="text-[9.5px] text-gray-600 font-medium line-clamp-2 leading-relaxed">
                {srv.shortDesc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-[#c5a880]/20 text-gray-400 text-xs mx-1">
          Không tìm thấy dịch vụ nào phù hợp với từ khóa của bạn.
        </div>
      )}

    </div>
  );
}
