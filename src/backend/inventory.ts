import { Product, mockProducts } from '../api/inventory';

// Load API key from environment variables (Vite build time injection)
const API_KEY_INVENTORY = import.meta.env.VITE_API_KEY_INVENTORY || "YOUR_API_KEY_HERE";

/**
 * Service to fetch inventory products from the external KBTech API.
 * Separated into the backend folder to manage the data layers and transform raw API data into UI-ready models.
 */
export async function getInventoryProducts(): Promise<Product[]> {
  const url = "https://inventory.kbtech.vn/api/public/inventory/brand/ad3c4860-1bcf-4f23-9333-57cd52c50b14";

  // If the API key is still the default placeholder, log warning and use mock data immediately
  if (API_KEY_INVENTORY === "YOUR_API_KEY_HERE" || !API_KEY_INVENTORY) {
    console.warn("VITE_API_KEY_INVENTORY is not configured in .env.local. Falling back to mock data.");
    return mockProducts;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-KEY": API_KEY_INVENTORY,
      },
    });

    if (!response.ok) {
      throw new Error(`Inventory API error: ${response.status}`);
    }

    const result = await response.json();
    const rawData = result.data || [];

    if (rawData.length === 0) {
      return mockProducts;
    }

    return rawData.map((prod: any) => {
      // Safely parse the images JSON string array
      let imagePaths: string[] = [];
      try {
        imagePaths = JSON.parse(prod.images || "[]");
      } catch (e) {
        console.warn(`Failed to parse images for product: ${prod.productName}`, e);
      }

      // Map image IDs to full viewing URLs
      const imagesList = imagePaths.map(
        (file: string) => `https://inventory.kbtech.vn/api/file/view/${file}`
      );

      const defaultImage = imagesList.length > 0 
        ? imagesList[0] 
        : "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80";

      return {
        id: prod.productId || prod.code || Math.random().toString(),
        name: prod.productName || "Sản phẩm KB Tech",
        category: prod.categoryName || "Thiết bị",
        price: prod.salePrice || prod.price || 0,
        image: defaultImage,
        images: imagesList.length > 0 ? imagesList : [defaultImage],
        description: prod.description || `Sản phẩm ${prod.productName || 'chất lượng cao'} chính hãng phân phối bởi KB Tech.`,
        specs: prod.specs ? prod.specs.split('\n') : [
          `Mã thiết bị: ${prod.code || 'N/A'}`,
          `Chi nhánh: ${prod.branchName || 'KB Tech'}`,
          `Đơn vị tính: ${prod.unit || 'Cái'}`
        ],
        stock: prod.quantity || 0,
        rating: 4.8,
        managedBy: "ADMIN KB",
        brand: prod.branchName || "KB Tech",
        warranty: "36 tháng",
        origin: "Chính hãng",
        condition: "Mới 100% Nguyên Seal"
      };
    });
  } catch (error) {
    console.error("Failed to fetch products from external API. Falling back to local catalog. Error details:", error);
    return mockProducts;
  }
}
