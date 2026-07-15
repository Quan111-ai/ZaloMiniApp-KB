export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  images?: string[]; // Array of images for carousel slider
  description: string;
  specs: string[];
  stock: number;
  rating: number; // Rating field (out of 5 stars)
  managedBy: string; // Will strictly be "ADMIN KB"
  brand?: string;
  warranty?: string;
  origin?: string;
  condition?: string;
}

export const mockProducts: Product[] = [
  {
    id: "kb-ws-01",
    name: "KB Workstation Ultimate X1",
    category: "Workstation",
    price: 45990000,
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Máy trạm tối ưu hóa cho AI Deep Learning, thiết kế 3D phức tạp và dựng phim 8K chuyên nghiệp.",
    specs: [
      "CPU Intel Xeon Gold 24 Cores / 48 Threads",
      "RAM 128GB ECC DDR5 Bus 4800MHz",
      "VGA NVIDIA RTX A4500 20GB GDDR6",
      "SSD 2TB NVMe PCIe Gen4 Enterprise"
    ],
    stock: 5,
    rating: 5.0,
    managedBy: "ADMIN KB",
    brand: "KB Tech",
    warranty: "36 tháng",
    origin: "Chính hãng Việt Nam",
    condition: "Mới 100% Nguyên Seal"
  },
  {
    id: "kb-cam-02",
    name: "Camera AI KB-Sentinel 4K",
    category: "Camera AI",
    price: 8500000,
    image: "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Camera giám sát thông minh tích hợp vi xử lý AI Edge, tự động nhận diện khuôn mặt, đếm người và cảnh báo xâm nhập thời gian thực.",
    specs: [
      "Cảm biến Sony Starvis 4K Ultra HD",
      "Ống kính Motorized Zoom 2.7-13.5mm",
      "Vi xử lý AI tích hợp 4 TOPS NPU",
      "Hồng ngoại thông minh tầm xa 50m"
    ],
    stock: 12,
    rating: 4.9,
    managedBy: "ADMIN KB",
    brand: "KB Secure",
    warranty: "24 tháng",
    origin: "Chính hãng Nhật Bản",
    condition: "Mới 100% Nguyên Hộp"
  },
  {
    id: "kb-router-03",
    name: "Router Mikrotik RB5009UG+S+IN",
    category: "Network Devices",
    price: 7200000,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Thiết bị định tuyến tải cao chuyên dụng cho doanh nghiệp, quán game, văn phòng quy mô lớn với khả năng bảo mật cấp độ ISP.",
    specs: [
      "CPU Quad-core 1.4 GHz ARM 64bit",
      "1x 10G SFP+ port, 1x 2.5G Ethernet, 7x Gigabit Ethernet",
      "RAM 1GB DDR4, Storage 1GB NAND",
      "Hệ điều hành RouterOS v7 bản quyền"
    ],
    stock: 8,
    rating: 4.8,
    managedBy: "ADMIN KB",
    brand: "MikroTik",
    warranty: "12 tháng",
    origin: "Chính hãng Latvia",
    condition: "Mới 100% Nguyên Seal"
  },
  {
    id: "kb-ups-04",
    name: "Bộ Lưu Điện UPS CyberPower 1500VA",
    category: "Power Solutions",
    price: 5400000,
    image: "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Giải pháp bảo vệ nguồn điện tối ưu cho phòng server và máy trạm KB Workstation, chống xung sét và duy trì dòng điện ổn định.",
    specs: [
      "Công suất 1500VA / 900W",
      "Công nghệ GreenPower UPS tiết kiệm điện",
      "Màn hình LCD hiển thị trạng thái chi tiết",
      "Hỗ trợ cổng USB quản trị thông minh"
    ],
    stock: 15,
    rating: 4.7,
    managedBy: "ADMIN KB",
    brand: "CyberPower",
    warranty: "24 tháng",
    origin: "Chính hãng Mỹ",
    condition: "Mới 100% Nguyên Hộp"
  },
  {
    id: "kb-fw-05",
    name: "Firewall Fortinet FortiGate 40F",
    category: "Security Systems",
    price: 16500000,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Tường lửa phần cứng thế hệ mới (NGFW), mang lại khả năng bảo mật mạng toàn diện, lọc ứng dụng và phòng chống xâm nhập ưu việt.",
    specs: [
      "Thông lượng tường lửa 5 Gbps",
      "Hỗ trợ tối đa 200.000 phiên đồng thời",
      "Tích hợp chip bảo mật chuyên dụng SPU SoC4",
      "Quản lý tập trung qua FortiCloud"
    ],
    stock: 4,
    rating: 4.9,
    managedBy: "ADMIN KB",
    brand: "Fortinet",
    warranty: "36 tháng",
    origin: "Chính hãng USA",
    condition: "Mới 100% Nguyên Seal"
  },
  {
    id: "kb-srv-06",
    name: "Server Rack KB-Host R1 Enterprise",
    category: "Servers",
    price: 32500000,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Máy chủ rackmount 1U tối ưu hóa cho doanh nghiệp chạy ảo hóa, lưu trữ dữ liệu tập trung hoặc chạy cơ sở dữ liệu ERP nội bộ.",
    specs: [
      "CPU Intel Xeon Silver 12 Cores",
      "RAM 64GB DDR4 ECC Registered",
      "Hỗ trợ 4 khay ổ cứng Hot-swap SAS/SATA",
      "Nguồn kép dự phòng 550W Hot-plug Redundant"
    ],
    stock: 3,
    rating: 5.0,
    managedBy: "ADMIN KB",
    brand: "Dell/KB Tech",
    warranty: "36 tháng",
    origin: "Chính hãng Malaysia",
    condition: "Mới 100% Nguyên Hộp"
  },
  {
    id: "kb-sw-07",
    name: "Switch Cisco CBS250-24T-4G",
    category: "Network Devices",
    price: 9800000,
    image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Thiết bị chuyển mạch Switch Layer 2 thông minh, lý tưởng cho việc kết nối hệ thống máy tính và camera tốc độ cao ổn định.",
    specs: [
      "24 cổng Gigabit Ethernet 10/100/1000",
      "4 cổng SFP 1G uplink",
      "Bảo mật nâng cao với Access Control List (ACL)",
      "Giao diện quản lý Web GUI trực quan, hiện đại"
    ],
    stock: 9,
    rating: 4.8,
    managedBy: "ADMIN KB",
    brand: "Cisco Systems",
    warranty: "12 tháng",
    origin: "Chính hãng USA",
    condition: "Mới 100% Nguyên Seal"
  },
  {
    id: "kb-ssd-08",
    name: "SSD Enterprise Samsung PM893 1.92TB",
    category: "Storage",
    price: 6700000,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600"
    ],
    description: "Ổ cứng thể rắn Samsung PM893 chuyên dụng cho máy chủ và mảng lưu trữ đám mây, độ bền cực cao, hoạt động liên tục 24/7 không suy giảm hiệu suất.",
    specs: [
      "Dung lượng 1.92TB SATA 2.5 inch",
      "Tốc độ đọc/ghi tuần tự: 550/520 MB/s",
      "Độ bền ghi chép: 1.3 DWPD (Drive Writes Per Day)",
      "Tính năng bảo vệ mất điện đột ngột PLP"
    ],
    stock: 25,
    rating: 4.9,
    managedBy: "ADMIN KB",
    brand: "Samsung",
    warranty: "36 tháng",
    origin: "Chính hãng Korea",
    condition: "Mới 100% Nguyên Seal"
  }
];

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { getInventoryProducts } = await import('../backend/inventory');
    return await getInventoryProducts();
  } catch (error) {
    console.error("Failed to dynamically import backend inventory service:", error);
    return mockProducts;
  }
}
